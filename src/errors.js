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

class WalletIsNotRegisterdAsAScooter extends Transactions.Errors.TransactionError {
	constructor() {
		super('Wallet is not registered as a scooter.');
	}
}

class ScooterIsAlreadyRented extends Transactions.Errors.TransactionError {
	constructor() {
		super('This scooter is already rented.');
	}
}

class ScooterIsNotRented extends Transactions.Errors.TransactionError {
	constructor() {
		super('This scooter is not rented.');
	}
}

module.exports = {
	IncompleteAssetError,
	WalletIsAlreadyRegisterdAsAScooter,
	WalletIsNotRegisterdAsAScooter,
	ScooterIsAlreadyRented,
	ScooterIsNotRented
};