import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productService from "../services/productService";

const TABS = [
  { id: "all", label: "Tất Cả" },
  { id: "description", label: "Giới Thiệu" },
  { id: "userManual", label: "Hướng Dẫn Sử Dụng" },
  { id: "virtue", label: "Công Dụng" },
  { id: "ingredient", label: "Thành Phần" },
];

function Content() {
  const { id } = useParams();
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
        setError(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="text-center p-6">
        <span className="text-lg text-gray-600 animate-pulse">
          ⏳ Đang tải...
        </span>
      </div>
    );
  if (error)
    return (
      <div className="text-center p-6">
        <span className="text-lg text-red-500">{error}</span>
      </div>
    );

  const renderContentBox = (title, content) => (
    <div className="border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto">
      <h3 className="text-xl font-semibold text-green-600 mb-3">{title}</h3>
      <p className="text-gray-700 leading-relaxed">
        {content || `Chưa có thông tin ${title.toLowerCase()}.`}
      </p>
    </div>
  );

  const renderAllContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        {renderContentBox("Giới Thiệu", product?.description)}
        {renderContentBox("Công Dụng", product?.virtue)}
      </div>
      <div className="space-y-6">
        {renderContentBox("Hướng Dẫn Sử Dụng", product?.userManual)}
        {renderContentBox("Thành Phần", product?.ingredient)}
      </div>
    </div>
  );

  const renderSingleContent = (tabId) => {
    const tab = TABS.find((t) => t.id === tabId);
    return (
      <div className="grid grid-cols-1 gap-6">
        {renderContentBox(tab.label, product?.[tabId])}
      </div>
    );
  };

  return (
    <div className="mt-8 w-full ">
      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center border-b bg-gray-100 rounded-t-lg shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`px-6 py-3 text-lg font-medium transition-all duration-300 
              ${
                activeTab === tab.id
                  ? "bg-green-500 text-white rounded-t-md shadow-md"
                  : "text-gray-800 hover:text-green-500 hover:bg-gray-200"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 bg-white border border-gray-200 rounded-b-lg shadow-lg">
        {activeTab === "all"
          ? renderAllContent()
          : renderSingleContent(activeTab)}
      </div>
    </div>
  );
}

export default Content;
