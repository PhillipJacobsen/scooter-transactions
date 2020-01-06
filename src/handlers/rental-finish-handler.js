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
		if(!transaction.data.asset.gps || !transaction.data.asset.rideDuration || !transaction.data.asset.rentalStartTransactionId
			|| !transaction.data.asset.containsRefund) {
			throw new Errors.IncompleteAssetError();
		}

		await super.throwIfCannotBeApplied(transaction, sender, walletManager);

		if(!sender.getAttribute(WalletAttributes.IS_REGISTERED_AS_SCOOTER)) {
			throw new Errors.WalletIsNotRegisterdAsAScooter();
		}

		if(!sender.getAttribute(WalletAttributes.IS_RENTED)) {
			throw new Errors.ScooterIsNotRented();
		}

		// TODO get tx by transaction.asset.rentalStartTransactionId and validate if scooterId matches.
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
			return transaction.type === this.getConstructor().type && transaction.asset.rentalStartTransactionId === data.asset.rentalStartTransactionId;
		});

		if(transactions.length > 1) {
			processor.pushError(data, 'ERR_CONFLICT', `Scooter with public key "${data.senderPublicKey}" is already rented.`);

			return false;
		}

		transactions = Array.from(await pool.getTransactionsByType(this.getConstructor().type)).filter((transaction) => {
			return transaction.data.asset.rentalStartTransactionId === data.asset.rentalStartTransactionId;
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