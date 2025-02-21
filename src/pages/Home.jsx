import ListProduct from "../Customer/ListtProduct";
import FilterProduct from "../Customer/FilterProduct";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import cartService from "../services/cartService";
import { setCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";

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
    <>
      <div className="flex">
        {/* Sidebar bên trái */}
        <FilterProduct />

        {/* Danh sách sản phẩm */}
        <div className="flex-1 p-6">
          <ListProduct />
        </div>
      </div>
    </>
  );
}

export default Home;
