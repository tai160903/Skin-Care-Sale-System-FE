import { Link } from "react-router-dom";
import { Badge } from "@mui/material";
import { ShoppingCartRounded as CartIcon } from "@mui/icons-material";

const CartA = ({ number }) => {
  return (
    <Link
      to="/cart"
      className="flex items-center text-gray-700 hover:text-green-700"
    >
      <Badge badgeContent={number} color="primary">
        <CartIcon className="text-[#326f51] text-3xl" />
      </Badge>
      <span>Giỏ hàng</span>
    </Link>
  );
};

export default CartA;
