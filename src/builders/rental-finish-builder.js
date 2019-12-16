const Crypto = require('@arkecosystem/crypto');
const RentalFinishTransaction = require('../transactions/rental-finish-transaction');

class RentalFinishBuilder extends Crypto.Transactions.TransactionBuilder {
	constructor() {
		super();
		this.data.type = RentalFinishTransaction.type;
		this.data.typeGroup = RentalFinishTransaction.typeGroup;
		this.data.version = 2;
		this.data.fee = RentalFinishTransaction.defaultStaticFee;
		this.data.amount = Crypto.Utils.BigNumber.ZERO;
		this.data.asset = {};
	}

	rentalTransactionId(id) {
		this.data.asset.rentalTransactionId = id;

		return this.instance();
	}

	gps(coordinates) {
		this.data.asset.gps = coordinates;

		return this.instance();
	}

	optionalInteger(value) {
		this.data.asset.optionalInteger = value;

		return this.instance();
	}

	optionalNumber(value) {
		this.data.asset.optionalNumber = value;

		return this.instance();
	}

	getStruct() {
		const struct = super.getStruct();

		struct.amount = this.data.amount;
		struct.asset = this.data.asset;
		struct.vendorField = this.data.vendorField;
		struct.recipientId = this.data.recipientId;

		return struct;
	}

	instance() {
		return this;
	}
}

module.exports = new RentalFinishBuilder();