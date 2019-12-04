const Crypto = require("@arkecosystem/crypto");
const ScooterRegistrationBuilder = require("./builders/scooter-registration-builder");
const ScooterRegistrationTransaction = require("./transactions/scooter-registration-transaction");
const config = require('./bridgechain-config');

Crypto.Managers.configManager.setConfig(config);
Crypto.Managers.configManager.setHeight(1850);

Crypto.Transactions.TransactionRegistry.registerTransactionType(ScooterRegistrationTransaction);

const transaction = ScooterRegistrationBuilder
	.scooterId('1234567890')
	.nonce('1')
	.sign('jar width fee ostrich fantasy vehicle thank doctor teach family bottom trap');

const serialized = transaction.build().serialized.toString('hex');
const deserialized = Crypto.Transactions.Deserializer.deserialize(serialized);

console.log(`\nTransaction is verified: ${transaction.verify()}`);
console.log(`\nSerialized: ${serialized}`);
console.log('\nDeserialized: %O', deserialized);

const transactions = JSON.stringify({
	"transactions" : [
		transaction.getStruct()
	]
});

console.log("\ncurl --request POST \ \n--url https://radians.nl/api/transactions \ \n" +
	`--header 'content-type: application/json' \ \n--data '${transactions}'\n`);