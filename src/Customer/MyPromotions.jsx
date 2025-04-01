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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Khuyến mãi của tôi
      </h1>

      {promotions.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-gray-600">Bạn chưa có mã khuyến mãi nào</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promotion) => (
            <div
              key={promotion._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="bg-blue-600 p-4 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">
                    {promotion.discount_percentage}%
                  </span>
                  <span className="text-sm bg-blue-700 px-2 py-1 rounded">
                    {formatDate(promotion.start_date)} -{" "}
                    {formatDate(promotion.end_date)}
                  </span>
                </div>
                <p className="text-sm opacity-90 mt-1">Giảm giá</p>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Mã khuyến mãi</p>
                  <div className="flex items-center">
                    <span className="font-mono bg-gray-100 px-3 py-2 rounded-md text-lg font-bold">
                      {promotion.code}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <div>
                    <p className="font-medium">Ngày tạo:</p>
                    <p>{formatDate(promotion.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Hiệu lực:</p>
                    <p>
                      {new Date(promotion.end_date) > new Date() ? (
                        <span className="text-green-600">Còn hiệu lực</span>
                      ) : (
                        <span className="text-red-600">Hết hạn</span>
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
  );
}

export default MyPromotions;
