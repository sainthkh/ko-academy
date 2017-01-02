var sodium = require('sodium').api;

process.stdout.write('Password: ');
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (input) {
	var password = Buffer.from(input.trim(), 'utf8');

	var hash = sodium.crypto_pwhash_str(
	password,
	sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
	sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE);

	console.log(hash.toString('base64'))

	process.exit();
});