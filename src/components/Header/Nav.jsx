import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MenuRounded } from "@mui/icons-material";

const categories = [
  {
    title: "Độc Quyền Guardian",
    subcategories: [
      "Chăm sóc da mặt",
      "Trang điểm",
      "Chăm sóc cơ thể",
      "Chăm sóc sức khỏe",
      "Chăm sóc cá nhân",
      "Chăm sóc tóc",
      "Mẹ và Bé",
    ],
  },
  {
    title: "Chăm Sóc Da Mặt",
    subcategories: ["Sữa rửa mặt", "Toner", "Serum", "Kem dưỡng", "Mặt nạ"],
  },
  {
    title: "Trang Điểm",
    subcategories: ["Son môi", "Phấn nền", "Mascara", "Eyeliner", "Má hồng"],
  },
  {
    title: "Chăm Sóc Cơ Thể",
    subcategories: ["Sữa tắm", "Dưỡng thể", "Khử mùi", "Tẩy tế bào chết"],
  },
  {
    title: "Góc Nam Giới",
    subcategories: ["Sữa rửa mặt", "Dao cạo râu", "Nước hoa", "Chăm sóc tóc"],
  },
];

const Nav = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isDropdownClicked, setIsDropdownClicked] = useState(false);

  // Xử lý click ngoài dropdown để đóng
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".nav-menu") &&
        !event.target.closest(".nav-item")
      ) {
        setOpenDropdown(null);
        setIsDropdownClicked(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="bg-[#61c694] text-white py-4 px-6 flex justify-between items-center relative">
      {/* Menu chính */}
      <div className="nav-menu relative">
        <div
          className="menu-button flex items-center space-x-2 cursor-pointer"
          onMouseEnter={() => setOpenDropdown("DanhMuc")}
          onClick={() => setIsDropdownClicked(!isDropdownClicked)}
        >
          <MenuRounded className="text-3xl" />
          <span className="font-bold text-lg">Danh Mục Sản Phẩm</span>
        </div>

        {/* Dropdown chính */}
        {(openDropdown === "DanhMuc" || isDropdownClicked) && (
          <div
            className="dropdown-menu absolute left-0 top-full mt-2 bg-white text-black shadow-lg w-auto rounded-md flex p-4 gap-2 justify-center z-50"
            onMouseEnter={() => setOpenDropdown("DanhMuc")}
          >
            {categories.map((category, index) => (
              <div key={index} className="dropdown-category w-48">
                <h3 className="category-title font-semibold px-4 py-2 bg-gray-100 rounded-md text-center">
                  {category.title}
                </h3>
                <div className="subcategory-list mt-2 text-center">
                  {category.subcategories.map((sub, idx) => (
                    <Link
                      key={idx}
                      to={`/${sub.toLowerCase().replace(/\s/g, "-")}`}
                      className="subcategory-item block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu cấp 2 */}
      <nav className="nav-secondary flex space-x-10">
        {categories.slice(1).map((category, index) => (
          <div
            key={index}
            className="nav-item relative"
            onMouseEnter={() => setOpenDropdown(category.title)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <span className="nav-link cursor-pointer hover:underline">
              {category.title}
            </span>

            {/* Dropdown menu cấp 2 */}
            {openDropdown === category.title && (
              <div className="dropdown-secondary absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-white text-black shadow-lg w-48 rounded-md text-center z-50">
                {category.subcategories.map((sub, idx) => (
                  <Link
                    key={idx}
                    to={`/${sub.toLowerCase().replace(/\s/g, "-")}`}
                    className="dropdown-item block px-4 py-2 hover:bg-gray-200"
                    onClick={() => setOpenDropdown(null)}
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
};

export default Nav;
