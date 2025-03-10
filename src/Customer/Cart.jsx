import { useDispatch, useSelector } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../redux/slices/cartSlice";
import {
  Button,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import cartService from "../services/cartService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items) || [];
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum +
      item.product_id.price *
        (1 - item.product_id.discountPercentage / 100) *
        item.quantity,
    0,
  );
  const customerId = useSelector((state) => state.user.customer?._id);

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleRemoveItem = async (productId) => {
    if (!customerId) {
      toast.error("You must be logged in!");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      setTimeout(() => navigate("/signin"), 1000);
      return;
    }
    const userConfirmed = window.confirm(
      "Bạn có muốn xóa sản phẩm này ra khỏi giỏ hàng không",
    );

    if (userConfirmed) {
      try {
        const response = await cartService.removeItem(customerId, productId);
        if (response.status === 200) {
          await dispatch(removeFromCart(productId));
          toast.success(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleCheckout = () => {
    if (!customerId) {
      toast.error("Bạn cần đăng nhập để thanh toán!");
      navigate("/signin"); // Điều hướng đến trang đăng nhập
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống!");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Typography
        variant="h4"
        className="text-center font-bold text-gray-800 mb-6"
      >
        🛒 Giỏ Hàng Của Bạn
      </Typography>

      {cartItems.length === 0 ? (
        <Typography className="text-center text-gray-600">
          🛍️ Giỏ hàng của bạn đang trống!
        </Typography>
      ) : (
        <>
          <TableContainer
            component={Paper}
            className="shadow-md rounded-lg overflow-hidden"
          >
            <Table>
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell align="center">Giá</TableCell>
                  <TableCell align="center">Số lượng</TableCell>
                  <TableCell align="center">Tổng</TableCell>
                  <TableCell align="center">Xóa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow
                    key={item.product_id._id}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <img
                          src={item.product_id.image}
                          alt={item.product_id.name}
                          className="w-16 h-16 rounded-md object-cover shadow"
                        />
                        <Typography variant="body1" className="font-medium">
                          {item.product_id.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {formatCurrency(
                        item.product_id.price *
                          (1 - item.product_id.discountPercentage / 100),
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() =>
                          handleDecreaseQuantity(item.product_id._id)
                        }
                        color="error"
                      >
                        <Remove />
                      </IconButton>
                      <strong>{item.quantity}</strong>
                      <IconButton
                        onClick={() =>
                          handleIncreaseQuantity(item.product_id._id)
                        }
                        color="primary"
                      >
                        <Add />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      {formatCurrency(
                        item.product_id.price *
                          (1 - item.product_id.discountPercentage / 100) *
                          item.quantity,
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleRemoveItem(item.product_id._id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Card className="shadow-md rounded-lg p-4 mt-6">
            <CardContent>
              <Typography variant="h6">
                Tạm tính: <strong>{formatCurrency(totalPrice)}</strong>
              </Typography>
              <hr className="my-3 border-gray-300" />
              <Typography variant="h5" className="font-bold text-green-600">
                Thành tiền: {formatCurrency(totalPrice)}
              </Typography>
              <Button
                variant="contained"
                color="success"
                fullWidth
                className="mt-4 py-3"
                onClick={handleCheckout}
              >
                🏦 Thanh toán ngay
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Cart;