import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const File = (props) => {
  return (
    <div className="bg-green-500 w-auto h-24 rounded-md flex justify-center items-center flex-col cursor-pointer p-3">
      <div>
        <FontAwesomeIcon icon="file" className="text-white text-2xl" />
      </div>
      <div className="text-white">{props.filename}</div>
    </div>
  );
};
export default File;
