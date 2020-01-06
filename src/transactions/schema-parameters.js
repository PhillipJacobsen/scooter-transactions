const Schemas = {
	SCOOTER_ID: {
		type: "string",
		minLength: 10,
		maxLength: 10
	},
	INTEGER_PARAMETER: {
		anyOf: [{type: "null"}, {type: "integer", maxLength: 64}]
	},
	NUMBER_PARAMETER: {
		anyOf: [{type: "null"}, {type: "number", maxLength: 64}]
	},
	GPS_COORDINATE: {
		type: "string",
		minLength: 1,
		maxLength: 16
	},
	TIMESTAMP: {
		type: "object",
		required: ["epoch", "human"],
		properties: {
			epoch: {
				type: "integer",
				minimum: 0
			},
			human: {
				type: "string",
				minimum: 0
			}
		}
	},
	TRANSACTION_ID: {
		$ref: "transactionId"
	},
	VENDORFIELD: {
		anyOf: [{type: "null"}, {type: "string", format: "vendorField"}]
	},
	RIDE_DURATION_IN_MINUTES: {
		type: "integer",
		maxLength: 12
	},
	CONTAINS_REFUND: {
		type: "boolean"
	},
	GPS_POINT: {
		type: "object",
		required: ["timestamp", "long", "lat"],
		properties: undefined
	}
};

Schemas.GPS_POINT.properties = {
	timestamp: Schemas.TIMESTAMP,
	long: Schemas.GPS_COORDINATE,
	lat: Schemas.GPS_COORDINATE
};

module.exports = Schemas;