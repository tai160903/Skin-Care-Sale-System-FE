import ListProduct from "../Customer/ListtProduct";
import FilterProduct from "../Customer/FilterProduct";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import cartService from "../services/cartService";
import { setCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import TopProduct from "../Customer/TopProduct";
function Home() {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.user.customer);
  const [isFetched, setIsFetched] = useState(false);
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
          setIsFetched(true); // Prevent multiple fetches
        } catch (error) {
          toast.error(`Lỗi khi lấy giỏ hàng: ${error.message || error}`);
        }
      }
    };

    fetchCart();
  }, [customer, isFetched, dispatch]);

  return (
    <>
      <TopProduct />
      <div className="flex">
        <FilterProduct />

        <div className="flex-1 p-6">
          <ListProduct />
        </div>
      </div>
    </>
  );
}

export default Home;
