const ScooterRegistrationTransaction = require('../transactions/scooter-registration-transaction');
const Crypto = require('@arkecosystem/crypto');

class ScooterRegistrationBuilder extends Crypto.Transactions.TransactionBuilder {
	constructor() {
		super();
		this.data.type = ScooterRegistrationTransaction.type;
		this.data.typeGroup = ScooterRegistrationTransaction.typeGroup;
		this.data.version = 2;
		this.data.fee = ScooterRegistrationTransaction.defaultStaticFee;
		this.data.amount = Crypto.Utils.BigNumber.ZERO;
		this.data.asset = {};
	}

	scooterId(id) {
		this.data.asset.scooterId = id;

		return this;
	}

	getStruct() {
		const struct = super.getStruct();

		struct.amount = this.data.amount;
		struct.asset = this.data.asset;

		return struct;
	}

	instance() {
		return this;
	}
}

module.exports = new ScooterRegistrationBuilder();