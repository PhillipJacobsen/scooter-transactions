const Transactions = require('@arkecosystem/core-transactions');
const ScooterRegistrationTransaction = require('../transactions/scooter-registration-transaction');
const Errors = require('../errors');

class ScooterRegistrationHandler extends Transactions.Handlers.TransactionHandler {
	getConstructor() {
		return ScooterRegistrationTransaction;
	}

	dependencies() {
		return [];
	}

	walletAttributes() {
		return [
			'transactionWalletKeyName'
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

				wallet.setAttribute('transactionWalletKeyName', transaction.asset);
				walletManager.reindex(wallet);
			}
		}
	}

	async throwIfCannotBeApplied(transaction, sender, walletManager) {
		if(!transaction.data.asset.scooterId) {
			throw new Errors.ScooterRegistrationAssetError();
		}

		if(sender.hasAttribute('transactionWalletKeyName')) {
			throw new Errors.WalletIsAlreadyRegisterdAsAScooter();
		}

		await super.throwIfCannotBeApplied(transaction, sender, walletManager);
	}

	emitEvents(transaction, emitter) {
		emitter.emit('scooter.registered', transaction.data);
	}

	async canEnterTransactionPool(data, pool, processor) {
		if(await this.typeFromSenderAlreadyInPool(data, pool, processor)) {
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

		return true;
	}

	async applyToSender(transaction, walletManager) {
		await super.applyToSender(transaction, walletManager);
		const sender = walletManager.findByPublicKey(transaction.data.senderPublicKey);

		sender.setAttribute('transactionWalletKeyName', transaction.data.asset);
		walletManager.reindex(sender);
	}

	async revertForSender(transaction, walletManager) {
		await super.revertForSender(transaction, walletManager);
		const sender = walletManager.findByPublicKey(transaction.data.senderPublicKey);

		sender.forgetAttribute('transactionWalletKeyName');
		walletManager.reindex(sender);
	}

	async applyToRecipient(transaction, walletManager) {
	}

	async revertForRecipient(transaction, walletManager) {
	}
}

module.exports = ScooterRegistrationHandler;