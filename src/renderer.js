/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

// import "./index.css";
// import React from "react";
// import ReactDOM from "react-dom";

// ReactDOM.render(<h1 className="text-white">Hello world</h1>, document.getElementById("root"));
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app";

import { library } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";
import { faCoffee, faDesktop } from "@fortawesome/free-solid-svg-icons";
import { faList, faUserAlt, faFolderOpen, faPlus, faCog, faSignOutAlt, faTh, faEllipsisV, faFile } from "@fortawesome/free-solid-svg-icons";

library.add(faDesktop, faCoffee, faList, faUserAlt, faFolderOpen, faPlus, faCog, faSignOutAlt, faTh, faEllipsisV, faFile);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
