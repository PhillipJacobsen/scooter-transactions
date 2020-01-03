const RentalStartTransaction = require('../transactions/rental-start-transaction');
const Crypto = require('@arkecosystem/crypto');

class RentalStartBuilder extends Crypto.Transactions.TransactionBuilder {
	constructor() {
		super();
		this.data.type = RentalStartTransaction.type;
		this.data.typeGroup = RentalStartTransaction.typeGroup;
		this.data.version = 2;
		this.data.fee = RentalStartTransaction.defaultStaticFee;
		this.data.amount = Crypto.Utils.BigNumber.ZERO;
		this.data.asset = {};
	}

	hash(value) {
		this.data.asset.hash = value;

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

	rate(amount) {
		this.data.asset.rate = Crypto.Utils.BigNumber.make(amount);

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

module.exports = new RentalStartBuilder();