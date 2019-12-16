const RentalStartTransaction = require('../transactions/rental-start-transaction');
const Transactions = require('@arkecosystem/core-transactions');
const WalletAttributes = require('./wallet-attributes');
const Errors = require('../errors');
const Events = require('../events');

class RentalStartHandler extends Transactions.Handlers.TransactionHandler {
	getConstructor() {
		return RentalStartTransaction;
	}

	dependencies() {
		return [];
	}

	walletAttributes() {
		return [
			WalletAttributes.IS_RENTED
		];
	}

	isActivated() {
		return true;
	}

	async bootstrap(connection, walletManager) {
		const reader = await Transactions.TransactionReader.create(connection, this.getConstructor());

		while(reader.hasNext()) {
			const transactions = await reader.read();

			for(const transaction of transactions) {
				const wallet = walletManager.findByPublicKey(transaction.senderPublicKey);

				wallet.setAttribute(WalletAttributes.IS_RENTED, true);
				walletManager.reindex(wallet);
			}
		}
	}

	async throwIfCannotBeApplied(transaction, sender, walletManager) {
		if(!transaction.data.asset.scooterId
			|| !transaction.data.asset.hash
			|| !transaction.data.asset.gps
			|| !transaction.data.asset.rate
		) {
			throw new Errors.IncompleteAssetError();
		}

		if(!sender.hasAttribute('isRegisteredAsScooter')) {
			throw new Errors.WalletIsNotRegisterdAsAScooter();
		}

		if(sender.hasAttribute(WalletAttributes.IS_RENTED)) {
			throw new Errors.ScooterIsAlreadyRented();
		}

		await super.throwIfCannotBeApplied(transaction, sender, walletManager);
	}

	emitEvents(transaction, emitter) {
		emitter.emit(Events.RENTAL_START, transaction.data);
	}

	async canEnterTransactionPool(data, pool, processor) {
		if(await this.typeFromSenderAlreadyInPool(data, pool, processor)) {
			return false;
		}

		let transactions = processor.getTransactions().filter((transaction) => {
			return transaction.type === this.getConstructor().type && transaction.asset.scooterId === data.asset.scooterId;
		});

		if(transactions.length > 1) {
			processor.pushError(data, 'ERR_CONFLICT', `Scooter "${data.asset.scooterId}" is already rented.`);

			return false;
		}

		transactions = Array.from(await pool.getTransactionsByType(this.getConstructor().type)).filter((transaction) => {
			return transaction.data.asset.scooterId === data.asset.scooterId;
		});

		if(transactions.length > 1) {
			processor.pushError(data, 'ERR_PENDING', `Rental request for scooter "${data.asset.scooterId}" is already in the transaction pool.`);

			return false;
		}

		return true;
	}

	async applyToSender(transaction, walletManager) {
		await super.applyToSender(transaction, walletManager);
		const sender = walletManager.findByPublicKey(transaction.data.senderPublicKey);

		sender.setAttribute(WalletAttributes.IS_RENTED, true);
		walletManager.reindex(sender);
	}

	async revertForSender(transaction, walletManager) {
		await super.revertForSender(transaction, walletManager);
		const sender = walletManager.findByPublicKey(transaction.data.senderPublicKey);

		sender.forgetAttribute(WalletAttributes.IS_RENTED);
		walletManager.reindex(sender);
	}

	async applyToRecipient(transaction, walletManager) {
	}

	async revertForRecipient(transaction, walletManager) {
	}
}

module.exports = RentalStartHandler;