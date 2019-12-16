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
					"scooterId": SchemaParameters.SCOOTER_ID,
				}
			}
		}
	},
	RentalStart: {
		$id: "rentalStart",
		required: ["asset", "type", "typeGroup"],
		properties: {
			type: {
				transactionType: Types.RENTAL_START_TYPE
			},
			typeGroup: {
				const: Types.TYPE_GROUP
			},
			amount: {
				bignumber: {
					minimum: 1,
				}
			},
			asset: {
				type: "object",
				required: ["scooterId", "hash", "gps", "rate"],
				properties: {
					scooterId: SchemaParameters.SCOOTER_ID,
					hash: {
						type: "string",
						minLength: 1,
						maxLength: 64
					},
					gps: SchemaParameters.GPS,
					rate: {
						bignumber: {
							minimum: 1,
						}
					},
					optional1: SchemaParameters.OPTIONAL_PARAMETER_1,
					optional2: SchemaParameters.OPTIONAL_PARAMETER_2,
					optional3: SchemaParameters.OPTIONAL_PARAMETER_3,
				}
			}
		}
	}
};