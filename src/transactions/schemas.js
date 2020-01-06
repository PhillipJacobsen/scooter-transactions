const SchemaParameters = require("./schema-parameters");
const Types = require("./types");

module.exports = {
	ScooterRegistration: {
		$id: "scooterRegistration",
		required: ["asset", "type", "typeGroup"],
		properties: {
			type: {
				transactionType: Types.SCOOTER_REGISTRATION_TYPE
			},
			typeGroup: {
				const: Types.TYPE_GROUP
			},
			amount: {
				bignumber: {
					minimum: 0,
					maximum: 0
				}
			},
			asset: {
				type: "object",
				required: ["scooterId"],
				properties: {
					scooterId: SchemaParameters.SCOOTER_ID
				}
			}
		}
	},
	RentalStart: {
		$id: "rentalStart",
		required: ["asset", "type", "typeGroup", "recipientId"],
		properties: {
			type: {
				transactionType: Types.RENTAL_START_TYPE
			},
			typeGroup: {
				const: Types.TYPE_GROUP
			},
			recipientId: {$ref: "address"},
			vendorField: SchemaParameters.VENDORFIELD,
			asset: {
				type: "object",
				required: ["hash", "gps", "rate"],
				properties: {
					hash: {
						type: "string",
						minLength: 1,
						maxLength: 64
					},
					gps: {
						type: "array",
						minItems: 1,
						maxItems: 1,
						items: SchemaParameters.GPS_POINT
					},
					rate: {
						bignumber: {
							minimum: 1
						}
					},
				}
			}
		}
	},
	RentalFinish: {
		$id: "rentalFinish",
		required: ["asset", "type", "typeGroup", "recipientId"],
		properties: {
			type: {
				transactionType: Types.RENTAL_FINISH_TYPE
			},
			typeGroup: {
				const: Types.TYPE_GROUP
			},
			recipientId: {$ref: "address"},
			vendorField: SchemaParameters.VENDORFIELD,
			asset: {
				type: "object",
				required: ["gps", "rentalStartTransactionId", "rideDuration"],
				properties: {
					gps: {
						type: "array",
						minItems: 2,
						maxItems: 2,
						items: SchemaParameters.GPS_POINT
					},
					rentalStartTransactionId: SchemaParameters.TRANSACTION_ID,
					containsRefund: SchemaParameters.CONTAINS_REFUND,
					rideDuration: SchemaParameters.RIDE_DURATION_IN_MINUTES,
				}
			}
		}
	}
};