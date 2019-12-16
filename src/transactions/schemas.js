const SchemaParameters = require("./schema-parameters");
const Types = require("./types");
const SCOOTER_ID = "scooterId";

module.exports = {
	ScooterRegistrationSchema: {
		$id: SCOOTER_ID,
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
				required: [SCOOTER_ID],
				properties: {
					[SCOOTER_ID]: SchemaParameters.SCOOTER_ID,
				}
			}
		}
	}
};