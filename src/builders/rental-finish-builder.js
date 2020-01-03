const RentalFinishTransaction = require('../transactions/rental-finish-transaction');
const Crypto = require('@arkecosystem/crypto');

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

	rentalStartTransactionId(id) {
		this.data.asset.rentalStartTransactionId = id;

		return this.instance();
	}

	gpsLong(long) {
		this.data.asset.gpsLong = long;

		return this.instance();
	}

	gpsLat(lat) {
		this.data.asset.gpsLat = lat;

		return this.instance();
	}

	refundTransactionId(id) {
		this.data.asset.refundTransactionId = id;

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