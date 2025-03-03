import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaTimesCircle, FaShoppingCart, FaHome } from "react-icons/fa";
import { Button, Typography, Box, Paper, Divider } from "@mui/material";
import draftOrderService from "../services/draftOrderService";

const CancelPayment = () => {
  const orderId = useSelector((state) => state.order?.order?._id);

  useEffect(() => {
    const deleteOrder = async () => {
      try {
        if (!orderId) return;
        await draftOrderService.deleteOrder(orderId);
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    };

    deleteOrder();
  }, [orderId]);

  return (
    <Box className="container mx-auto p-6 max-w-2xl">
      <Paper elevation={3} className="p-6 rounded-lg">
        <Box className="flex flex-col items-center mb-6">
          <FaTimesCircle className="text-red-500 text-6xl mb-4" />
          <Typography variant="h4" fontWeight="bold" align="center">
            Thanh toán đã bị hủy
          </Typography>
          <Typography variant="subtitle1" align="center" className="mt-2">
            Đơn hàng của bạn chưa được thanh toán và đã bị hủy.
          </Typography>
        </Box>

        <Divider className="my-4" />

        <Box className="my-4 p-4 bg-gray-100 rounded-lg">
          <Typography variant="body1" align="center">
            Bạn có thể quay lại giỏ hàng để tiếp tục mua sắm hoặc thử lại thanh
            toán. Nếu bạn gặp vấn đề với việc thanh toán, vui lòng liên hệ với
            chúng tôi để được hỗ trợ.
          </Typography>
        </Box>

        <Box className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaShoppingCart />}
            fullWidth
            onClick={() => {
              window.location.href = "/cart";
            }}
          >
            Quay lại giỏ hàng
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FaHome />}
            fullWidth
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Về trang chủ
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CancelPayment;
