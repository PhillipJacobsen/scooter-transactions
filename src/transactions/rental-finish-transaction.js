const Schema = require("./schemas").RentalFinish;
const Crypto = require("@arkecosystem/crypto");
const BigNumber = require("bignumber.js");
const ByteBuffer = require("bytebuffer");

class RentalFinishTransaction extends Crypto.Transactions.Transaction {
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
		const latitudeStartBuffer = Buffer.from(new BigNumber(this.data.asset.gps[0].latitude));
		const longitudeStartBuffer = Buffer.from(new BigNumber(this.data.asset.gps[0].longitude));
		const latitudeFinishBuffer = Buffer.from(new BigNumber(this.data.asset.gps[1].latitude));
		const longitudeFinishBuffer = Buffer.from(new BigNumber(this.data.asset.gps[1].longitude));
		const gpsBytesLength = 4 + 1 + latitudeStartBuffer.length + 1 + longitudeStartBuffer.length
			+ 4 + 1 + latitudeFinishBuffer.length + 1 + longitudeFinishBuffer.length;
		const buffer = new ByteBuffer(8 + 21 + gpsBytesLength + 64 + 1, true);

		buffer.writeUint64(this.data.amount.toString()); // 8
		buffer.append(Crypto.Identities.Address.toBuffer(this.data.recipientId).addressBuffer); // 21

		buffer.writeUint32(this.data.asset.gps[0].timestamp); // 4
		buffer.writeUint8(latitudeStartBuffer.length); // 1
		buffer.append(latitudeStartBuffer); // Varies
		buffer.writeUint8(longitudeStartBuffer.length); // 1
		buffer.append(longitudeStartBuffer); // Varies

		buffer.writeUint32(this.data.asset.gps[1].timestamp); // 4
		buffer.writeUint8(latitudeFinishBuffer.length); // 1
		buffer.append(latitudeFinishBuffer); // Varies
		buffer.writeUint8(longitudeFinishBuffer.length); // 1
		buffer.append(longitudeFinishBuffer); // Varies

		buffer.append(Buffer.from(this.data.asset.sessionId)); // 64
		buffer.writeUint8(this.data.asset.containsRefund ? 1 : 0); // 1

		return buffer;
	}

	deserialize(buffer) {
		this.data.amount = Crypto.Utils.BigNumber.make(buffer.readUint64().toString());
		this.data.recipientId = Crypto.Identities.Address.fromBuffer(buffer.readBytes(21).toBuffer());
		this.data.asset = {
			gps: [{
				timestamp: buffer.readUint32(),
				latitude: buffer.readBytes(buffer.readUint8()).toBuffer().toString(),
				longitude: buffer.readBytes(buffer.readUint8()).toBuffer().toString()
			}, {
				timestamp: buffer.readUint32(),
				latitude: buffer.readBytes(buffer.readUint8()).toBuffer().toString(),
				longitude: buffer.readBytes(buffer.readUint8()).toBuffer().toString()
			}],
			sessionId: buffer.readBytes(64).toBuffer().toString(),
			containsRefund: Boolean(buffer.readUint8().toString())
		};
		this.data.asset.gpsCount = this.data.asset.gps.length;
		this.data.asset.gps[0].human = (new Date(this.data.asset.gps[0].timestamp * 1000)).toJSON();
		this.data.asset.gps[1].human = (new Date(this.data.asset.gps[1].timestamp * 1000)).toJSON();
		this.data.asset.rideDuration = this.data.asset.gps[1].timestamp - this.data.asset.gps[0].timestamp;
	}
}

module.exports = RentalFinishTransaction;