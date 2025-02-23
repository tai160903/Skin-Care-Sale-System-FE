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
    <div className="container mx-auto p-6">
      <Typography
        variant="h5"
        className="text-center font-bold text-gray-800 mb-6"
      >
        🛒 Giỏ Hàng Của Bạn
      </Typography>

      {cartItems.length === 0 ? (
        <Typography className="text-center text-gray-600">
          🛍️ Giỏ hàng của bạn đang trống!
        </Typography>
      ) : (
        <TableContainer component={Paper} className="shadow-lg rounded-lg">
          <Table sx={{ minWidth: 650 }} aria-label="cart table">
            <TableHead>
              <TableRow>
                <TableCell>Hình ảnh</TableCell>
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
                    <img
                      src={item.product_id.image}
                      alt={item.product_id.name}
                      className="w-16 h-16 rounded-md"
                    />
                  </TableCell>
                  <TableCell>{item.product_id.name}</TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.product_id.price)}
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
                    {item.quantity}
                    <IconButton
                      onClick={() =>
                        handleIncreaseQuantity(item.product_id._id)
                      }
                      color="primary"
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
      <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-sm">
        <Typography variant="h6" className="text-gray-700">
          Tổng tiền:{" "}
          <strong>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalPrice)}
          </strong>
        </Typography>
        <Typography variant="h6" className="text-gray-700">
          Giảm giá:{" "}
          <strong>
            -
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(discount * totalPrice)}
          </strong>
        </Typography>
        <hr className="my-2 border-gray-300" />
        <Typography variant="h5" className="font-bold text-green-600">
          Thành tiền:{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(finalPrice)}
        </Typography>
      </div>
      <Link to="/checkout">
        <Button
          variant="contained"
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg"
        >
          🏦 Thanh toán ngay
        </Button>
      </Link>
    </div>
  );
};

export default Cart;
