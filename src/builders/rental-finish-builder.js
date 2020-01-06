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
		this.data.asset = {
			gps: []
		};
	}

	rentalStartTransactionId(id) {
		this.data.asset.rentalStartTransactionId = id;

		return this.instance();
	}

	// TODO create abstract class and move this function up.
	gps(timestamp, lat, long) {
		const date = new Date(timestamp);

		this.data.asset.gps.push({
			timestamp: {
				epoch: Math.floor(date.getTime() / 1000),
				human: date.toJSON()
			},
			lat: lat,
			long: long
		});

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