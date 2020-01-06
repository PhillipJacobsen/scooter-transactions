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
		return true;
	}

	serialize() {
		const properties = [
			this.data.amount.toString(),
			this.data.recipientId,
			this.data.asset.hash,
			JSON.stringify(this.data.asset.gps),
			this.data.asset.rate.toString(),
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
			gps: JSON.parse(buffer.readString(buffer.readUint8())),
			rate: Crypto.Utils.BigNumber.make(buffer.readString(buffer.readUint8()))
		};
	}
}

module.exports = RentalStartTransaction;