import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  YouTube,
  MailOutline,
  Phone,
} from "@mui/icons-material";

const Nav = () => {
  return (
    <footer className="bg-gray-200 text-gray-700 py-8 px-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Cửa hàng */}
        <div>
          <h2 className="text-2xl font-bold text-green-700">SkinCare</h2>
          <p className="mt-2 text-sm">
            Chăm sóc làn da bạn với sản phẩm thiên nhiên.
          </p>
        </div>

        {/* Liên kết nhanh */}
        <div>
          <h3 className="text-lg font-semibold">Liên kết nhanh</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <Link to="/privacy-policy" className="hover:text-green-700">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-green-700">
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-green-700">
                Hỗ trợ khách hàng
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-green-700">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/questions" className="hover:text-green-700">
                Hỏi đáp
              </Link>
            </li>
          </ul>
        </div>

        {/* Hỗ trợ khách hàng */}
        <div>
          <h3 className="text-lg font-semibold">Hỗ trợ khách hàng</h3>
          <ul className="mt-2 space-y-2">
            <li className="flex items-center">
              <Phone className="text-green-700 mr-2" />
              <span>1900 9999</span>
            </li>
            <li className="flex items-center">
              <MailOutline className="text-green-700 mr-2" />
              <span>support@skincare.com</span>
            </li>
          </ul>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h3 className="text-lg font-semibold">Theo dõi chúng tôi</h3>
          <div className="mt-2 flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="text-blue-600 text-3xl hover:opacity-80" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="text-pink-500 text-3xl hover:opacity-80" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YouTube className="text-red-600 text-3xl hover:opacity-80" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-sm border-t pt-4">
        &copy; {new Date().getFullYear()} SkinCare. Tất cả quyền được bảo lưu.
      </div>
    </footer>
  );
};

export default Nav;
