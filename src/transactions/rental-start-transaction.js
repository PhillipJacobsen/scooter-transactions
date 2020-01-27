const Schema = require("./schemas").RentalStart;
const Crypto = require("@arkecosystem/crypto");
const BigNumber = require("bignumber.js");
const ByteBuffer = require("bytebuffer");

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
		const latitudeBuffer = Buffer.from(new BigNumber(this.data.asset.gps.latitude));
		const longitudeBuffer = Buffer.from(new BigNumber(this.data.asset.gps.longitude));

		const buffer = new ByteBuffer(8 + 21 + 4 + 1 + latitudeBuffer.length + 1 + longitudeBuffer.length + 64 + 8, true);

		buffer.writeUint64(this.data.amount.toString()); // 8
		buffer.append(Crypto.Identities.Address.toBuffer(this.data.recipientId).addressBuffer); // 21
		buffer.writeUint32(this.data.asset.gps.timestamp); // 4
		buffer.writeUint8(latitudeBuffer.length); // 1
		buffer.append(latitudeBuffer); // Varies
		buffer.writeUint8(longitudeBuffer.length); // 1
		buffer.append(longitudeBuffer); // Varies
		buffer.append(Buffer.from(this.data.asset.sessionId)); // 64
		buffer.writeUint64(this.data.asset.rate.toString()); // 8

		return buffer;
	}

	deserialize(buffer) {
		this.data.amount = Crypto.Utils.BigNumber.make(buffer.readUint64().toString());
		this.data.recipientId = Crypto.Identities.Address.fromBuffer(buffer.readBytes(21).toBuffer());
		this.data.asset = {
			gps: {
				timestamp:  buffer.readUint32(),
				latitude: buffer.readBytes(buffer.readUint8()).toBuffer().toString(),
				longitude: buffer.readBytes(buffer.readUint8()).toBuffer().toString()
			},
			sessionId: buffer.readBytes(64).toBuffer().toString(),
			rate: Crypto.Utils.BigNumber.make(buffer.readUint64().toString()),
		};
		this.data.asset.gpsCount = 1;
		this.data.asset.gps.human = (new Date(this.data.asset.gps.timestamp * 1000)).toJSON();
	}
}

module.exports = RentalStartTransaction;