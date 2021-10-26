const openpgp = require("openpgp");
const fs = require("fs");
const { nanoid } = require("nanoid");
const path = require("path");

// const encryptFiles = (files, pubKey, privKey, dest) => {
//   console.log("================================================");
//   console.log("Encrypting files...");
//   console.log("================================================");
//   return new Promise((resolve, reject) => {
//     Promise.all([openpgp.readKey({ armoredKey: pubKey }), openpgp.readPrivateKey({ armoredKey: privKey })]).then((keys) => {
//       const encryptedFiles = [];
//       const publicKey = keys[0];
//       const privateKey = keys[1];
//       for (const file of files) {
//         console.log("encrypting binary message");
//         fs.readFile(file, (err, fileData) => {
//           if (err) reject(err);
//           openpgp
//             .createMessage({ binary: fileData })
//             .then((messageData) => {
//               return openpgp.encrypt({
//                 message: messageData, // input as Message object
//                 encryptionKeys: publicKey,
//                 signingKeys: privateKey, // optional
//               });
//             })
//             .then((encrypted) => {
//               console.log("encrypted succesfully");
//               const randomisedFileName = nanoid(30) + ".gpg";
//               const outputPath = path.resolve(dest) + "\\" + randomisedFileName;
//               encryptedFiles.push({ original: path.basename(file), encrypted: path.basename(outputPath) });

//               fs.writeFile(outputPath, encrypted, (err) => {
//                 if (err) reject(err);
//               });
//             });
//         });
//       }
//       resolve(encryptedFiles);
//     });
//   });
// };

//TODO: This is crap, but I can't find a better way to do it.
const encryptFiles = (files, pubKey, privKey, dest) => {
  return new Promise(async (resolve, reject) => {
    try {
      const publicKey = await openpgp.readKey({ armoredKey: pubKey });
      const privateKey = await openpgp.readKey({ armoredKey: privKey });
      const encryptedFiles = [];
      files.forEach(async (file, i) => {
        const fileData = fs.readFileSync(file);

        const message = await openpgp.createMessage({ binary: fileData });
        const encrypted = await openpgp.encrypt({ message: message, encryptionKeys: publicKey, signingKeys: privateKey });

        const randomisedFileName = nanoid(30) + ".pgp";
        const outputPath = path.resolve(dest) + "\\" + randomisedFileName;
        encryptedFiles.push({ original: path.resolve(dest) + "\\" + path.basename(file), encrypted: path.resolve(dest) + "\\" + path.basename(outputPath) });
        fs.writeFileSync(outputPath, encrypted);

        if (++i === files.length) {
          resolve(encryptedFiles);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = encryptFiles;
