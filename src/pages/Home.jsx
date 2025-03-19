import ListProduct from "../Customer/ListtProduct";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import cartService from "../services/cartService";
import { setCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import TopProduct from "../Customer/TopProduct";
import Category from "../Customer/Category";
import BlogList from "../Customer/BlogList";
import { Container, Box } from "@mui/material";
import Adv from "../components/Header/Adv";
import { login } from "../redux/slices/userSlice";

function Home() {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.user.customer);
  const [isFetched, setIsFetched] = useState(false);

  // Xử lý login từ URL nếu có token
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
    <>
      <Box>
        <Adv />
      </Box>

      <Category />

      <Container>
        <Box sx={{ mb: 7 }}>
          <TopProduct />
        </Box>

        <Box sx={{ mb: 7 }}>
          <ListProduct />
        </Box>

        <Box sx={{ mb: 7 }}>
          <BlogList />
        </Box>
      </Container>
    </>
  );
}

export default Home;
