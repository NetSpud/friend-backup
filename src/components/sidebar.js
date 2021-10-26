import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const iconClasses = "block transition-all ease-linear bg-gray-800 hover:rounded-xl hover:bg-gray-900 cursor-pointer rounded-3xl fit-content text-center";

class Sidebar extends React.Component {
  render() {
    return (
      <div className="bg-blue-900 flex flex-col">
        <div className="mt-16 px-10">
          <Link replace to="/machines" className={iconClasses + " p-6"}>
            <FontAwesomeIcon className="text-xl text-white" icon="desktop" />
          </Link>
          <Link replace to="/friends" className={iconClasses + " my-6 p-6"}>
            <FontAwesomeIcon className="text-xl text-white" icon="user-alt" />
          </Link>
          <Link replace to="/files" className={iconClasses + " my-6 p-6"}>
            <FontAwesomeIcon className="text-xl text-white" icon="folder-open" />
          </Link>
          <Link replace to="/upload" className={iconClasses + " p-6"}>
            <FontAwesomeIcon className="text-xl text-white" icon="plus" />
          </Link>
          <Link replace to="/settings" className={iconClasses + " my-6 p-6"}>
            <FontAwesomeIcon className="text-xl text-white" icon="cog" />
          </Link>
        </div>
        <div className="bg-gray-800 mt-auto h-30 text-center text-white py-3">
          <div>Stored: 100GB</div>
        </div>
        <div className="h-20 text-center bg-blue-900 p-6">
          <FontAwesomeIcon className="text-3xl text-white cursor-pointer transition duration-200 ease-in-out hover:text-black" icon="sign-out-alt" />
        </div>
      </div>
    );
  }
}

export default Sidebar;
