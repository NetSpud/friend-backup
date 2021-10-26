import React, { useState, useEffect } from "react";
import File from "../components/file";

const FetchMachines = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  useEffect(() => {
    window.server.send("remote-files", "");
    window.server.subscribe("remote-files", (event, arg) => {
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
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    console.log("mapping");

    return (
      <>
        {items.map((item, i) => (
          <File key={i} filename={item.originalFilename} />
        ))}
      </>
    );
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="bg-red-500 flex flex-grow p-3">
        <div className="py-5 bg-gray-900 h-auto px-5 rounded-xl w-full lg:w-9/12 grid grid-rows-6 mx-auto">
          <div className="text-center">
            <h1 className="text-white text-4xl font-extrabold">Remote Files</h1>
          </div>
          <div className="flex gap-4 flex-wrap mx-auto">
            <FetchMachines />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
