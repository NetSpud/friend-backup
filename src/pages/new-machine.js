import React from "react";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ip: "",
      code: "",
      port: 3001,
    };
    this.setIP = this.setIP.bind(this);
    this.setCode = this.setCode.bind(this);
    this.setPort = this.setPort.bind(this);
    this.setAlias = this.setAlias.bind(this);
    this.submit = this.submit.bind(this);
  }

  setIP(e) {
    this.setState({ ip: e.target.value });
  }
  setCode(e) {
    this.setState({ code: e.target.value });
  }
  setPort(e) {
    this.setState({ port: e.target.value });
  }
  setAlias(e) {
    this.setState({ alias: e.target.value });
  }

  submit(e) {
    e.preventDefault();
    console.log("submit...");
    window.server.send("new-machine", this.state);
    window.server.subscribe("new-machine", (event, arg) => {
      console.log(event);
      if (event.error) {
        this.setState({ error: event.error });
      } else {
        //handle success
      }
    });
  }

  render() {
    return (
      <>
        <div className="bg-red-500 flex flex-grow p-3">
          <div className="py-5 bg-gray-900 h-auto px-5 rounded-xl w-full lg:w-9/12 mx-auto">
            <div className="text-center">
              <h1 className="text-white text-4xl font-extrabold">Add New Machine</h1>
            </div>
            <div className="mt-32">
              <div className="col-span-3 mx-auto">
                <form onSubmit={this.submit}>
                  <div>
                    <label className="text-white block">Remote Machine IP Address</label>
                    <input
                      onChange={this.setIP}
                      className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="eg: xxx.xxx.xxx.xxx"
                      type="text"
                      // pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$"
                    />
                  </div>
                  <div>
                    <label className="text-white block">Machine ID Code</label>
                    <input onChange={this.setCode} className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="eg: xxxxxxxxxx" type="text" />
                  </div>
                  <div>
                    <label className="text-white block">Alias</label>
                    <input onChange={this.setAlias} className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="eg: Sams's PC" type="text" />
                  </div>
                  <div>
                    <label className="text-white block">Port</label>
                    <input
                      min="0"
                      max="65535"
                      value={this.state.port}
                      onChange={this.setPort}
                      className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="0000"
                      type="number"
                    />
                  </div>
                  <div className="text-red-500 text-center pt-3">{JSON.stringify(this.state.error)}</div>
                  <button type="submit" className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-md float-right mt-4">
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
