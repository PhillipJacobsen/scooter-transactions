const Crypto = require('@arkecosystem/crypto');
const ByteBuffer = require('bytebuffer');
const SCOOTER_REGISTRATION_TYPE = 400;
const SCOOTER_REGISTRATION_TYPE_GROUP = 4000;

class ScooterRegistrationTransaction extends Crypto.Transactions.Transaction {
	static get typeGroup() {
		return SCOOTER_REGISTRATION_TYPE_GROUP;
	}

	static get type() {
		return SCOOTER_REGISTRATION_TYPE;
	}

	static get key() {
		return 'scooter_registration_transaction_key';
	}

	static getSchema() {
		return Crypto.Transactions.schemas.extend(Crypto.Transactions.schemas.transactionBaseSchema, {
			$id: "scooterId",
			required: ["asset", "typeGroup"],
			properties: {
				type: {transactionType: SCOOTER_REGISTRATION_TYPE},
				typeGroup: {const: SCOOTER_REGISTRATION_TYPE_GROUP},
				amount: {bignumber: {minimum: 0, maximum: 0}},
				asset: {
					type: "object",
					required: ["scooterId"],
					properties: {
						scooterId: {
							type: "string",
							minLength: 10,
							maxLength: 10
						}
					}
				}
			}
		});
	}

	static get defaultStaticFee() {
		return Crypto.Utils.BigNumber.make("3000000000");
	}

	serialize() {
		const {data} = this;
		const scooterId = data.asset.scooterId;
		const scooterIdBytes = Buffer.from(scooterId, "utf8");
		const buffer = new ByteBuffer(scooterIdBytes.length, true);

		buffer.writeUint8(scooterIdBytes.length);
		buffer.append(scooterIdBytes, "hex");

		return buffer;
	}

	deserialize(buffer) {
		const {data} = this;
		const scooterIdLength = buffer.readUint8();
		const scooterId = buffer.readString(scooterIdLength);

		data.asset = {
			scooterId: scooterId
		};
	}
}

module.exports = ScooterRegistrationTransaction;