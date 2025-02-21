import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../redux/slices/orderSlice.js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const DraftOrder = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.info);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product_id.price * item.quantity,
    0,
  );

  const handleOrder = () => {
    const orderData = {
      customer: user._id,
      cart,
      totalAmount,
      address,
      phone,
      paymentMethod,
      status: "pending",
    };
    dispatch(createOrder(orderData));
    alert("Đơn hàng đã được tạo thành công!");
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold">Xác nhận đơn hàng</h2>
      <div className="border p-4 rounded-lg shadow-md mt-4">
        <h3 className="font-semibold">Giỏ hàng của bạn</h3>
        {cart.map((item) => (
          <div key={item.product_id._id} className="flex justify-between">
            <span>
              {item.product_id.name} (x{item.quantity})
            </span>
            <span>{item.product_id.price * item.quantity} VND</span>
          </div>
        ))}
        <p className="font-bold">Tổng tiền: {totalAmount} VND</p>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Thông tin khách hàng</h3>
        <input
          type="text"
          placeholder="Địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 w-full mt-2"
        />
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Phương thức thanh toán</h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="cash">Tiền mặt</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>
      {paymentMethod === "paypal" && (
        <PayPalScriptProvider options={{ "client-id": "your-client-id" }}>
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: { value: totalAmount.toFixed(2) },
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then(() => {
                handleOrder();
              });
            }}
          />
        </PayPalScriptProvider>
      )}
      {paymentMethod === "cash" && (
        <button
          onClick={handleOrder}
          className="bg-green-500 text-white p-2 mt-4"
        >
          Xác nhận đặt hàng
        </button>
      )}
    </div>
  );
};

export default DraftOrder;
