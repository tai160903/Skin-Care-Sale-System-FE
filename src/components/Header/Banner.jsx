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
        <h2 className="text-lg font-bold">{"Don't know your skin type?"}</h2>
        {/* <p className="text-xs mt-1">Sign up today and get 20% off on your first purchase.</p> */}
      </div>

      {/* Phần 3: Nút bấm */}
      <div>
        <button
          className="bg-white text-green-900 px-3 py-1 rounded font-medium shadow hover:bg-gray-200 transition"
          onClick={() => (window.location.href = "/question")}
        >
          Do quiz
        </button>
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
