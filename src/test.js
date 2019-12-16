const Crypto = require("@arkecosystem/crypto");
const ScooterRegistrationBuilder = require("./builders/scooter-registration-builder");
const RentalStartBuilder = require("./builders/rental-start-builder");
const RentalFinishBuilder = require("./builders/rental-finish-builder");
const ScooterRegistrationTransaction = require("./transactions/scooter-registration-transaction");
const RentalStartTransaction = require("./transactions/rental-start-transaction");
const RentalFinishTransaction = require("./transactions/rental-finish-transaction");
const config = require('./bridgechain-config');

Crypto.Managers.configManager.setConfig(config);
Crypto.Managers.configManager.setHeight(1850);

Crypto.Transactions.TransactionRegistry.registerTransactionType(ScooterRegistrationTransaction);
Crypto.Transactions.TransactionRegistry.registerTransactionType(RentalStartTransaction);
Crypto.Transactions.TransactionRegistry.registerTransactionType(RentalFinishTransaction);

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
	.hash('asabasdb-123123-sdfsdf-lklsdf')
	.gps('110.1110101')
	.rate('5')
	.amount('1')
	.vendorField('string max 255 length')
	.optionalInteger(123456)
	.recipientId('TGGUtM6KPdWn7LSpNcWj1y5ngGa8xJqxHf')
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

transaction = RentalFinishBuilder
	.rentalTransactionId('e17b28198e4b5346fad726cefa6a189068c258058ee9b994e126642724c9d182')
	.gps('110.1110101')
	.amount('1')
	.vendorField('string max 255 length')
	.recipientId('TGGUtM6KPdWn7LSpNcWj1y5ngGa8xJqxHf')
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