import { useEffect, useState } from "react";
import shipService from "../../services/adminService/shipService";
import { toast } from "react-toastify";
import { Box, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

const ShipManagement = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State quản lý Dialog cập nhật trạng thái
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [reason, setReason] = useState("");

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

  const updateShipmentStatus = async () => {
    if (!selectedShipment) return;
  
    try {
      const response = await shipService.updateShippingStatus(selectedShipment._id, reason);
      console.log("Update response:", response); 
  
      if (response && response._id) {
        toast.success("Cập nhật trạng thái thành công!");
        fetchShipments();
        handleCloseDialog();
      } else {
        toast.error("Không thể cập nhật trạng thái! Kiểm tra lại API.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Không thể cập nhật trạng thái!");
    }
  };
  

  // Mở dialog
  const handleOpenDialog = (shipment) => {
    setSelectedShipment(shipment);
    setReason("");
    setOpenDialog(true);
  };

  // Đóng dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedShipment(null);
    setReason("");
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
                      <span
                        className={`px-3 py-1 rounded text-white ${getStatusColor(shipment.shipping_status)}`}
                      >
                        {shipment.shipping_status}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleOpenDialog(shipment)}
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

      {/* Dialog nhập lý do */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Xác nhận cập nhật trạng thái</DialogTitle>
        <DialogContent>
          <TextField
            label="Lý do Hủy"
            fullWidth
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            variant="outlined"
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={updateShipmentStatus}
            color="primary"
            disabled={!reason.trim()}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShipManagement;
