import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productService from "../services/productService";

const TABS = [
  { id: "description", label: "Giới Thiệu" },
  { id: "userManual", label: "Hướng Dẫn Sử Dụng" },
  { id: "virtue", label: "Công Dụng" },
  { id: "ingredient", label: "Thành Phần" }, // ✅ Thêm tab "Thành Phần"
];

function Content() {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(id);
        setProduct(response.data);
      } catch (error) {
        setError("Không thể tải dữ liệu sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center p-6">⏳ Đang tải...</div>;
  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

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
          {product
            ? product[activeTab] || "Chưa có thông tin."
            : "Không tìm thấy sản phẩm."}
        </div>
      </div>
    </div>
  );
}

export default Content;
