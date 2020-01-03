const Crypto = require("@arkecosystem/crypto");
const ScooterRegistrationBuilder = require("./builders/scooter-registration-builder");
const RentalStartBuilder = require("./builders/rental-start-builder");
const RentalFinishBuilder = require("./builders/rental-finish-builder");
const ScooterRegistrationTransaction = require("./transactions/scooter-registration-transaction");
const RentalStartTransaction = require("./transactions/rental-start-transaction");
const RentalFinishTransaction = require("./transactions/rental-finish-transaction");
const TransactionBuilder = Crypto.Transactions.BuilderFactory.transfer().instance();
const config = require('./bridgechain-config');
const nonce = '1';
const passphrase = 'jar width fee ostrich fantasy vehicle thank doctor teach family bottom trap';

Crypto.Managers.configManager.setConfig(config);
Crypto.Managers.configManager.setHeight(1850);

Crypto.Transactions.TransactionRegistry.registerTransactionType(ScooterRegistrationTransaction);
Crypto.Transactions.TransactionRegistry.registerTransactionType(RentalStartTransaction);
Crypto.Transactions.TransactionRegistry.registerTransactionType(RentalFinishTransaction);

let transaction = ScooterRegistrationBuilder
	.scooterId('1234567890')
	.nonce(nonce)
	.sign(passphrase);

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

console.log("\ncurl --request POST --url https://radians.nl/api/transactions " +
	`--header 'content-type: application/json' --data '${transactions}'`);

transaction = RentalStartBuilder
	.hash('asabasdb-123123-sdfsdf-lklsdf')
	.gpsLong('110.1110101')
	.gpsLat('110.1110101')
	.rate('5')
	.amount('1')
	.optionalInteger(123456)
	.recipientId('TGGUtM6KPdWn7LSpNcWj1y5ngGa8xJqxHf')
	.optionalNumber(100.001111) // TODO 100.00 becomes 100 (loses .00 which might cause bugs when using for GPS_LONG coords).
	.nonce(nonce)
	.sign(passphrase);

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

console.log("\ncurl --request POST --url https://radians.nl/api/transactions " +
	`--header 'content-type: application/json' --data '${transactions}'`);

transaction = RentalFinishBuilder
	.rentalStartTransactionId('e17b28198e4b5346fad726cefa6a189068c258058ee9b994e126642724c9d182')
	.gpsLong('110.1110101')
	.gpsLat('110.1110101')
	.amount('1')
	.recipientId('TGGUtM6KPdWn7LSpNcWj1y5ngGa8xJqxHf')
	.nonce(nonce)
	.fee('10000000')
	.sign(passphrase);

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

console.log("\ncurl --request POST --url https://radians.nl/api/transactions " +
	`--header 'content-type: application/json' --data '${transactions}'`);

transaction = TransactionBuilder
	.amount(1)
	.version(2)
	.recipientId('TEBFiv6emzoY6i4znYGrFeWiKyTRimhNWe')
	.vendorField('test')
	.nonce(nonce)
	.sign(passphrase);

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

console.log("\ncurl --request POST --url https://radians.nl/api/transactions " +
	`--header 'content-type: application/json' --data '${transactions}'`);