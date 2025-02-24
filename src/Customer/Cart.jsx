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
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items) || [];
  const totalPrice = useSelector((state) => state.cart.total) || 0;
  const discount = useSelector((state) => state.cart.discount) || 0;
  const finalPrice = totalPrice * (1 - discount);

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Typography variant="h5" className="text-center font-bold text-gray-800 mb-6">
        🛒 Giỏ Hàng Của Bạn
      </Typography>

      {cartItems.length === 0 ? (
        <Typography className="text-center text-gray-600"> 🛍️ Giỏ hàng của bạn đang trống!</Typography>
      ) : (
        <TableContainer component={Paper} className="shadow-lg rounded-lg">
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>Sản phẩm</TableCell>
                <TableCell align="right">Giá</TableCell>
                <TableCell align="center">Số lượng</TableCell>
                <TableCell align="right">Tổng</TableCell>
                <TableCell align="center">Xóa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.product_id._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <img
                        src={item.product_id.image}
                        alt={item.product_id.name}
                        className="w-20 h-20 rounded-md object-cover"
                      />
                      <Typography variant="body1" className="font-medium">
                        {item.product_id.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.product_id.price)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleDecreaseQuantity(item.product_id._id)}
                      color="error"
                      size="small"
                    >
                      <Remove />
                    </IconButton>
                    <strong>{item.quantity}</strong>
                    <IconButton
                      onClick={() => handleIncreaseQuantity(item.product_id._id)}
                      color="primary"
                      size="small"
                    >
                      <Add />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.product_id.price * item.quantity)}
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
      )}

      {/* Tổng tiền */}
      {cartItems.length > 0 && (
        <Card className="mt-6 shadow-lg">
          <CardContent>
            <Typography variant="h6" className="text-gray-700">
              Tổng tiền: <strong>{totalPrice.toLocaleString("vi-VN")} VND</strong>
            </Typography>
            <Typography variant="h6" className="text-gray-700">
              Giảm giá: <strong>-{(discount * totalPrice).toLocaleString("vi-VN")} VND</strong>
            </Typography>
            <hr className="my-2 border-gray-300" />
            <Typography variant="h5" className="font-bold text-green-600">
              Thành tiền: {finalPrice.toLocaleString("vi-VN")} VND
            </Typography>
            <Link to="/checkout">
              <Button
                variant="contained"
                className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg"
              >
                🏦 Thanh toán ngay
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Cart;