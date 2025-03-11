import { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, InputAdornment } from "@mui/material";
import { LibraryBooksRounded as BlogIcon } from "@mui/icons-material";
import { RoomRounded as LocationIcon } from "@mui/icons-material";
import { LocalShippingRounded as ShippingIcon } from "@mui/icons-material";
import {
  Search as SearchIcon,
  AccountCircleRounded as AccountIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import CartA from "./CartA";
import Question from "./Question";
import { clearCart } from "../../redux/slices/cartSlice";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);
  const customer = useSelector((state) => state.user.customer);
  console.log("customer header", customer);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    localStorage.removeItem("user"); // Xóa dữ liệu user trong localStorage
    localStorage.removeItem("cart"); // Xóa giỏ hàng trong localStorage (nếu đang lưu)
  };
  console.log("token", token);

  return (
    <header className="bg-white text-black py-4 px-8 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-10  w-1/2 pl-8 w-3xl">
        <Link
          to="/"
          className="text-4xl font-bold text-green-700 cursor-pointer"
        >
          SkinCare
        </Link>

        <TextField
          variant="outlined"
          placeholder="Bạn cần tìm gì?"
          size="small"
          className="w-full bg-white shadow-xl rounded-full"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-gray-500" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid black",
              borderRadius: "999px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#326f51",
              borderWidth: "2px",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#326f51",
              borderWidth: "2px",
            },
          }}
        />
      </div>

      <nav className="flex items-center space-x-6">
        <Link
          to="/order-tracking"
          className="flex items-center text-gray-700 hover:text-green-700 space-x-2"
        >
          <ShippingIcon className="text-[#326f51] text-xl" />
          <span>Tra cứu đơn</span>
        </Link>
        <Link
          to="/store-location"
          className="flex items-center text-gray-700 hover:text-green-700 space-x-2"
        >
          <LocationIcon className="text-[#326f51] text-xl" />
          <span>Vị trí</span>
        </Link>
        <Link
          to="/blog"
          className="flex items-center text-gray-700 hover:text-green-700 space-x-2"
        >
          <BlogIcon className="text-[#326f51] text-xl" />
          <span>Tin Tức</span>
        </Link>
        <Question />
      </nav>

      <div className="flex items-center space-x-6 relative">
        <CartA number={cart.length} />

        <div className="relative">
          <div
            className="flex items-center cursor-pointer space-x-2"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <AccountIcon className="text-[#326f51] text-4xl" />
            <span className="text-gray-700 hover:text-green-700">
              Tài khoản
            </span>
          </div>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg border z-10">
              {!token || token === null ? (
                <>
                  <LinkItem to="/signup" label="Đăng ký" />
                  <LinkItem to="/signin" label="Đăng nhập" />
                </>
              ) : (
                <>
                  <LinkItem to={`/profile/${customer._id}`} label="Hồ sơ" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Đăng xuất
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const LinkItem = ({ to, label }) => (
  <Link to={to} className="block px-4 py-2 hover:bg-gray-200">
    {label}
  </Link>
);

export default Header;
