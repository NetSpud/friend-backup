const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");
const splitFile = require("./utils/split-file.js");
const { nanoid } = require("nanoid");
const fs = require("fs");
const { WebSocketServer, WebSocket } = require("ws");
const ping = require("ping");
const userFolder = app.getPath("userData");
const Store = require("electron-store");
const store = new Store();

const encryptFiles = require("./utils/encrypt-files.js");
const { checkFiles, checkIfMachines, checkIfID, checkPermissions, checkDatabase } = require("./utils/startup-checks");

const wss = new WebSocketServer({
  port: store.get("socket-port") || 3001,
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 2500,
    height: 1000,
    minWidth: 700,
    icon: "./public/favicon.ico",
    webPreferences: {
      sandbox: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  startupChecks();
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [`default-src 'self' localhost:3000 ws://localhost:${store.get("socket-port") || 3001} 'unsafe-inline' 'unsafe-eval' data: devtools://devtools/bundled/core/host/host.js`],
      },
    });
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const separateFiles = (file, size) => {
  return new Promise((resolve, reject) => {
    splitFile
      .splitFileBySize(file, size, path.resolve(userFolder + "/tmp"))
      .then((files) => {
        resolve(files);
      })
      .catch((err) => reject(err));
  });
};

const startupChecks = () => {
  checkPermissions()
    .then(() => {
      return checkFiles();
    })
    .then(() => {
      return checkDatabase();
    })
    .then(() => {
      return checkIfID();
    })
    .then(() => {
      return checkIfMachines();
    })
    .then(() => {
      return bootWebsocketServer();
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const addMachine = (obj) => {
  return new Promise((resolve, reject) => {
    try {
      const machines = store.get("machines");
      machines.push(obj);
      store.set("machines", machines);
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};
const getMachine = (id) => {
  return new Promise((resolve, reject) => {
    try {
      const machines = store.get("machines");
      const machine = machines.filter((x) => x.id === id)[0];
      resolve(machine);
    } catch (err) {
      reject(err);
    }
  });
};

const sendFilesToMachine = (files, socketAddress, machineInfo) => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://${socketAddress}`);
    ws.on("open", () => {
      console.log("Socket established.");
      for (let i = 0; i < files.length; i++) {
        const el = files[i];
        const message = {
          type: "transfer",
          data: {
            filename: path.basename(el.encrypted),
            fileData: fs.readFileSync(el.encrypted),
          },
          credentials: machineInfo.credentials,
        };
        ws.send(JSON.stringify(message));
      }
      resolve(files);
    });
  });
};

const updateDatabase = (files, originFilePath, machineInfo) => {
  return new Promise((resolve, reject) => {
    const remoteFiles = store.get("remote-files");
    const mappedFiles = files.map((item) => {
      item.original = path.basename(item.original);
      item.encrypted = path.basename(item.encrypted);
      return item;
    });
    remoteFiles.push({ storedOn: machineInfo.id, chunks: mappedFiles, originFilePath: originFilePath, originalFilename: path.basename(originFilePath) });
    store.set("remote-files", remoteFiles);
    resolve(files);
  });
};

const removeOldFiles = (files) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < files.length; i++) {
      const el = files[i];
      console.log(el);
      fs.unlink(userFolder + "/tmp/" + el.original, (err) => {
        if (err) reject(err);
      });
      fs.unlink(userFolder + "/tmp/" + el.encrypted, (err) => {
        if (err) reject(err);
      });
    }
  });
};

const getMachineInfo = (id) => {
  return new Promise((resolve, reject) => {
    const machine = store.get("machines").find((m) => m.id === id);

    ping.promise.probe(machine.ip).then((res) => {
      if (res.alive) {
        machine.status = true;
      } else {
        machine.status = false;
      }
      resolve(machine);
    });
  });
};

