import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../redux/slices/orderSlice.js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { FaMoneyBill1Wave, FaPaypal } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency.js";

const DraftOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user.customer);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const totalAmount = cart.reduce((sum, item) => {
    const originalPrice = Number(item.product_id?.price) || 0;
    const discountRate = Number(item.product_id?.purchaseCount) || 0;
    const discountedPrice = originalPrice * (1 - discountRate / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  const handleOrder = async (paymentType) => {
    if (!address || !phone) {
      toast.error("Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }

    const orderData = {
      customer: user._id,
      cart,
      totalAmount,
      address,
      phone,
      paymentMethod,
      status: "pending",
    };

    try {
      await dispatch(createOrder(orderData)).unwrap();
      toast.success("Đơn hàng đã được tạo thành công!");
      if (paymentType === "cash") {
        navigate("/success");
      }
    } catch (error) {
      toast.error("Lỗi khi tạo đơn hàng!", error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-center mb-6">Xác nhận đơn hàng</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Giỏ hàng */}
        <div className="border p-4 rounded-lg shadow-md bg-white">
          <h3 className="font-semibold mb-3">Giỏ hàng của bạn</h3>
          <div className="space-y-2">
            {cart.map((item) => {
              const originalPrice = Number(item.product_id?.price) || 0;
              const discountRate = Number(item.product_id?.purchaseCount) || 0;
              const discountedPrice = originalPrice * (1 - discountRate / 100);

              return (
                <div key={item.product_id._id} className="flex justify-between">
                  <span>
                    {item.product_id.name} (x{item.quantity})
                  </span>
                  <span>{formatCurrency(discountedPrice * item.quantity)}</span>
                </div>
              );
            })}
          </div>
          <p className="font-bold mt-3 text-right text-lg">
            Tổng tiền: {formatCurrency(totalAmount)}
          </p>
        </div>

        {/* Thông tin khách hàng */}
        <div className="border p-4 rounded-lg shadow-md bg-white">
          <h3 className="font-semibold mb-3">Thông tin khách hàng</h3>
          <input
            type="text"
            placeholder="Địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 w-full rounded-md mb-2"
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="mt-6 border p-4 rounded-lg shadow-md bg-white">
        <h3 className="font-semibold mb-3">Phương thức thanh toán</h3>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="ml-2 flex items-center gap-2">
              <FaMoneyBill1Wave className="text-green-500" /> Tiền mặt
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="ml-2 flex items-center gap-2">
              <FaPaypal className="text-blue-500" /> PayPal
            </span>
          </label>
        </div>
      </div>

      {/* Nút đặt hàng */}
      <div className="mt-6 flex justify-center">
        {paymentMethod === "paypal" ? (
          <PayPalScriptProvider options={{ "client-id": "your-client-id" }}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: { value: totalAmount.toFixed(0) },
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(() => {
                  handleOrder("paypal");
                });
              }}
            />
          </PayPalScriptProvider>
        ) : (
          <button
            onClick={() => handleOrder("cash")}
            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Xác nhận đặt hàng
          </button>
        )}
      </div>
    </div>
  );
};

export default DraftOrder;
