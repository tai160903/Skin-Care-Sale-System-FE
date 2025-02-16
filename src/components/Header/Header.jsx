import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, InputAdornment } from "@mui/material";
import {
  Search as SearchIcon,
  AccountCircleRounded as AccountIcon,
} from "@mui/icons-material";
import { FaCartShopping, FaHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
// import Cart from "./Headers/Cart";
// import Question from "./Headers/Question";
// import Map from "./Headers/Map";
// import Blog from "./Headers/Blog";
// import OrTrack from "./Headers/OrTrack";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && accessToken !== token) {
      navigate(0);
    }
  }, [token, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("persist:root");
  };

  return (
    <header className="bg-white text-black py-4 px-8 flex justify-between items-center shadow-md">
      {/* Logo & Search */}
      <div className="flex items-center space-x-12 pl-8 w-3xl">
        <h1 className="text-4xl font-bold text-green-700">SkinCare</h1>
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
            sx: {
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
            },
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-6">
        {/* <OrTrack />
        <Map />
        <Blog />
        <Question /> */}
      </nav>

      {/* Cart, Wishlist & User */}
      <div className="flex items-center space-x-6 relative">
        {/* <Cart /> */}
        <div className="relative">
          <FaHeart className="cursor-pointer text-xl text-gray-700" />
          <p className="absolute top-[-0.5rem] right-[-0.5rem] bg-red-600 text-white w-4 h-4 flex items-center justify-center rounded-full">
            0
          </p>
        </div>
        <div className="relative">
          <FaCartShopping className="cursor-pointer text-xl text-gray-700" />
          <p className="absolute top-[-0.5rem] right-[-0.5rem] bg-red-600 text-white w-4 h-4 flex items-center justify-center rounded-full">
            0
          </p>
        </div>
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
                  <LinkItem to="/profile" label="Hồ sơ" />
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
