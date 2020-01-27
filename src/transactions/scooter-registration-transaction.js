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
		const buffer = new ByteBuffer(10, true);

		buffer.append(Buffer.from(this.data.asset.scooterId));

		return buffer;
	}

	deserialize(buffer) {
		this.data.asset = {
			scooterId: buffer.readBytes(10).toBuffer().toString()
		};
	}
}

module.exports = ScooterRegistrationTransaction;