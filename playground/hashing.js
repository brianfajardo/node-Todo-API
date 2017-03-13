const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = 'holy password!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

const hashedPW = '$2a$10$JZ1o2YpcqAt5diqG0w58KO0MjwUdGv3IWUf1SMjNchklYQ2UtFEfu';

bcrypt.compare(password, hashedPW, (err, result) => {
    console.log(result); // true
});
// const data1 = {
//     id: 50
// };

// // takes object and creates and creates hash and returns it
// const token1 = jwt.sign(data1, 'the secret');
// console.log('Token:', token1);

// // takes token and secret and makes sure data was not manipulated
// const decodedToken1 = jwt.verify(token1, 'the secret');
// console.log('Decoded token:', decodedToken1);

// const message = 'You are player two';
// const hash = SHA256(message).toString();

// // console.log(`Message: ${message}`);
// // console.log(`hash: ${hash}`);

// const data2 = {
//     id: 4
// };

// // Salting the hash to prevent hackers messing with the hash 'key'
// // Adding a secret 'thing' to add to the stringified data to make it unique, only avail on server
// const token2 = {
//     data2,
//     hash: SHA256(JSON.stringify(data2) + 'salting the hash').toString()
// };

// const resultHash = SHA256(JSON.stringify(token2.data2) + 'salting the hash').toString();

// if (resultHash === token2.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Don\'t trust');
// };
