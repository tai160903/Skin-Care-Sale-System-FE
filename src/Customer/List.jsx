import ListProduct from "../Customer/ListtProduct";
import FilterProduct from "../Customer/FilterProduct";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import cartService from "../services/cartService";
import { setCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import TopProduct from "../Customer/TopProduct";
import Category from "../Customer/Category";
import { Container, Grid, Box } from "@mui/material";

function Home() {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.user.customer);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchCart = async () => {
      if (customer && cartItems.length === 0) {
        try {
          const response = await cartService.getCart(customer._id);
          dispatch(
            setCart({
              items: response.data.items,
              total: response.data.total,
              discount: response.data.discount,
            }),
          );
        } catch (error) {
          toast.error("Lỗi khi lấy giỏ hàng:", error);
        }
      }
    };

    fetchCart();
  }, [customer, cartItems, dispatch]);

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      {/* Top sản phẩm */}
      <Box sx={{ mb: 3 }}>
        <TopProduct />
      </Box>

      {/* Danh mục sản phẩm */}
      <Box sx={{ mb: 3 }}>
        <Category />
      </Box>

      {/* Bố cục trang chính */}
      <Grid container spacing={3}>
        {/* Sidebar bộ lọc */}
        <Grid item xs={12} md={3}>
          <FilterProduct />
        </Grid>

        {/* Danh sách sản phẩm */}
        <Grid item xs={12} md={9}>
          <ListProduct />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
