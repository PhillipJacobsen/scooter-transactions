module.exports = {
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
	GPS_LONG: {
		type: "string",
		minLength: 1,
		maxLength: 16
	},
	GPS_LAT: {
		type: "string",
		minLength: 1,
		maxLength: 16
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
	}
};