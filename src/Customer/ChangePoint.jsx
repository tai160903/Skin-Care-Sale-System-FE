import { useEffect, useState } from "react";
import profileService from "../services/profileService";
import { useParams } from "react-router-dom";

function ChangePoint() {
  const { customerId } = useParams();
  const [points, setPoints] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [promotion, setPromotion] = useState(null);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    const response = await profileService.getProfile(customerId);
    setPoints(response.data.data.point);
  };

  const handleRedeem = async () => {
    if (!selectedOption) return alert("Vui lòng chọn một mức đổi điểm.");
    const response = await profileService.redeemPoints({
      customer_id: customerId,
      point: selectedOption.pointCost,
    });
    setPromotion(response.data.data);
  };

  const redemptionOptions = [
    { id: 1, pointCost: 10000, discount: "5%" },
    { id: 2, pointCost: 20000, discount: "7%" },
    { id: 3, pointCost: 30000, discount: "10%" },
  ];

  return (
    <div className="max-w-md mx-auto p-5 border border-gray-300 rounded-lg shadow-md text-center">
      <h1 className="text-gray-800 text-2xl font-bold mb-4">Đổi điểm thưởng</h1>
      <p className="text-base font-bold mb-4">
        Điểm hiện tại: <span className="text-blue-600">{points}</span>
      </p>
      <div className="space-y-2">
        {redemptionOptions.map((option) => (
          <label
            key={option.id}
            className={`block p-3 border rounded-md cursor-pointer transition-colors ${
              points < option.pointCost
                ? "bg-gray-100 border-gray-200 text-gray-400"
                : "bg-gray-50 border-gray-300 hover:bg-gray-100"
            }`}
          >
            <input
              type="radio"
              name="redeemOption"
              value={option.id}
              onChange={() => setSelectedOption(option)}
              disabled={points < option.pointCost}
              className="mr-2"
            />
            {option.pointCost} điểm - Giảm <strong>{option.discount}</strong>
          </label>
        ))}
      </div>
      <button
        onClick={handleRedeem}
        disabled={!selectedOption || points < selectedOption.pointCost}
        className={`w-full py-2 mt-4 text-white font-bold rounded-md transition-colors ${
          !selectedOption || points < selectedOption.pointCost
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Đổi ngay
      </button>
      {promotion && (
        <div className="mt-5 p-4 border border-green-500 rounded-md bg-green-50">
          <h3 className="text-green-600 text-xl font-bold mb-2">
            Đổi điểm thành công!
          </h3>
          <p>
            <strong>Mã giảm giá:</strong> {promotion.code}
          </p>
          <p>
            <strong>Giảm:</strong> {promotion.discount_percentage}%
          </p>
          <p>
            <strong>Hiệu lực:</strong>{" "}
            {new Date(promotion.start_date).toLocaleDateString()} -{" "}
            {new Date(promotion.end_date).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default ChangePoint;
