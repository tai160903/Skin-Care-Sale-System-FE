import { useEffect, useState } from "react";
import shipService from "../../services/adminService/shipService";
import { toast } from "react-toastify";
import { Box, Pagination } from "@mui/material";

const ShipManagement = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);



  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Shipping":
        return "bg-blue-500";
      case "Delivered":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-200";
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [page]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await shipService.getAllShippings({ page, limit: 10 });
      console.log("Shipments Data:", response?.data?.data);

      if (response.data?.data && Array.isArray(response.data.data)) {
        setShipments(response.data.data);
        setTotalPages(response.data.totalPages);
      } else {
        setShipments([]);
      }
    } catch (error) {
      console.error("Error fetching shipments:", error);
      toast.error("Failed to fetch shipments");
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  const updateShipmentStatus = async (id, newStatus) => {
    try {
      const response = await shipService.updateShippingStatus(id, newStatus);
      if (response.status === 200) {
        toast.success("Cập nhật trạng thái thành công!");
        fetchShipments(); // Làm mới danh sách sau khi cập nhật
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Không thể cập nhật trạng thái!");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Shipment Management
        </h1>
        <button
          onClick={fetchShipments}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Refresh Shipments
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading shipments...</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Total Price</th>
                <th className="p-3 text-left">Shipping Address</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Shipping Status</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.length > 0 ? (
                shipments.map((shipment) => (
                  <tr
                    key={shipment._id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-3">{shipment.order_id._id}</td>
                    <td className="p-3">
                      ${shipment.order_id.totalPay.toFixed(2)}
                    </td>
                    <td className="p-3">{shipment.shipping_address}</td>
                    <td className="p-3">{shipment.shipping_phone}</td>
                    <td className="p-3 flex items-center gap-2">
                      {/* Hiển thị trạng thái với màu sắc */}
                      <span className={`px-3 py-1 rounded text-white ${getStatusColor(shipment.shipping_status)}`}>
                        {shipment.shipping_status}
                      </span>

                      {/* Wrapper chứa dropdown */}
                      <div className="relative">
                        {/* Select ẩn nhưng vẫn hoạt động */}
                        <select
                          value={shipment.shipping_status}
                          onChange={(e) => updateShipmentStatus(shipment._id, e.target.value)}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        >
                          {["Shipping", "Delivered"].map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        {/* Mũi tên dropdown */}
                        <span className="px-2 py-1 border rounded bg-gray-200 cursor-pointer">
                          ▼
                        </span>
                      </div>
                    </td>

                  
                    <td className="p-3">
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          updateShipmentStatus(shipment._id, "Cancelled")
                        }
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                        CẬP NHẬT
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center p-3 text-gray-500">
                    No shipments available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </div>
  );
};

export default ShipManagement;
