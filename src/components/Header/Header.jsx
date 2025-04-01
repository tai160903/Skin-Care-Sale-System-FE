import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, InputAdornment } from "@mui/material";
import { LibraryBooksRounded as BlogIcon } from "@mui/icons-material";
import { LocalShippingRounded as ShippingIcon } from "@mui/icons-material";
import {
  Search as SearchIcon,
  AccountCircleRounded as AccountIcon,
} from "@mui/icons-material";
import CompareIcon from "@mui/icons-material/Compare";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import CartA from "./CartA";
import Question from "./Question";
import { clearCart } from "../../redux/slices/cartSlice";

const Header = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const cart = useSelector((state) => state.cart.items);
  const customerId = useSelector((state) => state?.user?.customer?._id);
  const role = useSelector((state) => state?.user?.user?.role);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // If there is a search query, navigate with the query parameter
      navigate(`/all-products?q=${encodeURIComponent(searchQuery)}`);
    } else {
      // If search query is empty, navigate to all-products without query parameter
      navigate("/all-products");
    }
  };

  return (
    <header className="bg-white text-black py-4 px-8 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-10 w-1/2 pl-8 w-3xl">
        <Link
          to="/"
          className="text-4xl font-bold text-green-700 cursor-pointer"
          onClick={(e) => {
            e.preventDefault(); // Prevent default Link behavior
            window.location.href = "/"; // Force full page reload
          }}
        >
          SkinCare
        </Link>
        <TextField
          variant="outlined"
          placeholder="Bạn cần tìm gì?"
          size="small"
          className="w-full shadow-xl rounded-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  className="text-gray-900 cursor-pointer"
                  onClick={handleSearch}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00c853", // Bright green
              borderRadius: "999px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00c853", // Bright green on hover
              borderWidth: "2px",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00c853", // Bright green when focused
              borderWidth: "2px",
            },
          }}
        />
      </div>

      <nav className="flex items-center space-x-6">
        <Link
          to={`/profile/${customerId}/order-tr`}
          className="flex items-center text-gray-700 hover:text-green-700 space-x-2"
        >
          <ShippingIcon className="text-[#326f51] text-xl" />
          <span>Tra cứu đơn</span>
        </Link>
        <Link
          to="/blog"
          className="flex items-center text-gray-700 hover:text-green-700 space-x-2"
        >
          <BlogIcon className="text-[#326f51] text-xl" />
          <span>Tin Tức</span>
        </Link>
        <Link
          to="/comparison"
          className="flex items-center text-gray-700 hover:text-green-700 space-x-2"
        >
          <CompareIcon className="text-[#326f51] text-xl" />
          <span>So sánh</span>
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
                  <LinkItem to={`/profile/${customerId}`} label="Hồ sơ" />
                  {role === "admin" && <LinkItem to="/admin" label="Quản lý" />}
                  {role === "staff" && (
                    <LinkItem to="/staff" label="Nhân viên" />
                  )}
                  <LinkItem
                    to={`/profile/${customerId}/order-tracking`}
                    label="Lịch sử đặt hàng"
                  />
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
