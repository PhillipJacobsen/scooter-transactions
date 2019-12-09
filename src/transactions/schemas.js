module.exports = {
	SCOOTER_ID: {
		type: "string",
		minLength: 10,
		maxLength: 10
	},
	EXTRA_PARAMETER_1: {
		type: "string",
		minLength: 1,
		maxLength: 128
	},
	EXTRA_PARAMETER_2: {
		type: "integer",
		minLength: 1,
		maxLength: 32
	},
	EXTRA_PARAMETER_3: {
		type: "float",
		minLength: 1,
		maxLength: 32
	}
};