import { Link } from "react-router-dom";
const Banner = () => {
  return (
    <div className="bg-[#326f51] text-white py-3 px-4 text-center shadow-lg w-full flex justify-between items-center">
      {/* Phần 1: Logo hoặc Icon */}
      <div className="flex items-center">
        <span className="text-xl font-bold">🌟</span>
      </div>

      {/* Phần 2: Nội dung chính (Nhấp nháy) */}
      <div
        className="text-center"
        style={{ animation: "blink 1s infinite" }} // Thêm animation vào style
      >
        <h2 className="text-lg font-bold">Khám phá loại da của bạn ngay!</h2>
        {/* <p className="text-xs mt-1">Sign up today and get 20% off on your first purchase.</p> */}
      </div>

      {/* Phần 3: Nút bấm */}
      <div className="flex-shrink-0">
        <Link to="/question">
          <button className="bg-white text-[#326f51] px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-opacity-90 hover:scale-105 transform transition-all duration-200">
            Khám Phá Ngay
          </button>
        </Link>
      </div>
      {/* Định nghĩa CSS animation trong JSX */}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Banner;
