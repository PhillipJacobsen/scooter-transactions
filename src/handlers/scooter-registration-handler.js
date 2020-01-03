const ScooterRegistrationTransaction = require('../transactions/scooter-registration-transaction');
const Transactions = require('@arkecosystem/core-transactions');
const WalletAttributes = require('./wallet-attributes');
const Errors = require('../errors');
const Events = require('../events');

class ScooterRegistrationHandler extends Transactions.Handlers.TransactionHandler {
	getConstructor() {
		return ScooterRegistrationTransaction;
	}

	dependencies() {
		return [];
	}

	walletAttributes() {
		return [
			WalletAttributes.IS_REGISTERED_AS_SCOOTER
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
				const wallet = walletManager.findByAddress(transaction.recipientId);

				wallet.setAttribute(WalletAttributes.IS_REGISTERED_AS_SCOOTER, true);
				walletManager.reindex(wallet);
			}
		}
	}

	async throwIfCannotBeApplied(transaction, sender, walletManager) {
		if(!transaction.data.asset.scooterId) {
			throw new Errors.IncompleteAssetError();
		}

		if(sender.getAttribute(WalletAttributes.IS_REGISTERED_AS_SCOOTER)) {
			throw new Errors.WalletIsAlreadyRegisterdAsAScooter();
		}

		await super.throwIfCannotBeApplied(transaction, sender, walletManager);
	}

	emitEvents(transaction, emitter) {
		emitter.emit(Events.SCOOTER_REGISTERED, transaction.data);
	}

	async canEnterTransactionPool(data, pool, processor) {
		const error = await this.typeFromSenderAlreadyInPool(data, pool, processor);

		if(error !== null) {
			processor.pushError(data, error.type, error.message);

			return false;
		}

		const transactionsWithGivenScooterId = processor.getTransactions().filter((transaction) => {
			return transaction.type === this.getConstructor().type && transaction.asset.scooterId === data.asset.scooterId;
		});

		if(transactionsWithGivenScooterId.length > 1) {
			processor.pushError(data, 'ERR_CONFLICT', `Scooter registration ID "${data.asset.scooterId}" already exists.`);

			return false;
		}

		const poolTransactionsWithGivenScooterId = Array.from(await pool.getTransactionsByType(this.getConstructor().type)).filter((transaction) => {
			return transaction.data.asset.scooterId === data.asset.scooterId;
		});

		if(poolTransactionsWithGivenScooterId.length > 1) {
			processor.pushError(data, 'ERR_PENDING', `Scooter registration ID "${data.asset.scooterId}" is already in the pool.`);

			return false;
		}

		return null;
	}

	async applyToSender(transaction, walletManager) {
		await super.applyToSender(transaction, walletManager);
		const sender = walletManager.findByPublicKey(transaction.data.senderPublicKey);

		sender.setAttribute(WalletAttributes.IS_REGISTERED_AS_SCOOTER, true);
		walletManager.reindex(sender);
	}

	async revertForSender(transaction, walletManager) {
		await super.revertForSender(transaction, walletManager);
		const sender = walletManager.findByPublicKey(transaction.data.senderPublicKey);

		sender.setAttribute(WalletAttributes.IS_REGISTERED_AS_SCOOTER, false);
		walletManager.reindex(sender);
	}

	async applyToRecipient(transaction, walletManager) {
	}

	async revertForRecipient(transaction, walletManager) {
	}
}

module.exports = ScooterRegistrationHandler;