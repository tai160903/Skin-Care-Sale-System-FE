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
  Avatar,
} from "@mui/material";
import { Search } from "@mui/icons-material";

// Dữ liệu khách hàng
const customers = [
  { id: 1, name: "Nguyễn Văn A", phone: "0912345678", email: "a@example.com" },
  { id: 2, name: "Trần Thị B", phone: "0912345679", email: "b@example.com" },
  { id: 3, name: "Lê Minh C", phone: "0912345680", email: "c@example.com" },
  { id: 4, name: "Phạm Văn D", phone: "0912345681", email: "d@example.com" },
  { id: 5, name: "Vũ Thị E", phone: "0912345682", email: "e@example.com" },
  { id: 6, name: "Hoàng Văn F", phone: "0912345683", email: "f@example.com" },
  { id: 7, name: "Nguyễn Thị G", phone: "0912345684", email: "g@example.com" },
  { id: 8, name: "Trần Minh H", phone: "0912345685", email: "h@example.com" },
  { id: 9, name: "Lê Thị I", phone: "0912345686", email: "i@example.com" },
  { id: 10, name: "Phạm Minh J", phone: "0912345687", email: "j@example.com" },
  { id: 11, name: "Vũ Thị K", phone: "0912345688", email: "k@example.com" },
  { id: 12, name: "Hoàng Minh L", phone: "0912345689", email: "l@example.com" },
  { id: 13, name: "Nguyễn Văn M", phone: "0912345690", email: "m@example.com" },
  { id: 14, name: "Trần Thị N", phone: "0912345691", email: "n@example.com" },
  { id: 15, name: "Lê Minh O", phone: "0912345692", email: "o@example.com" },
  { id: 16, name: "Phạm Văn P", phone: "0912345693", email: "p@example.com" },
  { id: 17, name: "Vũ Thị Q", phone: "0912345694", email: "q@example.com" },
  { id: 18, name: "Hoàng Văn R", phone: "0912345695", email: "r@example.com" },
  { id: 19, name: "Nguyễn Thị S", phone: "0912345696", email: "s@example.com" },
  { id: 20, name: "Trần Minh T", phone: "0912345697", email: "t@example.com" },
];

const CustomerList = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Lưu input
  const [search, setSearch] = useState(""); // Chỉ cập nhật khi nhấn tìm kiếm
  const [filterLetter, setFilterLetter] = useState("");

  const handleSearch = () => {
    setSearch(searchQuery);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterLetter === "" || customer.name.startsWith(filterLetter)),
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
          value={filterLetter}
          onChange={(e) => setFilterLetter(e.target.value)}
          displayEmpty
          sx={{ width: "30%" }}
        >
          <MenuItem value="">Tất cả chữ cái</MenuItem>
          {[..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((letter) => (
            <MenuItem key={letter} value={letter}>
              {letter}
            </MenuItem>
          ))}
        </Select>
      </div>

      {/* Customers Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Khách Hàng</TableCell>
              <TableCell>Số Điện Thoại</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Avatar>{customer.name.charAt(0)}</Avatar>
                      {customer.name}
                    </div>
                  </TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Không tìm thấy khách hàng phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CustomerList;
