const ScooterRegistrationHandler = require("./handlers/scooter-registration-handler");
const RentalFinishHandler = require("./handlers/rental-finish-handler");
const RentalStartHandler = require("./handlers/rental-start-handler");
const Transactions = require('@arkecosystem/core-transactions');

exports.plugin = {
	pkg: require('../package.json'),
	defaults: require('./defaults'),
	alias: 'e-m-s-y:scooter-registration-transaction',
	async register(container, options) {
		const logger = container.resolvePlugin('logger');

		if(!options.enabled) {
			logger.info(`[${this.alias}] Plugin is disabled!`);
			return;
		}

		logger.info(`[${this.alias}] Registering scooter registration transaction...`);

		await Transactions.Handlers.Registry.registerTransactionHandler(ScooterRegistrationHandler);

		logger.info(`[${this.alias}] Scooter registration transaction registered.`);
		logger.info(`[${this.alias}] Registering rental start transaction...`);

		await Transactions.Handlers.Registry.registerTransactionHandler(RentalStartHandler);

		logger.info(`[${this.alias}] Rental start transaction registered.`);
		logger.info(`[${this.alias}] Registering rental finish transaction...`);

		await Transactions.Handlers.Registry.registerTransactionHandler(RentalFinishHandler);

		logger.info(`[${this.alias}] Rental finish transaction registered.`);
	}
};