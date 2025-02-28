import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { clearLastOrder } from "../redux/slices/orderSlice";
import { formatCurrency } from "../utils/formatCurrency";
import { clearCart } from "../redux/slices/cartSlice";
const SuccessPayment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lastOrder = useSelector((state) => state.order.lastOrder?.newOrder);
  const [order, setOrder] = useState(null);

  console.log("order", order);

  useEffect(() => {
    if (!lastOrder) {
      toast.error("Không tìm thấy đơn hàng!");
      navigate("/");
      return;
    }
    setOrder(lastOrder);

    return () => {
      dispatch(clearLastOrder()); // Xóa đơn hàng sau khi hiển thị
      dispatch(clearCart());
    };
  }, [lastOrder, navigate, dispatch]);

  if (!order)
    return <p className="text-center">Đang tải thông tin đơn hàng...</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold">Thông tin đơn hàng</h2>
      <div className="border p-4 rounded-lg shadow-md mt-4">
        <p>
          Mã đơn hàng: <span className="font-bold">{order._id}</span>
        </p>
        <p>
          Trạng thái:{" "}
          <span className="font-bold">
            {order.order_status || "Chưa xác nhận"}
          </span>
        </p>
        <p>
          Tổng tiền:{" "}
          <span className="font-bold">{formatCurrency(order.totalPay)}</span>
        </p>
        <p>
          Ngày đặt:{" "}
          <span className="font-bold">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SuccessPayment;
