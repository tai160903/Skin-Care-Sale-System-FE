import { useState } from "react";

const TABS = [
  { id: "introduction", label: "Giới Thiệu" },
  { id: "usage", label: "Hướng Dẫn Sử Dụng" },
  { id: "benefits", label: "Công Dụng" },
  { id: "ingredients", label: "Thành Phần" },
  { id: "more-info", label: "Thông tin thêm" },
];

const CONTENT = {
  introduction: "📖 Nội dung phần giới thiệu sản phẩm...",
  usage: `
  ### **HƯỚNG DẪN SỬ DỤNG:**
  - Sau các bước chăm sóc da hàng ngày, lấy một lượng vừa đủ ra đầu ngón tay và thoa nhẹ nhàng lên mặt.

  ### **Bảo quản:**
  1. Không đặt ở nơi có ánh nắng mặt trời và những nơi có nhiệt độ cao.
  2. Hãy để xa tầm tay trẻ sơ sinh và trẻ nhỏ.
  3. Đóng chặt nắp sau khi sử dụng.
  4. Nếu số lượng sử dụng quá ít sẽ không thể bảo vệ đầy đủ trước tác hại của tia cực tím.
  5. Khi đổ mồ hôi, hãy lau nhẹ bằng khăn rồi thoa lại.

  ### **Lưu ý:**
  - Không sử dụng trên vùng da bị tổn thương, phát ban, chàm hoặc sưng tấy.
  - Sản phẩm đã qua kiểm tra chất lượng nhưng có thể không phù hợp với một số loại da.
  - Nếu xảy ra phản ứng bất thường, hãy ngừng sử dụng ngay lập tức.
  - Nếu sản phẩm vô tình dính vào mắt, hãy rửa sạch bằng nước ngay.
  `,
  benefits: "🌿 Công dụng chính của sản phẩm...",
  ingredients: "📜 Thành phần chi tiết của sản phẩm...",
  "more-info": "ℹ️ Thông tin thêm về sản phẩm...",
};

function Content() {
  const [activeTab, setActiveTab] = useState("usage");

  return (
    <div className="container mx-auto p-6">
      {/* Tabs */}
      <div className="flex justify-center border-b bg-gray-100 rounded-t-lg">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`px-6 py-3 text-lg font-medium transition-all duration-300 
              ${
                activeTab === tab.id
                  ? "bg-green-500 text-white rounded-t-lg"
                  : "text-gray-800 hover:text-green-500"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Nội dung */}
      <div className="p-6 bg-white border border-gray-300 rounded-b-lg shadow-md">
        <div className="whitespace-pre-line text-gray-800">
          {CONTENT[activeTab]}
        </div>
      </div>
    </div>
  );
}

export default Content;
