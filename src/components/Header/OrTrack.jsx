import React from "react";
import { Link } from "react-router-dom";
import { LocalShippingRounded as ShippingIcon } from "@mui/icons-material";

const OrTrack = () => {
  return (
    <Link to="/order-tracking" className="flex items-center text-gray-700 hover:text-green-700 space-x-2">
      <ShippingIcon className="text-[#326f51] text-xl" />
      <span>Tra cứu đơn</span>
    </Link>
  );
};

export default OrTrack;
