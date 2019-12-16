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
		required: ["asset", "type", "typeGroup"],
		properties: {
			type: {
				transactionType: Types.RENTAL_START_TYPE
			},
			typeGroup: {
				const: Types.TYPE_GROUP
			},
			asset: {
				type: "object",
				required: ["hash", "gps", "rate"],
				properties: {
					hash: {
						type: "string",
						minLength: 1,
						maxLength: 64
					},
					gps: SchemaParameters.GPS,
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
	}
};