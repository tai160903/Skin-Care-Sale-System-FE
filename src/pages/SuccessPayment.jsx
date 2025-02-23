import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import productService from "../services/productService";
import { toast } from "react-toastify";

const SuccessPayment = () => {
  const { id } = useParams();
  const [order, setOrder] = useState({});

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await productService.getOrderById(id);
        setOrder(response.data);
      } catch (error) {
        toast.error("Không thể lấy thông tin đơn hàng!", error);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold">Thông tin đơn hàng</h2>
      <div className="border p-4 rounded-lg shadow-md mt-4">
        <p>
          Mã đơn hàng: <span className="font-bold">{order?._id}</span>
        </p>
        <p>
          Trạng thái:{" "}
          <span className="font-bold">{order?.status || "Chưa xác nhận"}</span>
        </p>
        <p>
          Tổng tiền:{" "}
          <span className="font-bold">
            {order?.totalAmount?.toLocaleString("vi-VN")} VND
          </span>
        </p>
        <p>
          Ngày đặt:{" "}
          <span className="font-bold">
            {order?.createdAt
              ? new Date(order?.createdAt).toLocaleString("vi-VN")
              : ""}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SuccessPayment;
