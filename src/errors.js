const Transactions = require('@arkecosystem/core-transactions');

class IncompleteAssetError extends Transactions.Errors.TransactionError {
	constructor() {
		super('Incomplete asset data.');
	}
}

class WalletIsAlreadyRegisterdAsAScooter extends Transactions.Errors.TransactionError {
	constructor() {
		super('Wallet is already registered as a scooter.');
	}
}

module.exports = {
	IncompleteAssetError,
	WalletIsAlreadyRegisterdAsAScooter,
};