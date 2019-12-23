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
		return [];
	}

	isActivated() {
		return true;
	}

	async bootstrap(connection, walletManager) {
		const reader = await Transactions.TransactionReader.create(connection, this.getConstructor());

		while(reader.hasNext()) {
			const transactions = await reader.read();

			for(const transaction of transactions) {
				const wallet = walletManager.findByAddress(transaction.recipientId);

				wallet.setAttribute(WalletAttributes.IS_RENTED, true);
				walletManager.reindex(wallet);
			}
		}
	}

	async throwIfCannotBeApplied(transaction, sender, walletManager) {
		if(!transaction.data.asset.hash || !transaction.data.asset.gps || !transaction.data.asset.rate) {
			throw new Errors.IncompleteAssetError();
		}

		const recipient = walletManager.findByAddress(transaction.data.recipientId);

		if(!recipient.hasAttribute(WalletAttributes.IS_REGISTERED_AS_SCOOTER)) {
			throw new Errors.WalletIsNotRegisterdAsAScooter();
		}

		if(recipient.hasAttribute(WalletAttributes.IS_RENTED)) {
			throw new Errors.ScooterIsAlreadyRented();
		}

		await super.throwIfCannotBeApplied(transaction, sender, walletManager);
	}

	emitEvents(transaction, emitter) {
		emitter.emit(Events.RENTAL_START, transaction.data);
	}

	async canEnterTransactionPool(data, pool, processor) {
		const error = await this.typeFromSenderAlreadyInPool(data, pool, processor);

		if(error !== null) {
			processor.pushError(data, error.type, error.message);

			return false;
		}

		let transactions = processor.getTransactions().filter((transaction) => {
			return transaction.type === this.getConstructor().type && transaction.asset.hash === data.asset.hash;
		});

		if(transactions.length > 1) {
			processor.pushError(data, 'ERR_CONFLICT', `Scooter with address "${data.asset.recipientId}" is already rented.`);

			return false;
		}

		transactions = Array.from(await pool.getTransactionsByType(this.getConstructor().type)).filter((transaction) => {
			return transaction.data.asset.hash === data.asset.hash;
		});

		if(transactions.length > 1) {
			processor.pushError(data, 'ERR_PENDING', `Rental start request for scooter with address "${data.asset.recipientId}" is already in the transaction pool.`);

			return false;
		}

		return null;
	}

	async applyToSender(transaction, walletManager) {
	}

	async revertForSender(transaction, walletManager) {
	}

	async applyToRecipient(transaction, walletManager) {
		await super.applyToRecipient(transaction, walletManager);
		const recipient = walletManager.findByAddress(transaction.data.recipientId);

		recipient.setAttribute(WalletAttributes.IS_RENTED, true);
		walletManager.reindex(recipient);
	}

	async revertForRecipient(transaction, walletManager) {
		await super.revertForRecipient(transaction, walletManager);
		const recipient = walletManager.findByAddress(transaction.data.recipientId);

		recipient.forgetAttribute(WalletAttributes.IS_RENTED);
		walletManager.reindex(recipient);
	}
}

module.exports = RentalStartHandler;