const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("server", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  subscribe: (channel, listener) => {
    const subscription = (event, ...args) => listener(...args);
    ipcRenderer.once(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
});
