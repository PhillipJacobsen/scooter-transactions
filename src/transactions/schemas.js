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
				required: ["hash", "gpsLong", "gpsLat", "rate"],
				properties: {
					hash: {
						type: "string",
						minLength: 1,
						maxLength: 64
					},
					gpsLong: SchemaParameters.GPS_LONG,
					gpsLat: SchemaParameters.GPS_LAT,
					rate: {
						bignumber: {
							minimum: 1
						}
					},
					optionalInteger: SchemaParameters.INTEGER_PARAMETER,
					optionalNumber: SchemaParameters.NUMBER_PARAMETER
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
				required: ["gpsStartLong", "gpsStartLat", "gpsFinishLong", "gpsFinishLat", "rentalStartTransactionId", "rideDuration"],
				properties: {
					gpsStartLong: SchemaParameters.GPS_LONG,
					gpsStartLat: SchemaParameters.GPS_LAT,
					gpsFinishLong: SchemaParameters.GPS_LONG,
					gpsFinishLat: SchemaParameters.GPS_LAT,
					rentalStartTransactionId: SchemaParameters.TRANSACTION_ID,
					containsRefund: SchemaParameters.CONTAINS_REFUND,
					rideDuration: SchemaParameters.RIDE_DURATION_IN_MINUTES,
					optionalInteger: SchemaParameters.INTEGER_PARAMETER,
					optionalNumber: SchemaParameters.NUMBER_PARAMETER
				}
			}
		}
	}
};