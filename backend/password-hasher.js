const crypto = require('crypto');
const readline = require('readline');

// Same functions from endpoints-autenticacion.ts
const generateSalt = () => {
  return crypto.randomBytes(32).toString('hex');
};

const hashPassword = (password, salt) => {
  return crypto
    .createHash('sha256')
    .update(password + salt)
    .digest('hex');
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Password Hasher - Generate hash and salt for database storage\n');

rl.question('Enter password: ', (password) => {
  if (!password) {
    console.log('Password cannot be empty');
    rl.close();
    return;
  }

  const salt = generateSalt();
  const hash = hashPassword(password, salt);

  console.log('\n--- Results ---');
  console.log('Salt:', salt);
  console.log('Hash:', hash);
  console.log('\nStore both values in your database for this user.');
  
  rl.close();
});