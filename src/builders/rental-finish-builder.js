const RentalFinishTransaction = require('../transactions/rental-finish-transaction');
const Crypto = require('@arkecosystem/crypto');

class RentalFinishBuilder extends Crypto.Transactions.TransactionBuilder {
	constructor() {
		super();
		this.reset();
	}

	sessionId(sha256) {
		this.data.asset.sessionId = sha256;

		return this.instance();
	}

	gps(timestamp, latitude, longitude) {
		const date = new Date(timestamp);

		this.data.asset.gps.push({
			timestamp: Math.floor(date.getTime() / 1000),
			latitude: latitude,
			longitude: longitude
		});

		return this.instance();
	}

	containsRefund(bool) {
		this.data.asset.containsRefund = bool;

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

	reset() {
		this.data.type = RentalFinishTransaction.type;
		this.data.typeGroup = RentalFinishTransaction.typeGroup;
		this.data.version = 2;
		this.data.fee = RentalFinishTransaction.defaultStaticFee;
		this.data.amount = Crypto.Utils.BigNumber.ZERO;
		this.data.asset = {
			gps: []
		};
	}
}

module.exports = new RentalFinishBuilder();