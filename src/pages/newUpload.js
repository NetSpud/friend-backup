import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SingleMachine from "../components/singlePC";

const Machines = (props) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  useEffect(() => {
    window.server.send("all-machines", "");
    window.server.subscribe("all-machines", (event, arg) => {
      console.log(event);

      setIsLoaded(true);
      setItems(event);
      if (event.error) {
        console.log(event.error);
        setError(event.error);
      }
    });
  }, []);

  if (error) {
    return <h1 className="h-32 mx-auto rounded-md p-3 text-white text-4xl font-extrabold w-full text-center">{error}</h1>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <select defaultValue="" onChange={props.setMachine} className="mt-1 block mx-auto w-2/3 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm">
          <option disabled value="">
            Please choose a machine for the files to be stored on.
          </option>
          {items.map((item, i) => (
            <option key={i} value={item.id}>
              {item.alias}
            </option>
          ))}
        </select>
      </>
    );
  }
};

const Options = (props) => {
  return <h1>{props.test}</h1>;
};

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      machine: "",
      files: [],
      uploaded: false,
      error: "",
    };
    this.setFiles = this.setFiles.bind(this);
    this.setMachine = this.setMachine.bind(this);
    this.upload = this.upload.bind(this);
  }

  setFiles(e) {
    console.log("setFiles()");
    const files = [];
    Array.from(e.target.files).forEach((file) =>
      files.push({ lastModified: file.lastModified, lastModifiedDate: file.lastModifiedDate, name: file.name, path: file.path, size: file.size, type: file.type, webkitRelativePath: file.webkitRelativePath })
    );
    this.setState({ files: files });
  }
  upload() {
    window.server.send("split", { files: this.state.files, machine: this.state.machine });
    window.server.subscribe("split", (event, args) => {
      if (event.error) {
        console.log(event);
        this.setState({ error: String(event.error) });
      } else {
        //handle success message
        this.setState({ uploaded: true });
        console.log(event);
      }
    });
  }

  setMachine(e) {
    console.log("setMachine()");
    this.setState({ machine: e.target.value });
  }

  render() {
    return (
      <>
        <div className="bg-red-500 flex flex-grow p-3">
          <div className="py-5 bg-gray-900 h-auto px-5 rounded-xl w-full lg:w-9/12 grid grid-rows-6 mx-auto">
            <div className="text-white text-4xl font-extrabold w-full my-auto text-center">
              <h1>Please Choose An Option</h1>
            </div>
            <div className="container mx-auto row-span-3 px-4 py-4">
              <Machines setMachine={this.setMachine} />
            </div>

            {/* <div className="row-span-2">
              <div className="px-4 py-4 lg:w-96 m-auto rounded-md">
                <button className="transition duration-500 ease-in-out bg-green-600 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-md" type="file">
                  <input type="file" onChange={this.setFiles} webkitdirectory="" directory="" />
                </button>
                <button className="transition duration-500 ease-in-out bg-blue-900 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md block ml-auto mt-3" onClick={this.upload}>
                  Upload folder
                </button>
              </div>
            </div> */}
            <div className="row-span-2">
              <div className="px-4 py-4 lg:w-96 m-auto rounded-md">
                <button className="transition duration-500 ease-in-out bg-green-600 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-md" type="file">
                  <input type="file" onChange={this.setFiles} multiple />
                </button>
                <button className="transition duration-500 ease-in-out bg-blue-900 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md block ml-auto mt-3" onClick={this.upload}>
                  Upload
                </button>
                <div className="text-red-600">{this.state.error}</div>
                <div className="text-green-600">{this.state.uploaded ? "Files uploaded successfully" : ""}</div>
              </div>
            </div>
            <div className="text-left self-end">
              <Link replace to="/">
                <button className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-red-600 hover:bg-red-900 text-white font-semibold py-3 px-6 rounded-md">Cancel</button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }
}

// const Page = () => {};

const CheckIcon = (props) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// export default Page;
