const Schema = require('./schemas').RentalStart;
const Crypto = require('@arkecosystem/crypto');
const ByteBuffer = require('bytebuffer');

class RentalStartTransaction extends Crypto.Transactions.Transaction {
	static get typeGroup() {
		return Schema.properties.typeGroup.const;
	}

	static get type() {
		return Schema.properties.type.transactionType;
	}

	static get key() {
		return Schema.$id;
	}

	static getSchema() {
		return Crypto.Transactions.schemas.extend(Crypto.Transactions.schemas.transactionBaseSchema, Schema);
	}

	static get defaultStaticFee() {
		return Crypto.Utils.BigNumber.make("10000000");
	}

	hasVendorField() {
		return false;
	}

	serialize() {
		const properties = [
			this.data.amount.toString(),
			this.data.recipientId,
			this.data.asset.hash,
			this.data.asset.gps,
			this.data.asset.rate.toString(),
			this.data.asset.optionalInteger ? this.data.asset.optionalInteger.toString() : '',
			this.data.asset.optionalNumber ? this.data.asset.optionalNumber.toString() : ''
		];

		const buffer = new ByteBuffer(properties.join('').length, true);

		for(const property of properties) {
			let bytes = Buffer.from(property, "utf8");

			buffer.writeUint8(bytes.length);
			buffer.append(bytes);
		}

		return buffer;
	}

	deserialize(buffer) {
		this.data.amount = Crypto.Utils.BigNumber.make(buffer.readString(buffer.readUint8()));
		this.data.recipientId = buffer.readString(buffer.readUint8());
		this.data.asset = {
			hash: buffer.readString(buffer.readUint8()),
			gps: buffer.readString(buffer.readUint8()),
			rate: Crypto.Utils.BigNumber.make(buffer.readString(buffer.readUint8()))
		};

		const optionalInteger = buffer.readString(buffer.readUint8());

		if(optionalInteger) {
			this.data.asset.optionalInteger = Number(optionalInteger);
		}

		const optionalNumber = buffer.readString(buffer.readUint8());

		if(optionalNumber) {
			this.data.asset.optionalNumber = Number(optionalNumber);
		}
	}
}

module.exports = RentalStartTransaction;