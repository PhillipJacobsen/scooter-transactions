const Crypto = require("@arkecosystem/crypto");
const ScooterRegistrationBuilder = require("./builders/scooter-registration-builder");
const RentalStartBuilder = require("./builders/rental-start-builder");
const ScooterRegistrationTransaction = require("./transactions/scooter-registration-transaction");
const RentalStartTransaction = require("./transactions/rental-start-transaction");
const config = require('./bridgechain-config');

Crypto.Managers.configManager.setConfig(config);
Crypto.Managers.configManager.setHeight(1850);

Crypto.Transactions.TransactionRegistry.registerTransactionType(ScooterRegistrationTransaction);
Crypto.Transactions.TransactionRegistry.registerTransactionType(RentalStartTransaction);

let transaction = ScooterRegistrationBuilder
	.scooterId('1234567890')
	.nonce('1')
	.sign('jar width fee ostrich fantasy vehicle thank doctor teach family bottom trap');

let serialized = transaction.build().serialized.toString('hex');
let deserialized = Crypto.Transactions.Deserializer.deserialize(serialized);

console.log(`\nTransaction is verified: ${transaction.verify()}`);
console.log(`\nSerialized: ${serialized}`);
console.log('\nDeserialized: %O', deserialized);

let transactions = JSON.stringify({
	"transactions" : [
		transaction.getStruct()
	]
});

console.log("\ncurl --request POST \ \n--url https://radians.nl/api/transactions \ \n" +
	`--header 'content-type: application/json' \ \n--data '${transactions}'\n`);

transaction = RentalStartBuilder
	.scooterId('1234567890')
	.hash('sdfjkfgdldjfklgjkldfjgkljklsdflksdjf')
	.gps('110.1110101')
	.rate('5')
	.amount('1')
	.vendorField('string max 255 length')
	.optionalInteger(123456)
	.optionalNumber(100.001111) // TODO 100.00 becomes 100 (loses .00 which might cause bugs when using for GPS coords).
	.nonce('1')
	.sign('jar width fee ostrich fantasy vehicle thank doctor teach family bottom trap');

serialized = transaction.build().serialized.toString('hex');
deserialized = Crypto.Transactions.Deserializer.deserialize(serialized);

console.log(`\nTransaction is verified: ${transaction.verify()}`);
console.log(`\nSerialized: ${serialized}`);
console.log('\nDeserialized: %O', deserialized);

transactions = JSON.stringify({
	"transactions" : [
		transaction.getStruct()
	]
});

console.log("\ncurl --request POST \ \n--url https://radians.nl/api/transactions \ \n" +
	`--header 'content-type: application/json' \ \n--data '${transactions}'\n`);