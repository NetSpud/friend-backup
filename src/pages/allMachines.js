import SingleMachine from "../components/singlePC";
import React, { useState, useEffect } from "react";
import { NavLink as Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
{
  /* <FontAwesomeIcon className="flex text-4xl text-white cursor-pointer transition duration-100 ease-in-out hover:text-gray-900 justify-center" icon="desktop" />; */
}

const Grid = () => {
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
    return (
      <div className="bg-red-500 overflow-auto w-full p-3">
        <h1 className="h-32 mx-auto rounded-md p-3 text-white text-4xl font-extrabold w-full text-center">Loading...</h1>;
      </div>
    );
  } else {
    if (items.length > 0) {
      return (
        <>
          <div className="bg-red-500 overflow-auto w-full p-3">
            <FontAwesomeIcon to="/new-machine" className="text-4xl text-white cursor-pointer transition duration-100 ease-in-out hover:text-gray-900 float-left" icon="th">
              Add New
            </FontAwesomeIcon>
            <FontAwesomeIcon to="/new-machine" className="text-4xl text-white cursor-pointer transition duration-100 ease-in-out hover:text-gray-900 float-left ml-4" icon="list">
              Add New
            </FontAwesomeIcon>
            <Link to="/new-machine" className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-green-600 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-md float-right mb-3">
              Add New
            </Link>
            <div className="container mx-auto grid grid-rows-4 grid-cols-1 gap-4 justify-items-center xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
              {/* <SingleMachine machineName="PC-PC-R7" id="testid" />
              <SingleMachine machineName="RANDOM-RIG" />
              <SingleMachine machineName="JAMES-PC-1999" />
              <SingleMachine machineName="DAVID win 10000" /> */}
              {items.map((item, i) => (
                <SingleMachine key={i} machineName={item.alias} id={item.id} />
              ))}
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className="bg-red-500 overflow-auto w-full p-3">
          <Link to="/new-machine" className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-green-600 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-md float-right mb-3">
            Add New
          </Link>
          <h1 className="h-32 mx-auto rounded-md p-3 text-white text-4xl font-extrabold w-full text-center">Bummer. Doesn't look like you've added any machines yet.</h1>;
        </div>
      );
    }
  }
};

const App = () => {
  const layout = localStorage.getItem("layout");

  if (layout === null) {
    localStorage.setItem("layout", "grid");
  }

  if (layout === "grid") {
    return <Grid />;
  } else if (layout === "list") {
    return (
      <>
        <h1 className="h-32 mx-auto rounded-md p-3 text-white text-4xl font-extrabold w-full text-center">List layout</h1>
      </>
    );
  }

  return <h1 className="h-32 mx-auto rounded-md p-3 text-white text-4xl font-extrabold w-full text-center">error rendering layout</h1>;
};

export default App;
