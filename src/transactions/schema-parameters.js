module.exports = {
	SCOOTER_ID: {
		type: "string",
		minLength: 10,
		maxLength: 10
	},
	OPTIONAL_PARAMETER_1: {
		key: '',
		type: "string",
		minLength: 1,
		maxLength: 128
	},
	OPTIONAL_PARAMETER_2: {
		type: "integer",
		minLength: 1,
		maxLength: 64
	},
	OPTIONAL_PARAMETER_3: {
		type: "float",
		minLength: 1,
		maxLength: 64
	},
	GPS: {
		key: 'gps',
		type: "string", // TODO use float? Ask PJ.
		minLength: 1,
		maxLength: 16
	}
};