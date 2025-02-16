import React from "react";
import { Link } from "react-router-dom";
import { RoomRounded as LocationIcon } from "@mui/icons-material";

const Map = () => {
  return (
    <Link
      to="/store-location"
      className="flex items-center text-gray-700 hover:text-green-700 space-x-2"
    >
      <LocationIcon className="text-[#326f51] text-xl" />
      <span>Vị trí</span>
    </Link>
  );
};

export default Map;
