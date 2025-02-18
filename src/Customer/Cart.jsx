import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { useSelector } from "react-redux";
import cartService from "../services/cartService";


const Cart = () => {
  const userId = useSelector((state) => state.user.user._id); // Get user ID from Redux
  console.log(userId);
  const [cartItems, setCartItems] = useState([]);

// function Cart({ customerId }) {
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     setLoading(true);
//     try {
//       const response = await cartService.getCart(customerId);
//       setCart(response.data);
//     } catch (error) {
//       console.error("Lỗi khi lấy giỏ hàng:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemove = async (productId) => {
//     try {
//       await cartService.removeItem(customerId, productId);
//       toast.info("🛒 Đã xóa sản phẩm khỏi giỏ hàng");
//       fetchCart();
//     } catch (error) {
//       console.error("Lỗi khi xóa sản phẩm:", error);
//     }
//   };


  useEffect(() => {
    const fetchCartItems = async () => {
      const response = await cartService.getCart(userId);
      console.log("Cart items:", response.data);
      setCartItems(response.data);
    };
    fetchCartItems();
  }, [userId]);

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      <Grid container spacing={4}>
        {cartItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.name}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Typography variant="body1" color="primary" mt={1}>
                  ${item.price}
                </Typography>
              </CardContent>
              <div className="p-2 flex justify-between">
                <Button variant="contained" color="primary">
                  Checkout
                </Button>
                <Button variant="outlined" color="error">
                  Remove
                </Button>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Cart;
