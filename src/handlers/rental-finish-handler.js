const RentalFinishTransaction = require('../transactions/rental-finish-transaction');
const Transactions = require('@arkecosystem/core-transactions');
const WalletAttributes = require('./wallet-attributes');
const Errors = require('../errors');
const Events = require('../events');

class RentalFinishHandler extends Transactions.Handlers.TransactionHandler {
	getConstructor() {
		return RentalFinishTransaction;
	}

	dependencies() {
		return [];
	}

	walletAttributes() {
		return [];
	}

	isActivated() {
		return true;
	}

	hasVendorField() {
		return true;
	}

	async bootstrap(connection, walletManager) {
		const reader = await Transactions.TransactionReader.create(connection, this.getConstructor());

		while(reader.hasNext()) {
			const transactions = await reader.read();

			for(const transaction of transactions) {
				const wallet = walletManager.findByAddress(transaction.recipientId);

				wallet.setAttribute(WalletAttributes.IS_RENTED, false);
				walletManager.reindex(wallet);
			}
		}
	}

	async throwIfCannotBeApplied(transaction, sender, walletManager) {
		if(!transaction.data.asset.gps || !transaction.data.asset.rideDuration || !transaction.data.asset.sessionId
			|| typeof transaction.data.asset.containsRefund !== 'boolean') {
			throw new Errors.IncompleteAssetError();
		}

		await super.throwIfCannotBeApplied(transaction, sender, walletManager);

		if(!sender.getAttribute(WalletAttributes.IS_REGISTERED_AS_SCOOTER)) {
			throw new Errors.WalletIsNotRegisterdAsAScooter();
		}

		if(!sender.getAttribute(WalletAttributes.IS_RENTED)) {
			throw new Errors.ScooterIsNotRented();
		}
	}

	emitEvents(transaction, emitter) {
		emitter.emit(Events.RENTAL_FINISH, transaction.data);
	}

	async canEnterTransactionPool(data, pool, processor) {
		const error = await this.typeFromSenderAlreadyInPool(data, pool, processor);

		if(error !== null) {
			processor.pushError(data, error.type, error.message);

			return false;
		}

		let transactions = processor.getTransactions().filter((transaction) => {
			return transaction.type === this.getConstructor().type && transaction.asset.sessionId === data.asset.sessionId;
		});

		if(transactions.length > 1) {
			processor.pushError(data, 'ERR_CONFLICT', `The rental for scooter with public key  "${data.senderPublicKey}" is already finished.`);

			return false;
		}

		transactions = Array.from(await pool.getTransactionsByType(this.getConstructor().type)).filter((transaction) => {
			return transaction.data.asset.sessionId === data.asset.sessionId;
		});

		if(transactions.length > 1) {
			processor.pushError(data, 'ERR_PENDING', `Rental finish request for scooter with public key "${data.senderPublicKey}" is already in the transaction pool.`);

			return false;
		}

		return null;
	}

	async applyToSender(transaction, walletManager) {
		await super.applyToSender(transaction, walletManager);

		const sender = walletManager.findByPublicKey(transaction.data.senderPublicKey);

		sender.setAttribute(WalletAttributes.IS_RENTED, false);
		walletManager.reindex(sender);
	}

	async revertForSender(transaction, walletManager) {
		await super.revertForSender(transaction, walletManager);

		const sender = walletManager.findByPublicKey(transaction.data.senderPublicKey);

		sender.setAttribute(WalletAttributes.IS_RENTED, true);
		walletManager.reindex(sender);
	}

	async applyToRecipient(transaction, walletManager) {
	}

	async revertForRecipient(transaction, walletManager) {
	}
}

module.exports = RentalFinishHandler;