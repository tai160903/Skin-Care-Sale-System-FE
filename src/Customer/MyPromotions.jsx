import { useEffect, useState } from "react";
import profileService from "../services/profileService";
import { useParams } from "react-router-dom";

function MyPromotions() {
  const { customerId } = useParams();
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    fetchPromotionsByCustomerId();
  }, []);

  const fetchPromotionsByCustomerId = async () => {
    try {
      const response =
        await profileService.getPromotionsByCustomerId(customerId);
      const sortedPromotions = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setPromotions(sortedPromotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Khuyến Mãi Của Tôi
        </h1>

        {/* No Promotions */}
        {promotions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">
              Bạn chưa có mã khuyến mãi nào
            </p>
            <p className="text-gray-400 mt-2">
              Hãy tham gia các chương trình để nhận ưu đãi!
            </p>
          </div>
        ) : (
          /* Promotions List */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promotion) => (
              <div
                key={promotion._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      {promotion.discount_percentage}%
                    </span>
                    <span className="text-xs bg-blue-800 px-2 py-1 rounded-full">
                      {formatDate(promotion.start_date)} -{" "}
                      {formatDate(promotion.end_date)}
                    </span>
                  </div>
                  <p className="text-sm opacity-90 mt-1">Giảm giá đơn hàng</p>
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Mã khuyến mãi</p>
                    <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                      <span className="font-mono text-lg font-semibold text-gray-800">
                        {promotion.code}
                      </span>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(promotion.code)
                        }
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Sao chép
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <div>
                      <p className="font-medium">Ngày tạo</p>
                      <p>{formatDate(promotion.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Trạng thái</p>
                      <p>
                        {new Date(promotion.end_date) > new Date() ? (
                          <span className="text-green-600 font-semibold">
                            Còn hiệu lực
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            Hết hạn
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPromotions;
