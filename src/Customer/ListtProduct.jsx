import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/userSlice";
import productService from "../services/productService";
import { Card, CardContent } from "@mui/material";
import { Rating, CircularProgress } from "@mui/material";

function ListProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await productService.getAllProduct();
        console.log("Data:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");
    const user = urlParams.get("user")
      ? JSON.parse(urlParams.get("user"))
      : null;

    if (token && user) {
      dispatch(
        login({
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          token,
        }),
      );
    }

    setTimeout(() => {
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 1000);
  }, [dispatch]);

  const handleProductClick = (id) => {
    console.log("Navigating to product:", id);
    navigate(`/product/${id}`);
  };

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid xl:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
          {data.map((item, index) => {
            const price = item.price
              ? parseFloat(item.price.$numberDecimal || item.price)
              : 100.0;

            return (
              <Card
                key={index}
                className="rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => handleProductClick(item._id)} // Thêm sự kiện click
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-52 object-cover rounded-t-2xl"
                />
                <CardContent className="p-5 text-center">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <Rating
                    name="half-rating-read"
                    defaultValue={item.rating}
                    precision={0.5}
                    readOnly
                  />
                  <p className="text-gray-500 text-sm truncate">
                    {item.description}
                  </p>
                  <p className="text-lg font-bold text-green-600 mt-3">
                    ${price.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ListProduct;
