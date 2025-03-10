import { useEffect, useState } from "react";
import { getAllShipments } from "../../services/adminService/shipService";
import { toast } from "react-toastify";

const ShipManagement = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await getAllShipments();
      console.log("Shipments Data:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setShipments(response.data);
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
                <th className="p-3 text-left">Shipping Fee</th>
                <th className="p-3 text-left">Order Status</th>
                <th className="p-3 text-left">Payment Method</th>
                <th className="p-3 text-left">Shipping Address</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Shipping Status</th>
                <th className="p-3 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {shipments.length > 0 ? (
                shipments.map((shipment) => (
                  <tr
                    key={shipment._id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-3">{shipment.order_id}</td>
                    <td className="p-3">${shipment.totalPrice.toFixed(2)}</td>
                    <td className="p-3">${shipment.shipping_fee.toFixed(2)}</td>
                    <td className="p-3">{shipment.order_status}</td>
                    <td className="p-3">{shipment.payment_method}</td>
                    <td className="p-3">{shipment.shipping_address}</td>
                    <td className="p-3">{shipment.shipping_phone}</td>
                    <td className="p-3">{shipment.shipping_status}</td>
                    <td className="p-3">
                      {new Date(shipment.createdAt).toLocaleDateString()}
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
    </div>
  );
};

export default ShipManagement;
