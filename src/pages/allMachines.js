import SingleMachine from "../components/singlePC";
import React, { useState, useEffect } from "react";
import { NavLink as Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Grid = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    window.server.send("all-machines", "");
    window.server.subscribe("all-machines", (event, arg) => {
      console.log(event);
      setIsLoaded(true);
      setMachines(event);
      if (event.error) {
        console.log(event.error);
        setError(event.error);
      }
    });
  }, []);

  if (error) {
    return <h1 className="h-32 mx-auto rounded-md p-3 text-white text-4xl font-extrabold w-full text-center">{error}</h1>;
  } else if (!isLoaded) {
    return (
      <div className="bg-red-500 overflow-auto w-full p-3">
        <h1 className="h-32 mx-auto rounded-md p-3 text-white text-4xl font-extrabold w-full text-center">Loading...</h1>;
      </div>
    );
  } else {
    if (machines.length > 0) {
      return (
        <>
          <div className="container mx-auto grid grid-rows-4 grid-cols-1 gap-4 justify-items-center xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 mt-3">
            {machines.map((machine, i) => (
              <SingleMachine key={i} machineName={machine.alias} id={machine.id} />
            ))}
          </div>
        </>
      );
    } else {
      return (
        <div className="bg-red-500 overflow-auto w-full p-3">
          <h1 className="h-32 mx-auto rounded-md p-3 text-white text-4xl font-extrabold w-full text-center">Bummer. Doesn't look like you've added any machines yet.</h1>
          <div className="text-center">
            <Link to="/new-machine" className="transition duration-500 ease-in-out bg-green-600 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-md mb-3">
              Add New
            </Link>
          </div>
        </div>
      );
    }
  }
};
const List = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    window.server.send("all-machines", "");
    window.server.subscribe("all-machines", (event, arg) => {
      console.log(event);
      setIsLoaded(true);
      setMachines(event);
      if (event.error) {
        console.log(event.error);
        setError(event.error);
      }
    });
  }, []);

  if (error) {
    return <h1 className="h-32 mx-auto rounded-md p-3 text-white text-4xl font-extrabold w-full text-center">{error}</h1>;
  } else if (!isLoaded) {
    return (
      <div className="bg-red-500 overflow-auto w-full p-3">
        <h1 className="h-32 mx-auto rounded-md p-3 text-white text-4xl font-extrabold w-full text-center">Loading...</h1>;
      </div>
    );
  } else {
    if (machines.length > 0) {
      return (
        <>
          <div className="container mx-auto mt-12">
            <div className="flex flex-col">
              <div className="my-2">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status ( to be built )
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Address
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {machines.map((machine, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {/* <img className="h-10 w-10 rounded-full" src={machine.image} alt="" /> */}
                                  <FontAwesomeIcon icon="desktop" size="2x" className="text-black" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{machine.alias}</div>
                                  <div className="text-sm text-gray-500">{machine.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{machine.ip + ":" + machine.port}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link to={`/single?id=${machine.id}`} className="text-indigo-600 hover:text-indigo-900">
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className="bg-red-500 overflow-auto w-full p-3">
          <h1 className="h-32 mx-auto rounded-md p-3 text-white text-4xl font-extrabold w-full text-center">Bummer. Doesn't look like you've added any machines yet.</h1>
          <div className="text-center">
            <Link to="/new-machine" className="transition duration-500 ease-in-out bg-green-600 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-md mb-3">
              Add New
            </Link>
          </div>
        </div>
      );
    }
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: localStorage.getItem("layout") || "grid",
    };
    this.setLayout = this.setLayout.bind(this);
  }
  render() {
    if (localStorage.getItem("layout") === null) {
      localStorage.setItem("layout", "grid");
    }

    return (
      <div className="bg-red-500 overflow-auto w-full p-3">
        <select value={this.state.layout} className="w-40" onChange={this.setLayout}>
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
        <Link to="/new-machine" className="transition duration-500 ease-in-out bg-green-600 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-md float-right mb-3">
          Add New
        </Link>
        {this.state.layout === "grid" ? <Grid /> : this.state.layout === "list" ? <List /> : <h1 className="h-32 mx-auto rounded-md p-3 text-white text-4xl font-extrabold w-full text-center">Invalid layout.</h1>}
      </div>
    );
  }

  setLayout(e) {
    const layout = e.target.value;
    this.setState({ layout: layout });
    localStorage.setItem("layout", layout);
  }
}

export default App;
