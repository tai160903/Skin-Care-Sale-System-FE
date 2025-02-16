import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@mui/material";
import { ShoppingCartRounded as CartIcon } from "@mui/icons-material";

const Cart = () => {
  return (
    <Link
      to="/cart"
      className="flex items-center text-gray-700 hover:text-green-700"
    >
      <Badge badgeContent={2} color="primary">
        <CartIcon className="text-[#326f51] text-3xl" />
      </Badge>
      <span>Giỏ hàng</span>
    </Link>
  );
};

export default Cart;
