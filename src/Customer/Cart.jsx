import { useEffect, useState } from "react";
import cartService from "../services/cartService";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

function Cart({ customerId }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartService.getCart(customerId);
      setCart(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await cartService.removeItem(customerId, productId);
      toast.info("🛒 Đã xóa sản phẩm khỏi giỏ hàng");
      fetchCart();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await cartService.clearCart(customerId);
      toast.warning("🛒 Giỏ hàng đã được làm trống");
      setCart([]);
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng:", error);
    }
  };

  if (loading) return <p>Đang tải giỏ hàng...</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Giỏ hàng của bạn</h2>
      {!cart.length ? (
        <p className="text-gray-500">🛒 Giỏ hàng trống!</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center border-b py-2"
            >
              <p className="text-lg">🛍 {item.productName}</p>
              <p className="text-gray-500">Số lượng: {item.quantity}</p>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemove(item.productId)}
              >
                Xóa
              </Button>
            </div>
          ))}
          <Button
            variant="contained"
            color="error"
            className="mt-4"
            onClick={handleClearCart}
          >
            Xóa toàn bộ giỏ hàng
          </Button>
        </div>
      )}
    </div>
  );
}

export default Cart;
