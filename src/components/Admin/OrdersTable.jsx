import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Button,
} from "@mui/material";
import {
  Search,
  CheckCircle,
  LocalShipping,
  HourglassEmpty,
} from "@mui/icons-material";

const orders = [
  { id: 1, customer: "Nguyễn Văn A", total: "$200", status: "Đã giao" },
  { id: 2, customer: "Trần Thị B", total: "$150", status: "Chờ xử lý" },
  { id: 3, customer: "Lê Văn C", total: "$300", status: "Đang vận chuyển" },
  { id: 4, customer: "Hoàng Minh D", total: "$120", status: "Đã giao" },
  { id: 5, customer: "Phạm Thị E", total: "$180", status: "Chờ xử lý" },
];

const statusIcons = {
  "Đã giao": <CheckCircle sx={{ color: "green" }} />,
  "Đang vận chuyển": <LocalShipping sx={{ color: "blue" }} />,
  "Chờ xử lý": <HourglassEmpty sx={{ color: "orange" }} />,
};

const OrdersTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const handleSearch = () => {
    setSearch(searchQuery);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.customer.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus === "" || order.status === filterStatus),
  );

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      {/* Search & Filter Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          gap: "10px",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm khách hàng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ whiteSpace: "nowrap" }}
        >
          Tìm kiếm
        </Button>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          displayEmpty
          sx={{ width: "30%" }}
        >
          <MenuItem value="">Tất cả trạng thái</MenuItem>
          <MenuItem value="Chờ xử lý">Chờ xử lý</MenuItem>
          <MenuItem value="Đang vận chuyển">Đang vận chuyển</MenuItem>
          <MenuItem value="Đã giao">Đã giao</MenuItem>
        </Select>
      </div>

      {/* Orders Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Khách Hàng</TableCell>
              <TableCell>Tổng Tiền</TableCell>
              <TableCell>Trạng Thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    {statusIcons[order.status]} {order.status}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Không tìm thấy đơn hàng phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrdersTable;
