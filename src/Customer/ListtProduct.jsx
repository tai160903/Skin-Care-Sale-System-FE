import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import productService from "../services/productService";
import {
  Card,
  CardContent,
  Typography,
  Rating,
  Pagination,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { formatCurrency } from "../utils/formatCurrency";

function ListProduct() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page")) || 1;

  const [page, setPage] = useState(initialPage);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await productService.getAllProduct({ page, limit });
        setData(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch products",
        );
      }
    };
    fetchData();
  }, [page, limit]);

  useEffect(() => {
    const newParams = new URLSearchParams(location.search);
    if (parseInt(newParams.get("page")) !== page) {
      newParams.set("page", page);
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  }, [page, location.search, navigate]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="p-10">
      <Typography variant="h5" fontWeight="bold" color="green" sx={{ mb: 3 }}>
        Gợi ý cho bạn
      </Typography>

      <div className="flex flex-wrap gap-6 justify-start">
        {data.map((item, index) => (
          <Card
            key={index}
            className="min-w-[220px] max-w-[250px] flex-1 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-200"
            onClick={() => handleProductClick(item._id)}
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-60 object-cover rounded-t-xl"
              />
              {item.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                  -{item.discountPercentage}%
                </span>
              )}
            </div>

            <CardContent className="p-4">
              <Typography
                variant="h6"
                fontWeight="bold"
                className="text-center text-gray-800 truncate"
              >
                {item.name}
              </Typography>
              <div className="flex justify-center mt-2">
                <Rating
                  name="read-only"
                  value={item.rating}
                  precision={0.5}
                  readOnly
                  size="small"
                />
              </div>
              <p className="text-gray-500 text-sm text-center mt-1 truncate">
                {item.description}
              </p>

              <div className="mt-4 flex justify-center items-center gap-2">
                {item.discountPercentage > 0 ? (
                  <>
                    <span className="text-lg font-bold text-red-500">
                      {formatCurrency(
                        item.price * (1 - item.discountPercentage / 100),
                      )}
                    </span>
                    <span className="text-sm font-medium text-gray-500 line-through">
                      {formatCurrency(item.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(item.price)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </div>
  );
}

export default ListProduct;
