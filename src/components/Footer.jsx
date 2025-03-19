import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  YouTube,
  MailOutline,
  Phone,
} from "@mui/icons-material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const Nav = () => {
  const position = [10.841987, 106.810558];

  return (
    <footer className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 pt-6 px-6 md:px-16">
      <div className="grid grid-cols-5 grid-rows-4 gap-4">
        <div className="row-span-4">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-green-700 tracking-tight">
              SkinCare
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              Chăm sóc làn da bạn với những sản phẩm từ thiên nhiên thuần khiết
              và an toàn.
            </p>
          </div>
        </div>
        <div className="row-span-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Liên Kết Nhanh
            </h3>
            <ul className="space-y-3">
              {[
                { to: "#", text: "Chính sách bảo mật" },
                { to: "#", text: "Điều khoản sử dụng" },
                { to: "#", text: "Hỗ trợ khách hàng" },
                { to: "#", text: "Blog" },
                { to: "#", text: "Khảo sát da" }, // Đã đổi tên từ "Hỏi đáp"
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-600 hover:text-green-700 transition-colors duration-200 text-sm"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-span-2 col-start-4 row-start-1">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Theo Dõi Chúng Tôi
            </h3>
            <div className="flex space-x-6">
              {[
                { href: "#", Icon: Facebook, color: "text-blue-600" },
                { href: "#", Icon: Instagram, color: "text-pink-500" },
                { href: "#", Icon: YouTube, color: "text-red-600" },
              ].map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform hover:scale-110 transition-transform duration-200"
                >
                  <social.Icon
                    className={`${social.color} w-8 h-8 hover:opacity-90`}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-2 row-span-3 col-start-4 row-start-2">
          <div className="h-52 w-full">
            <MapContainer
              center={position}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={position}>
                <Popup>
                  <strong>📍 Đại học FPT Hồ Chí Minh</strong> <br />
                  Khu Công Nghệ Cao, Thủ Đức, TP.HCM
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
        <div className="row-span-4 col-start-3 row-start-1">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              Hỗ Trợ Khách Hàng
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Phone className="text-green-700 w-5 h-5" />
                <span className="text-gray-700">1900 9999</span>
              </li>
              <li className="flex items-center space-x-3">
                <MailOutline className="text-green-700 w-5 h-5" />
                <span className="text-gray-700">support@skincare.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-6 border-t border-gray-300 text-center">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} SkinCare. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
};

export default Nav;
