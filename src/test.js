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

console.log((new Date()).toJSON());

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
	transactions.push(RentalStartBuilder.sessionId(Crypto.Crypto.HashAlgorithms.sha256('hello').toString('hex'))
		.gps(Date.now(), '1.111111', '-180.222222')
		.rate('5')
		.amount('1')
		.recipientId('TGGUtM6KPdWn7LSpNcWj1y5ngGa8xJqxHf')
		.nonce(nonce)
		.vendorField(args.vf)
		.sign(passphrase));
} else if(args.txt === 'rf') {
	transactions.push(RentalFinishBuilder.sessionId(Crypto.Crypto.HashAlgorithms.sha256('hello').toString('hex'))
		.gps(Date.now(), '10.111111', '-20.222222')
		.gps(Date.now() + 90 * 1000, '15.111111', '-25.222222')
		.amount('3333')
		.recipientId('TGGUtM6KPdWn7LSpNcWj1y5ngGa8xJqxHf')
		.containsRefund(true)
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
const command = 'curl --request POST --url https://radians.nl/api/transactions ' +
	'--header "content-type:application/json" --data ' + JSON.stringify(JSON.stringify(payload));
console.log(command);

if(!args.d) {
	console.log('\n---------- RESPONSE ----------');
	console.log(childProcess.execSync(command).toString('UTF8'));
}


