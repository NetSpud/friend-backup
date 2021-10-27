import React from "react";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outputFolder: "",
      socketPort: "",
      storageSize: 32,
    };
    this.formSubmit = this.formSubmit.bind(this);
    this.setOutputFolder = this.setOutputFolder.bind(this);
    this.getSettings = this.getSettings.bind(this);
    this.setSocketPort = this.setSocketPort.bind(this);
    this.setMaxFilesSize = this.setMaxFilesSize.bind(this);
    this.setErr = this.setErr.bind(this);
  }

  componentDidMount() {
    this.getSettings();
  }

  formSubmit(e) {
    e.preventDefault();
    window.server.send("saveSettings", { path: this.state.outputFolder, socketPort: this.state.socketPort, storageSize: this.state.storageSize });
    window.server.subscribe("saveSettings", (event, arg) => {
      console.log(event);
      if (event.err) {
        this.setErr(event.err);
      } else {
        console.log("settings updated.");
      }
    });
  }

  setErr(err) {
    // this.state.err = err;
    this.setState({ err: err });
  }

  setOutputFolder(e) {
    this.setState({ outputFolder: e.target.value });
  }
  setSocketPort(e) {
    console.log("setSocketPort()");
    this.setState({ socketPort: e.target.value });
  }

  setMaxFilesSize(e) {
    this.setState({ storageSize: e.target.value });
  }

  getSettings() {
    window.server.send("getSettings");
    window.server.subscribe("getSettings", (event, arg) => {
      console.log(event);
      this.setState({ outputFolder: event.remoteFilesFolder, socketPort: event.socketPort, storageSize: event.storageSize });
    });
  }

  // toggleConnection(e) {
  //   console.log("toggleConnection()");
  //   const msg = "Toggle Connection Mode";
  //   if (!this.state.connection) {
  //     console.log("Set state true");
  //     window.server.send("new-machine-connection", { connection: true });
  //     window.server.subscribe("new-machine-connection", (event, arg) => {
  //       console.log(event);
  //     });
  //     this.setState({ connection: true });
  //     e.target.innerHTML = msg + " currently ON";
  //   } else {
  //     console.log("Set state false");
  //     window.server.send("new-machine-connection", { connection: false });
  //     window.server.subscribe("new-machine-connection", (event, arg) => {});
  //     this.setState({ connection: false });
  //     e.target.innerHTML = msg + " currently OFF";

  //     console.log("disabling...");
  //   }
  // }

  render() {
    return (
      <>
        <div className="bg-red-500 flex flex-grow p-3">
          <div className="py-5 bg-gray-900 h-auto px-5 rounded-xl w-full lg:w-9/12 mx-auto">
            <div className="text-center">
              <h1 className="text-white text-4xl font-extrabold">Settings</h1>
            </div>
            <div className="mt-32">
              <div className="col-span-3 mx-auto">
                <form onSubmit={this.formSubmit}>
                  <div>
                    <label className="text-white block">Remote Files Output</label>
                    <input
                      onChange={this.setOutputFolder}
                      value={this.state.outputFolder}
                      className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="eg: E:\remote-store"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="text-white block">Websocket Port</label>
                    <input
                      onChange={this.setSocketPort}
                      value={this.state.socketPort}
                      className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="eg: E:\remote-store"
                      type="number"
                    />
                    <div className="text-red-500 text-center pt-3">{this.state.err}</div>
                  </div>
                  <div>
                    <label className="text-white block">Maximum amount of files that can be stored (in gigabytes)</label>
                    <input
                      onChange={this.setMaxFilesSize}
                      value={this.state.storageSize}
                      className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="eg: E:\remote-store"
                      type="number"
                    />
                    <div className="text-red-500 text-center pt-3">{this.state.err}</div>
                  </div>
                  <button type="submit" className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-md float-right mt-4">
                    Save
                  </button>
                </form>
              </div>
            </div>
            {/* <button className={`text-white font-semibold py-3 px-6 rounded-md mt-auto ${this.state.connection ? "bg-purple-500" : "bg-green-500"}`} onClick={this.toggleConnection}>
              Toggle Connection mode
            </button> */}
          </div>
        </div>
      </>
    );
  }
}
