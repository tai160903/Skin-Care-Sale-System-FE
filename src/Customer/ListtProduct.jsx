import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import productService from "../services/productService";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Pagination,
  Container,
  Grid,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { formatCurrency } from "../utils/formatCurrency";

function ListProduct() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page")) || 1;

  const [page, setPage] = useState(initialPage);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts({
          page,
          limit,
        });
        setData(response.data.data.filter((item) => !item.isDisabled));
        setTotalPages(response.data.totalPages);
      } catch (error) {
        toast.error(error.response?.data?.message || "Không thể tải sản phẩm");
      } finally {
        setLoading(false);
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
    window.scrollTo(0, 1200);
    setPage(value);
  };

  const handleProductClick = (id) => {
    navigate(`/product/detail/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="primary.main"
        sx={{ mb: 4, textAlign: "center", textTransform: "uppercase" }}
      >
        Gợi Ý Cho Bạn
      </Typography>
      <Link to="/all-products" style={{ textDecoration: "underline" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="gray"
          sx={{ mb: 4, textAlign: "start" }}
        >
          Xem thêm
        </Typography>
      </Link>

      <Grid container spacing={5}>
        {data.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
            <Card
              sx={{
                maxWidth: 300,
                mx: "auto",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  border: "1.5px solid #1976d2",
                },
              }}
              onClick={() => handleProductClick(item._id)}
            >
              <Box sx={{ position: "relative", maxHeight: "200px" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image || "https://via.placeholder.com/200"}
                  alt={item.name}
                  sx={{ objectFit: "cover", maxHeight: "200px" }}
                />
                {item.discountPercentage > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      bgcolor: "error.main",
                      color: "white",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                    }}
                  >
                    -{item.discountPercentage}%
                  </Box>
                )}
                {item.stock === 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      bgcolor: "grey.800",
                      color: "white",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                    }}
                  >
                    Hết hàng
                  </Box>
                )}
              </Box>

              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight="medium"
                  noWrap
                  sx={{ color: "text.primary", mb: 1 }}
                >
                  {item.name}
                </Typography>

                <Rating
                  value={item.rating || 0}
                  precision={0.5}
                  readOnly
                  size="small"
                  sx={{ mb: 1 }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.description}
                </Typography>

                <Box display="flex" justifyContent="center" gap={1}>
                  {item.discountPercentage > 0 ? (
                    <>
                      <Typography
                        variant="h6"
                        color="error.main"
                        fontWeight="bold"
                      >
                        {formatCurrency(
                          item.price * (1 - item.discountPercentage / 100),
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        {formatCurrency(item.price)}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="h6"
                      color="success.main"
                      fontWeight="bold"
                    >
                      {formatCurrency(item.price)}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="center" sx={{ mt: 6 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
          sx={{ "& .MuiPaginationItem-root": { borderRadius: 2 } }}
        />
      </Box>
    </Container>
  );
}

export default ListProduct;
