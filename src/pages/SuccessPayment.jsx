import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import { clearCart } from "../redux/slices/cartSlice";
import { FaCheckCircle, FaShoppingBag, FaHome } from "react-icons/fa";
import { Button, Typography, Box, Paper, Divider } from "@mui/material";

const SuccessPayment = () => {
  const dispatch = useDispatch();

  //const customerId = useSelector((state) => state?.user?.customer?._id);

  const data = JSON.parse(localStorage.getItem("order"));
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const handleContinueShopping = () => {
    navigate("/");
  };

  const order_id = data?.data?.order?._id;
  const handleViewOrders = () => {
    navigate(`/order-detail/${order_id}`);
  };

  if (!data) {
    return (
      <Box className="flex justify-center items-center min-h-[60vh]">
        <Typography variant="h6">Đang tải thông tin đơn hàng...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box className="container mx-auto p-6 max-w-2xl">
        <Paper elevation={3} className="p-6 rounded-lg">
          <Box className="flex flex-col items-center mb-6">
            <FaCheckCircle className="text-green-500 text-6xl mb-4" />
            <Typography variant="h4" fontWeight="bold" align="center">
              Đặt hàng thành công!
            </Typography>
            <Typography variant="subtitle1" align="center" className="mt-2">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
            </Typography>
          </Box>

          <Divider className="my-4" />

          <Typography variant="h6" fontWeight="bold" className="mb-3">
            Thông tin đơn hàng
          </Typography>

          <Box className="space-y-3">
            <Box className="flex justify-between">
              <Typography variant="body1">Mã đơn hàng: </Typography>
              <Typography variant="body1" fontWeight="bold">
                {data?.order?._id}
              </Typography>
            </Box>

            {data?.data?.order?.items && (
              <>
                <Divider className="my-4" />
                <Typography variant="h6" fontWeight="bold" className="mb-3">
                  Sản phẩm đã đặt
                </Typography>
                <Box className="space-y-2">
                  {data?.data?.order?.items.map((item, index) => (
                    <Box
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <Box className="flex flex-col">
                        <Typography variant="body2" fontWeight="medium">
                          {item.product_id?.name || item.name || "Sản phẩm"} x{" "}
                          {item.quantity}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(
                          item.product_id.price *
                            (1 - item.product_id.discountPercentage / 100) *
                            item.quantity,
                        )}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </>
            )}

            <Box className="flex justify-between">
              <Typography variant="body1">Phương thức thanh toán:</Typography>
              <Typography variant="body1" fontWeight="bold">
                {data?.data?.order?.payment_method === "paypal"
                  ? "PayPal"
                  : "Tiền mặt khi nhận hàng"}
              </Typography>
            </Box>

            {data?.data?.order?.shipping_price && (
              <Box className="flex justify-between">
                <Typography variant="body1">Tiền vận chuyển:</Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  className="text-red-600"
                >
                  {formatCurrency(data?.data?.order?.shipping_price || 0)}
                </Typography>
              </Box>
            )}

            {data?.data?.order?.discount > 0 && (
              <Box className="flex justify-between">
                <Typography variant="body1">Giảm:</Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  className="text-red-600"
                >
                  {formatCurrency(data?.data?.order?.discount || 0)}
                </Typography>
              </Box>
            )}

            <Box className="flex justify-between">
              <Typography variant="body1">Tổng tiền:</Typography>
              <Typography
                variant="body1"
                fontWeight="bold"
                className="text-red-600"
              >
                {formatCurrency(data?.data?.order?.totalPay || 0)}
              </Typography>
            </Box>

            <Box className="flex justify-between">
              <Typography variant="body1">Ngày đặt:</Typography>
              <Typography variant="body1" fontWeight="bold">
                {new Date(data?.order?.createdAt || new Date()).toLocaleString(
                  "vi-VN",
                )}
              </Typography>
            </Box>

            {data?.data?.order?.paypalOrderId && (
              <Box className="flex justify-between">
                <Typography variant="body1">Mã giao dịch PayPal:</Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  className="text-right max-w-[60%]"
                >
                  {data?.data?.order?.paypalOrderId}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider className="my-4" />

          <Box className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button
              variant="contained"
              color="primary"
              startIcon={<FaHome />}
              onClick={handleContinueShopping}
              fullWidth
            >
              Tiếp tục mua sắm
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FaShoppingBag />}
              onClick={handleViewOrders}
              fullWidth
            >
              Xem đơn hàng
            </Button>
          </Box>
        </Paper>
      </Box>

      <Box className="container mx-auto p-6 max-w-2xl">
        <Paper elevation={3} className="p-6 rounded-lg">
          <Typography variant="h6" fontWeight="bold" className="mb-3">
            Thông tin ship hàng
          </Typography>
          <Box className="space-y-2">
            {data?.data?.shipping?.shipping_phone && (
              <Box className="flex justify-between">
                <Typography variant="body1">Số điện thoại:</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {data?.data?.shipping?.shipping_phone}
                </Typography>
              </Box>
            )}

            {data?.data?.shipping?.shipping_status && (
              <Box className="flex justify-between">
                <Typography variant="body1">Trạng thái đơn hàng:</Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  className="text-right max-w-[60%]"
                >
                  {data?.data?.shipping?.shipping_status}
                </Typography>
              </Box>
            )}

            {data?.data?.shipping?.shipping_address && (
              <Box className="flex justify-between">
                <Typography variant="body1">Địa chỉ giao hàng:</Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  className="text-right max-w-[60%]"
                >
                  {data?.data?.shipping?.shipping_address}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default SuccessPayment;
