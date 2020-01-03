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

	gpsStartLong(long) {
		this.data.asset.gpsStartLong = long;

		return this.instance();
	}

	gpsStartLat(lat) {
		this.data.asset.gpsStartLat = lat;

		return this.instance();
	}

	gpsFinishLong(long) {
		this.data.asset.gpsFinishLong = long;

		return this.instance();
	}

	gpsFinishLat(lat) {
		this.data.asset.gpsFinishLat = lat;

		return this.instance();
	}

	containsRefund(bool) {
		this.data.asset.containsRefund = bool;

		return this.instance();
	}

	rideDuration(minutes) {
		this.data.asset.rideDuration = minutes;

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