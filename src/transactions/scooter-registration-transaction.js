const Schema = require('./schemas').ScooterRegistration;
const Crypto = require('@arkecosystem/crypto');
const ByteBuffer = require('bytebuffer');

class ScooterRegistrationTransaction extends Crypto.Transactions.Transaction {
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
		return Crypto.Utils.BigNumber.make("3000000000");
	}

	serialize() {
		const {data} = this;
		const bytes = Buffer.from(data.asset.scooterId);
		const buffer = new ByteBuffer(bytes.length, true);

		buffer.writeUint8(bytes.length);
		buffer.append(bytes, "hex");

		return buffer;
	}

	deserialize(buffer) {
		this.data.asset = {
			scooterId: buffer.readString(buffer.readUint8())
		};
	}
}

module.exports = ScooterRegistrationTransaction;