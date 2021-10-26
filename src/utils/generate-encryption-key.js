const openpgp = require("openpgp");
const fs = require("fs");

// openpgp.generateKey(keyOptions).then((data) => {
//   console.log(data);
//   // fs.writeFile("publickey", data.publicKey, (err) => {
//   //   console.log(err);
//   // });
//   // fs.writeFile("privatekey", data.privateKey, (err) => {
//   //   console.log(err);
//   // });
// });

const generateKeys = (name = "Jon Smith", email = "jon@example.com") => {
  const keyOptions = {
    type: "ecc", // Type of the key, defaults to ECC
    curve: "curve25519", // ECC curve name, defaults to curve25519
    userIDs: [{ name, email }], // you can pass multiple user IDs
    passphrase: "", // protects the private key
    format: "armored", // output key format, defaults to 'armored' (other options: 'binary' or 'object')
  };

  return new Promise((resolve, reject) => {
    openpgp
      .generateKey(keyOptions)
      .then((keys) => {
        resolve(keys);
      })
      .catch((err) => reject(err));
  });
};

module.exports = generateKeys;
