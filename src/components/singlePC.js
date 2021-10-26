import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { NavLink as Link } from "react-router-dom";

export default class SingleMachine extends React.Component {
  render() {
    return (
      <div className="bg-blue-900 h-44 w-full max-w-sm rounded-md relative select-none p-3">
        <div className="text-right">
          <Menu as="div" className="inline-block text-left">
            <div>
              <Menu.Button>
                <FontAwesomeIcon className="text-xl text-white cursor-pointer transition duration-200 ease-in-out hover:text-gray-900" icon="ellipsis-v" />
              </Menu.Button>
            </div>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 w-44 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to={`/single?id=${this.props.id}`} className={`${active ? "bg-blue-900 text-white" : "text-gray-900"} group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                        View
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a href="#!" className={`${active ? "bg-red-500 text-white" : "text-red-500"} group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                        Remove
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <div className="flex justify-center items-center">
          <FontAwesomeIcon className="flex text-4xl text-white cursor-pointer transition duration-100 ease-in-out hover:text-gray-900 justify-center" icon="desktop" />
        </div>
        <div className="flex justify-center items-center">
          <span className="text-md text-white cursor-pointer font-thin">{this.props.machineName}</span>
        </div>

        <div className="flex justify-center items-center">
          <Link exact replace className="text-center bg-gray-800 text-white font-semibold py-3 px-6 rounded-md mt-3 w-52 hover:bg-gray-900" to={`/single?id=${this.props.id}`}>
            View
          </Link>
        </div>
      </div>
    );
  }
}

// export default SingleMachine;
