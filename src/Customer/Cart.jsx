import { useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items) || [];
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum +
      item.product_id.price *
        (1 - item.product_id.purchaseCount / 100) *
        item.quantity,
    0,
  );
  const customerId = useSelector((state) => state.user.customer._id);

  const [coupon, setCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleApplyCoupon = () => {
    if (coupon === "SALE10") {
      setDiscountAmount(totalPrice * 0.1);
      toast.success("Áp dụng mã giảm giá thành công! Giảm 10%.");
    } else {
      setDiscountAmount(0);
      toast.error("Mã giảm giá không hợp lệ!");
    }
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleRemoveItem = async (productId) => {
    if (
      window.confirm(
        "Do you really want to remove this product from your cart?",
      )
    ) {
      try {
        const response = await cartService.removeItem(customerId, productId);
        dispatch(removeFromCart(productId));
        toast.success(response.data.message);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
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
          <Table sx={{ minWidth: 650 }}>
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
                  <TableCell align="center">
                    {formatCurrency(
                      item.product_id.price *
                        (1 - item.product_id.purchaseCount / 100),
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() =>
                        handleDecreaseQuantity(item.product_id._id)
                      }
                      color="error"
                      size="small"
                    >
                      <Remove />
                    </IconButton>
                    <strong>{item.quantity}</strong>
                    <IconButton
                      onClick={() =>
                        handleIncreaseQuantity(item.product_id._id)
                      }
                      color="primary"
                      size="small"
                    >
                      <Add />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    {formatCurrency(
                      item.product_id.price *
                        (1 - item.product_id.purchaseCount / 100) *
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
      )}

      {cartItems.length > 0 && (
        <Card className="mt-6 shadow-lg">
          <CardContent>
            <Typography variant="h6" className="text-gray-700">
              Tổng tiền: <strong>{formatCurrency(totalPrice)}</strong>
            </Typography>
            <div className="flex mt-2">
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                className="p-2 border rounded-l-lg w-full"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600"
                onClick={handleApplyCoupon}
              >
                Áp dụng
              </button>
            </div>
            <Typography variant="h6" className="text-gray-700 mt-3">
              Giảm giá: <strong>{formatCurrency(discountAmount)}</strong>
            </Typography>

            <hr className="my-2 border-gray-300" />
            <Typography variant="h5" className="font-bold text-green-600">
              Thành tiền: {formatCurrency(totalPrice - discountAmount)}
            </Typography>
            <Link to="/checkout">
              <Button
                variant="contained"
                className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg"
                onClick={handleCheckout}
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
