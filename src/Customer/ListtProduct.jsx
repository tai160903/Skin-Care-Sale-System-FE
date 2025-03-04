import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/userSlice";
import productService from "../services/productService";
import { Card, CardContent, Typography, CircularProgress, Rating } from "@mui/material";
import { toast } from "react-toastify";

function ListProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await productService.getAllProduct();
        setData(response.data.data);
      } catch (error) {
        toast.error("Lỗi khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");
    const user = urlParams.get("user") ? JSON.parse(urlParams.get("user")) : null;
    const customer = urlParams.get("customer") ? JSON.parse(urlParams.get("customer")) : null;

    if (token && user) {
      dispatch(
        login({
          user: {
            id: user?._doc?._id,
            email: user?._doc?.email,
            role: user?._doc?.role,
          },
          token,
          customer: customer?._doc,
        })
      );
    }

    setTimeout(() => {
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 1000);
  }, [dispatch]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="p-10">
      <Typography variant="h5" fontWeight="bold" color="green" sx={{ mb: 3 }}>
        Gợi ý cho bạn
      </Typography>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <Card
              key={index}
              className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-200"
              onClick={() => handleProductClick(item._id)}
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-60 object-cover rounded-t-xl"
                />
                {item.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    -{item.discountPercent}%
                  </span>
                )}
              </div>

              <CardContent className="p-4">
                <Typography variant="h6" fontWeight="bold" className="text-center text-gray-800">
                  {item.name}
                </Typography>
                <div className="flex justify-center mt-2">
                  <Rating name="read-only" value={item.rating} precision={0.5} readOnly size="small" />
                </div>
                <p className="text-gray-500 text-sm text-center mt-1 truncate">{item.description}</p>

                <div className="mt-4 flex justify-center items-center gap-2">
                  {item.discountPercent > 0 ? (
                    <>
                      <span className="text-lg font-bold text-red-500">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price * (1 - item.discountPercent / 100))}
                      </span>
                      <span className="text-sm font-medium text-gray-500 line-through">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-green-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListProduct;
