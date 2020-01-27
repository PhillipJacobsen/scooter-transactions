const RentalStartTransaction = require('../transactions/rental-start-transaction');
const Crypto = require('@arkecosystem/crypto');
const BigNumber = require('bignumber.js');

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

	sessionId(id) {
		this.data.asset.sessionId = Crypto.Crypto.HashAlgorithms.sha256(Buffer.from(id, 'hex')).toString('hex');

		return this.instance();
	}

	gps(timestamp, latitude, longitude) {
		const date = new Date(timestamp);

		this.data.asset.gps = {
			timestamp: Math.floor(date.getTime() / 1000),
			latitude: (new BigNumber(latitude)).toString(),
			longitude: (new BigNumber(longitude)).toString()
		};

		return this.instance();
	}

	rate(amount) {
		this.data.asset.rate = Crypto.Utils.BigNumber.make(amount);

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