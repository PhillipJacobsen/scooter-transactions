const ScooterRegistrationHandler = require("./handlers/scooter-registration-handler");
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
	}
};