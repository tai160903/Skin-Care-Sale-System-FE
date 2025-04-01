import { useEffect, useState } from "react";
import shipService from "../../services/adminService/shipService";
import { toast } from "react-toastify";
import {
  Box,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Menu,
  MenuItem,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";

const ShipManagement = () => {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [reason, setReason] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await shipService.getAllShippings({ page, limit: 10 });
      if (response.data?.data && Array.isArray(response.data.data)) {
        setShipments(response.data.data);
        setFilteredShipments(response.data.data); // Initialize with full data
        setTotalPages(response.data.totalPages);
      } else {
        setShipments([]);
        setFilteredShipments([]);
      }
    } catch (error) {
      console.error("Error fetching shipments:", error);
      toast.error("Failed to fetch shipments");
      setShipments([]);
      setFilteredShipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [page]);

  // Handle search when clicking the SearchIcon
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredShipments(shipments); // Reset to full list if query is empty
      return;
    }

    const filtered = shipments.filter((shipment) => {
      const orderIdMatch = shipment.order_id._id
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const phoneMatch = shipment.shipping_phone
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return orderIdMatch || phoneMatch;
    });
    setFilteredShipments(filtered);
  };

  const handleOpenStatusMenu = (event, shipment) => {
    setAnchorEl(event.currentTarget);
    setSelectedShipment(shipment);
  };

  const handleStatusChange = (status) => {
    setAnchorEl(null);
    if (status === "Cancelled") {
      setOpenDialog(true);
    } else {
      updateStatus(status);
    }
  };

  const updateStatus = async (status) => {
    if (!selectedShipment) return;
    try {
      const response = await shipService.updateStatus(
        selectedShipment._id,
        status,
      );
      console.log(response);
      if (response?.data) {
        toast.success("Cập nhật trạng thái thành công!");
        fetchShipments();
      } else if (response?.message) {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Không thể cập nhật trạng thái!");
    }
  };

  const updateShipmentStatus = async () => {
    if (!selectedShipment || !reason.trim()) return;
    try {
      const response = await shipService.updateShippingStatus(
        selectedShipment._id,
        reason,
      );
      if (response && response._id) {
        toast.success("Cập nhật trạng thái thành công!");
        fetchShipments();
        handleCloseDialog();
      } else {
        toast.error("Không thể cập nhật trạng thái!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Không thể cập nhật trạng thái!");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedShipment(null);
    setReason("");
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return { bgcolor: "#ffb300", color: "#fff" };
      case "Shipping":
        return { bgcolor: "#1976d2", color: "#fff" };
      case "Delivered":
        return { bgcolor: "#2e7d32", color: "#fff" };
      case "Cancelled":
        return { bgcolor: "#d32f2f", color: "#fff" };
      default:
        return { bgcolor: "#e0e0e0", color: "#000" };
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a237e" }}>
            📦 Shipment Management
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={fetchShipments}
            sx={{ borderRadius: 20, textTransform: "none" }}
          >
            Refresh
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="Search by Order ID or Phone"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearch}>
                  <SearchIcon color="primary" />
                </IconButton>
              ),
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </Box>

        {/* Table */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography color="text.secondary">Loading shipments...</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#1976d2" }}>
                  {[
                    "Order ID",
                    "Total Price",
                    "Shipping Address",
                    "Phone",
                    "Status",
                    "Created At",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        textAlign: "center",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment) => (
                    <TableRow
                      key={shipment._id}
                      hover
                      sx={{ "&:hover": { bgcolor: "#f5f5f5" } }}
                    >
                      <TableCell align="center">
                        {shipment.order_id._id}
                      </TableCell>
                      <TableCell align="center">
                        ${shipment.order_id.totalPay.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        {shipment.shipping_address}
                      </TableCell>
                      <TableCell align="center">
                        {shipment.shipping_phone}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Chip
                            label={
                              shipment.shipping_status === "Shipping"
                                ? "Đang Vận Chuyển"
                                : shipment.shipping_status === "Delivered"
                                  ? "Giao Thành Công"
                                  : shipment.shipping_status === "Cancelled"
                                    ? "Giao Hàng Thất Bại"
                                    : shipment.shipping_status
                            }
                            sx={{
                              ...getStatusStyles(shipment.shipping_status),
                              fontWeight: 500,
                              minWidth: 120,
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => handleOpenStatusMenu(e, shipment)}
                          >
                            <ArrowDropDownIcon />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={
                              Boolean(anchorEl) &&
                              selectedShipment?._id === shipment._id
                            }
                            onClose={() => setAnchorEl(null)}
                          >
                            <MenuItem
                              onClick={() => handleStatusChange("Shipping")}
                            >
                              Đang Vận Chuyển
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleStatusChange("Delivered")}
                            >
                              Giao Thành Công
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleStatusChange("Cancelled")}
                            >
                              Giao Hàng Thất Bại
                            </MenuItem>
                          </Menu>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {new Date(shipment.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ py: 4, color: "#757575" }}
                    >
                      No shipments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}

        {/* Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{ bgcolor: "#1976d2", color: "#fff", fontWeight: 600 }}
          >
            Update Shipment Status
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              label="Reason for Cancellation"
              fullWidth
              multiline
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              variant="outlined"
              placeholder="Enter reason if cancelling..."
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={updateShipmentStatus}
              color="primary"
              variant="contained"
              disabled={
                !reason.trim() &&
                selectedShipment?.shipping_status === "Cancelled"
              }
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default ShipManagement;
