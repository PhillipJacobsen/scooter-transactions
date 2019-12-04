const Transactions = require('@arkecosystem/core-transactions');

class ScooterRegistrationAssetError extends Transactions.Errors.TransactionError {
	constructor() {
		super('Incomplete scooter registration asset.');
	}
}

class WalletIsAlreadyRegisterdAsAScooter extends Transactions.Errors.TransactionError {
	constructor() {
		super('Wallet is already registered as a scooter.');
	}
}

module.exports = {
	ScooterRegistrationAssetError,
	WalletIsAlreadyRegisterdAsAScooter,
};