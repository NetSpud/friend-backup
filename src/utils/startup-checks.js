const fs = require("fs");
const ws = require("ws");
const { app } = require("electron");
const userFolder = app.getPath("userData");
const Store = require("electron-store");
const store = new Store();
const { nanoid } = require("nanoid");
const generateKeys = require("./generate-encryption-key");

const createFolder = (path) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};

const bootWebsocketServer = () => {
  return new Promise((resolve, reject) => {
    try {
      // const wss = new WebSocketServer({
      //   port: 3000,
      // });
    } finally {
      resolve(true);
    }
  });
};

const checkFiles = () => {
  return new Promise((resolve, reject) => {
    fs.promises
      .readdir(userFolder)
      .then((data) => {
        if (!store.get("encryption-keys")) {
          generateKeys()
            .then((keys) => {
              store.set("encryption-keys", { public: keys.publicKey, private: keys.privateKey });
            })
            .catch((err) => {
              throw err;
            });
        }
        if (!data.includes("tmp")) {
          createFolder(userFolder + "/tmp");
        }
        if (!data.includes("remoteFiles")) {
          createFolder(userFolder + "/remoteFiles");
        }
        if (!store.get("data-folder")) {
          store.set("data-folder", userFolder + "/remoteFiles");
        }
        if (!store.get("socket-port")) {
          store.set("socket-port", 3001);
        }
        if (!store.get("remote-credentials")) {
          store.set("remote-credentials", []);
        }
        if (!store.get("machine-id")) {
          store.set("machine-id", nanoid(12));
        }
      })
      .then(() => resolve(true))
      .catch((err) => reject(err));
  });
};
const checkPermissions = () => {
  return Promise.all([fs.promises.access(userFolder, fs.constants.R_OK), fs.promises.access(userFolder, fs.constants.W_OK)]);
};

const checkDatabase = () => {
  return new Promise((resolve, reject) => {
    if (!store.get("remote-files")) {
      store.set("remote-files", []);
    }
    if (!store.get("internal-files")) {
      store.set("internal-files", []);
    }
    resolve(true);
  });
};

const checkIfID = () => {
  return new Promise((resolve, reject) => {
    if (!store.get("user-id")) {
      store.set("user-id", nanoid(32));
    }
    resolve(true);
  });
};

const checkIfMachines = () => {
  return new Promise((resolve, reject) => {
    if (!store.get("machines")) {
      store.set("machines", []);
      resolve(true);
    }
  });
};

module.exports = { bootWebsocketServer, checkFiles, checkIfMachines, checkIfID, checkPermissions, checkDatabase };
