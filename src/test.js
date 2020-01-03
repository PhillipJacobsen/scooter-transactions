const Crypto = require("@arkecosystem/crypto");
const ScooterRegistrationBuilder = require("./builders/scooter-registration-builder");
const RentalStartBuilder = require("./builders/rental-start-builder");
const RentalFinishBuilder = require("./builders/rental-finish-builder");
const ScooterRegistrationTransaction = require("./transactions/scooter-registration-transaction");
const RentalStartTransaction = require("./transactions/rental-start-transaction");
const RentalFinishTransaction = require("./transactions/rental-finish-transaction");
const TransactionBuilder = Crypto.Transactions.BuilderFactory.transfer().instance();
const childProcess = require('child_process');
const config = require("./bridgechain-config");
const args = require("./args");
const nonce = args.nonce || '1';
const passphrase = 'jar width fee ostrich fantasy vehicle thank doctor teach family bottom trap';

console.log('\n---------- ARGS ----------');
console.log(args);

Crypto.Managers.configManager.setConfig(config);
Crypto.Managers.configManager.setHeight(1850);

Crypto.Transactions.TransactionRegistry.registerTransactionType(ScooterRegistrationTransaction);
Crypto.Transactions.TransactionRegistry.registerTransactionType(RentalStartTransaction);
Crypto.Transactions.TransactionRegistry.registerTransactionType(RentalFinishTransaction);

let transactions = [];

if(args.txt === 'sr') {
	transactions.push(ScooterRegistrationBuilder.scooterId('1234567890')
		.nonce(nonce)
		.sign(passphrase));
} else if(args.txt === 'rs') {
	transactions.push(RentalStartBuilder.hash('asabasdb-123123-sdfsdf-lklsdf')
		.gpsLong('110.1110101')
		.gpsLat('110.1110101')
		.rate('5')
		.amount('1')
		// .optionalInteger(123456)
		.recipientId('TGGUtM6KPdWn7LSpNcWj1y5ngGa8xJqxHf')
		// .optionalNumber(100.001111) // TODO 100.00 becomes 100 (loses .00 which might cause bugs when using for GPS_LONG coords).
		.nonce(nonce)
		.vendorField(args.vf)
		.sign(passphrase));
} else if(args.txt === 'rf') {
	transactions.push(RentalFinishBuilder.rentalStartTransactionId('e17b28198e4b5346fad726cefa6a189068c258058ee9b994e126642724c9d182')
		.gpsStartLong('110.1110101')
		.gpsStartLat('110.1110101')
		.gpsFinishLong('110.1110101')
		.gpsFinishLat('110.1110101')
		.amount('1')
		.recipientId('TGGUtM6KPdWn7LSpNcWj1y5ngGa8xJqxHf')
		.refundTransactionId('e17b28198e4b5346fad726cefa6a189068c258058ee9b994e126642724c9d182')
		.rideDuration(60)
		.nonce(nonce)
		.vendorField(args.vf)
		.fee('10000000')
		.sign(passphrase));
} else if(args.txt === 't') {
	transactions.push(TransactionBuilder.amount(1)
		.version(2)
		.recipientId('TEBFiv6emzoY6i4znYGrFeWiKyTRimhNWe')
		.vendorField(args.vf)
		.nonce(nonce)
		.sign(passphrase));
}

let payload = {
	transactions: []
};

for(const transaction of transactions) {
	payload.transactions.push(transaction.getStruct());

	if(args.d) {
		let serialized = transaction.build().serialized.toString('hex');
		let deserialized = Crypto.Transactions.Deserializer.deserialize(serialized);

		console.log(`\nTransaction is verified: ${transaction.verify()}`);
		console.log(`\nSerialized: ${serialized}`);
		console.log('\nDeserialized: %O', deserialized);
	}
}

console.log('\n---------- COMMAND ----------');
const command = "curl --request POST --url https://radians.nl/api/transactions " +
	`--header 'content-type: application/json' --data '${JSON.stringify(payload)}'`;
console.log(command);

if(!args.d) {
	console.log('\n---------- RESPONSE ----------');
	console.log(childProcess.execSync(command).toString('UTF8'));
}


