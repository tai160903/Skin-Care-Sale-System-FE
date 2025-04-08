import { useEffect, useState } from "react";
import profileService from "../services/profileService";
import { useParams } from "react-router-dom";

function ChangePoint() {
  const { customerId } = useParams();
  const [points, setPoints] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [promotion, setPromotion] = useState(null);
  const [redemptionOptions, setRedemptionOptions] = useState([]); // Thêm state cho options
  const [loading, setLoading] = useState(true); // Thêm state để quản lý loading

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Gọi API để lấy điểm
      const profileResponse = await profileService.getProfile(customerId);
      setPoints(profileResponse.data.data.point);

      const optionsResponse = await profileService.getRedemptionOptions();
      setRedemptionOptions(optionsResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!selectedOption) return alert("Vui lòng chọn một mức đổi điểm.");
    try {
      const response = await profileService.redeemPoints({
        customer_id: customerId,
        point: selectedOption.point,
      });
      setPromotion(response.data.data);
    } catch (error) {
      console.error("Error redeeming points:", error);
      alert("Có lỗi xảy ra khi đổi điểm.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Đổi Điểm Thưởng
        </h1>

        {/* Current Points */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-center">
          <p className="text-sm text-gray-600">Điểm hiện tại</p>
          <p className="text-3xl font-bold text-blue-600">{points}</p>
        </div>

        {/* Redemption Options */}
        <div className="space-y-4 mb-6">
          {redemptionOptions.map((option) => (
            <label
              key={option.id}
              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                points < option.point
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : selectedOption?.id === option.id
                    ? "bg-blue-50 border-blue-500"
                    : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="redeemOption"
                value={option.id}
                onChange={() => setSelectedOption(option)}
                disabled={points < option.point}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold">{option.point} điểm</p>
                <p className="text-sm">
                  Giảm{" "}
                  <span className="font-bold text-green-600">
                    {option.discount}
                  </span>
                </p>
              </div>
              {points < option.pointCost && (
                <span className="text-xs text-red-500">Không đủ điểm</span>
              )}
            </label>
          ))}
        </div>

        {/* Redeem Button */}
        <button
          onClick={handleRedeem}
          disabled={!selectedOption || points < selectedOption?.point}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
            !selectedOption || points < selectedOption?.point
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Đổi Ngay
        </button>

        {/* Promotion Result */}
        {promotion && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-700 mb-3">
              Đổi Điểm Thành Công!
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Mã giảm giá:</span>{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {promotion.code}
                </span>
              </p>
              <p>
                <span className="font-medium">Giảm:</span>{" "}
                <span className="text-green-600 font-semibold">
                  {promotion.discount_percentage}%
                </span>
              </p>
              <p>
                <span className="font-medium">Hiệu lực:</span>{" "}
                {new Date(promotion.start_date).toLocaleDateString("vi-VN")} -{" "}
                {new Date(promotion.end_date).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChangePoint;