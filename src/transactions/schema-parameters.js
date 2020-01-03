const parameters = {
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
	}
};

parameters.REFUND_TRANSACTION_ID = {
	anyOf: [{type: "null"}, parameters.TRANSACTION_ID]
};

module.exports = parameters;