wss.on("connection", (ws) => {
  console.log("connected to websocket");
  const checkCredentials = (credentials) => {
    console.log("checkCredentials()");
    return new Promise((resolve, reject) => {
      if (store.get("remote-credentials").filter((x) => x.userID === credentials.userID && x.passcode === credentials.passcode).length > 0) {
        console.log("Valid credentials!");
        resolve(true);
      } else {
        reject({ msg: "Invalid credentials.", status: 401 });
      }
    });
  };

  const saveFile = (fileData) => {
    return new Promise((resolve, reject) => {
      const filename = store.get("data-folder") + "\\" + fileData.filename;
      const data = Buffer.from(fileData.fileData.data);
      fs.writeFile(filename, data, (err) => {
        resolve(true);
      });
    });
  };

  ws.on("message", (message) => {
    const messageData = JSON.parse(message);

    switch (messageData.type) {
      case "firstTime":
        if (messageData.code === store.get("machine-id")) {
          const creds = { userID: nanoid(10), passcode: nanoid(255) };
          ws.send(JSON.stringify({ type: "firstTime", res: "Authentication Successful.", status: 200, credentials: creds }));
          store.set("machine-id", nanoid(12));
          const allCredentials = store.get("remote-credentials");
          allCredentials.push(creds);
          store.set("remote-credentials", allCredentials);
        } else {
          ws.send(JSON.stringify({ type: "firstTime", res: "Authentication Failled. Incorrect passcode provided.", status: 401 }));
        }
        break;
      case "transfer":
        checkCredentials(messageData.credentials)
          .then(() => {
            return saveFile(messageData.data); //todo: avoid having to connect to the websocket to transfer each chunk
          })
          .then(() => {
            console.log("saved file", messageData.data.filename);
          })
          .catch((err) => ws.send(JSON.stringify({ type: "error", res: err.msg, status: err.status })));

        break;
      case "save-transfer-files":
        //todo, implement a way of updating the database with the encrypted files on the remote end.
        break;
    }
  });
});

ipcMain.on("split", (e, a) => {
  console.log("IPC: split");

  for (let i = 0; i < a.files.length; i++) {
    const el = a.files[i];
    separateFiles(el.path, 1024 * 1024 * 5)
      .then((files) => {
        const publicKey = store.get("encryption-keys.public");
        const privateKey = store.get("encryption-keys.private");
        const output = userFolder + "\\" + "/tmp";

        return encryptFiles(files, publicKey, privateKey, output);
      })
      .then(async (files) => {
        const machineInfo = await getMachine(a.machine);
        return sendFilesToMachine(files, `${machineInfo.ip}:${machineInfo.port}`, machineInfo);
      })
      .then(async (files) => {
        const machineInfo = await getMachine(a.machine);
        return updateDatabase(files, el.path, machineInfo);
      })
      .then((files) => {
        return removeOldFiles(files);
      })
      .catch((err) => console.error(err));
  }
});
ipcMain.on("saveSettings", (e, a) => {
  console.log("IPC: saveSettings");
  if (store.get("internal-files").length > 0) {
    e.reply("saveSettings", { err: "Cannot change folder path because data is already stored on this machine. Please remove the data and try again.", element: "folder" });
  } else {
    console.log(`setting output folder`);
    store.set("data-folder", a.path);
  }

  store.set("socket-port", Number(a.socketPort));
  store.set("machine-size", Number(a.storageSize));
  e.reply("saveSettings", { success: true });
});
ipcMain.on("getSettings", (e, a) => {
  console.log("IPC: getSettings");

  const settings = {
    remoteFilesFolder: store.get("data-folder"),
    socketPort: store.get("socket-port"),
    storageSize: store.get("machine-size"),
  };

  e.reply("getSettings", settings);
});
ipcMain.on("new-machine", (e, a) => {
  console.log("IPC: new-machine");
  try {
    const ws = new WebSocket(`ws://${a.ip}:${a.port}`); //connecting to localhost, change as required

    ws.on("message", (msg) => {
      const messageData = JSON.parse(msg);
      if (messageData.status === 200) {
        const obj = {
          id: nanoid(10),
          ip: a.ip,
          port: a.port,
          alias: a.alias,
          credentials: messageData.credentials,
        };
        addMachine(obj)
          .then(() => {
            console.log("added machine successfully");
            e.reply("new-machine", { success: "added new machine!" });
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (messageData.status === 401) {
        e.reply("new-machine", { error: messageData.res });
      }
    });

    ws.on("open", () => {
      if (ws._readyState) {
        ws.send(JSON.stringify({ type: "firstTime", code: a.code }));
      }

      //   // ws.send("example message to dev client");
    });
  } catch (err) {
    if (err.message) {
      e.reply("new-machine", { error: err.message });
    } else {
      e.reply("new-machine", { error: err });
    }
  }
});
ipcMain.on("all-machines", (e, a) => {
  console.log("IPC: all-machines");
  try {
    e.reply("all-machines", store.get("machines"));
  } catch (error) {
    e.reply("all-machines", { err: error });
  }
});
ipcMain.on("remote-files", (e, a) => {
  console.log("IPC: remote-files");
  const files = store.get("remote-files");
  e.reply("remote-files", files);
});

ipcMain.on("machine-info", (e, a) => {
  console.log("IPC: machine-info");
  getMachineInfo(a.id)
    .then((info) => {
      delete info.credentials;
      e.reply("machine-info", info);
    })
    .catch((err) => {
      e.reply("machine-info", { err: err });
    });
});
