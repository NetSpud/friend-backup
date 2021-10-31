import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useLocation } from "react-router-dom";
const Page = () => {
  const urlParams = new URLSearchParams(useLocation().search);
  const id = urlParams.get("id");
  return (
    <>
      <div className="bg-red-500 flex flex-grow p-3">
        <div className="py-5 bg-gray-900 h-auto px-5 space-y-5 rounded-xl w-full lg:w-9/12 grid grid-rows-3 mx-auto">
          {/* <button className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-red-600 hover:bg-red-900 text-white font-semibold py-3 px-6 rounded-md">Remove Machine</button> */}
          <div className="rounded-full bg-blue-900 w-44 h-44 flex justify-center items-center flex-col mx-auto">
            <div className="relative">
              <FontAwesomeIcon icon="desktop" size="4x" className="text-white" />
              <div className="absolute bg-green-500 w-3 h-3 rounded-full top-minus-7 right-minus-10"></div>
            </div>
            <span className="block text-white mt-2">{id}</span>
          </div>
          <div className="bg-blue-900 h-32 mx-auto rounded-md p-3 text-white font-semibold w-full max-w-xs text-sm">
            <ul className="list-disc list-inside">
              <li>Ping: 10ms</li>
              <li>Upload: 30mb/s</li>
              <li>Download: 100 mb/s</li>
              <li>Storage Remaining: 565GB</li>
            </ul>
          </div>
          <div className="text-right self-end">
            <button className="rounded-full w-28 h-28 bg-blue-900 text-center flex justify-center items-center flex-col ml-auto mt-3" href="#!">
              <FontAwesomeIcon icon="user-alt" size="3x" className="text-white" />
              <span className="block text-white">EM</span>
            </button>
          </div>
          <div className="text-right self-end">
            <button className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-red-600 hover:bg-red-900 text-white font-semibold py-3 px-6 rounded-md">Remove Machine</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
