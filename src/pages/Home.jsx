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
import UploadImage from "../components/UploadImage";
import { login } from "../redux/slices/userSlice";

function Home() {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.user.customer);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");
    const user = urlParams.get("user")
      ? JSON.parse(urlParams.get("user"))
      : null;
    const customer = urlParams.get("customer")
      ? JSON.parse(urlParams.get("customer"))
      : null;

    if (token && user) {
      dispatch(
        login({
          user: {
            id: user?._doc?._id,
            email: user?._doc?.email,
            role: user?._doc?.role,
          },
          token,
          customer: customer?._doc,
        }),
      );
    }

    setTimeout(() => {
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 1000);
  }, [dispatch]);

  console.log("customer", customer);
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
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ mb: 10 }}>
          <TopProduct />
        </Box>

        <Box sx={{ mb: 5 }}>
          <Category />
        </Box>
        <Box sx={{ mb: 5 }}>
          <ListProduct />
        </Box>
        <Box sx={{ mb: 6 }}>
          <Blog />
        </Box>
        <div>
          <h2>Upload Ảnh với Supabase Storage</h2>
          <UploadImage />
        </div>
      </Container>
    </Box>
  );
}

export default Home;
