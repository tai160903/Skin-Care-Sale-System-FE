import ListProduct from "../Customer/ListtProduct";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import cartService from "../services/cartService";
import { setCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import TopProduct from "../Customer/TopProduct";
import Category from "../Customer/Category";
import Blog from "../components/Header/Blog";
import { Container, Box } from "@mui/material";
import Adv from "../components/Header/Adv";

function Home() {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.user.customer);
  const [isFetched, setIsFetched] = useState(false);

  console.log(import.meta.env.VITE_PAYPAL_CLIENT_ID);

  useEffect(() => {
    const fetchCart = async () => {
      if (customer && !isFetched) {
        try {
          const response = await cartService.getCart(customer._id);
          dispatch(
            setCart({
              items: response.data.items,
              total: response.data.total,
              discount: response.data.discount,
            }),
          );
          setIsFetched(true);
        } catch (error) {
          toast.error(`Lỗi khi lấy giỏ hàng: ${error.message || error}`);
        }
      }
    };

    fetchCart();
  }, [customer, isFetched, dispatch]);

  return (
    <Box>
      <Adv />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {/* Top sản phẩm */}
        <Box sx={{ mb: 3 }}>
          <TopProduct />
        </Box>

        {/* Danh mục sản phẩm */}
        <Box sx={{ mb: 3 }}>
          <Category />
        </Box>

        {/* Danh sách sản phẩm */}
        <Box sx={{ mb: 3 }}>
          <ListProduct />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Blog />
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
