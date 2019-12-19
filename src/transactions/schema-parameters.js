module.exports = {
	SCOOTER_ID: {
		type: "string",
		minLength: 10,
		maxLength: 10
	},
	INTEGER_PARAMETER: {
		type: "integer",
		maxLength: 64
	},
	NUMBER_PARAMETER: {
		type: "number",
		maxLength: 64
	},
	GPS: {
		type: "string",
		minLength: 1,
		maxLength: 16
	},
	TRANSACTION_ID: {
		$ref: "transactionId"
	}
};