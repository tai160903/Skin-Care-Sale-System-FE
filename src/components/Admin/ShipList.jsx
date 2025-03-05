import { useEffect, useState } from "react";
import shipService from "../../services/adminService/shipService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Box,
  Button,
} from "@mui/material";

const ShipList = () => {
  const [shippings, setShippings] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredShippings, setFilteredShippings] = useState([]);

  useEffect(() => {
    fetchShippings();
  }, []);

  const fetchShippings = async () => {
    try {
      const data = await shipService.getAllShippings();
      setShippings(data);
      setFilteredShippings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    let filtered = shippings;
    if (searchId) {
      filtered = filtered.filter((ship) => ship._id.includes(searchId));
    }
    if (startDate && endDate) {
      filtered = filtered.filter((ship) => {
        const purchaseDate = new Date(ship.createdAt);
        return (
          purchaseDate >= new Date(startDate) &&
          purchaseDate <= new Date(endDate)
        );
      });
    }
    setFilteredShippings(filtered);
  };

  return (
    <Paper
      sx={{
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        maxWidth: "90%",
        margin: "auto",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", marginBottom: 2, color: "#1976d2" }}
      >
        Đơn hàng
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          marginBottom: 2,
          justifyContent: "center",
        }}
      >
        <TextField
          label="Search by ID"
          variant="outlined"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Shipping Address
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Purchase Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredShippings.map((ship) => (
              <TableRow
                key={ship._id}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
              >
                <TableCell>{ship._id}</TableCell>
                <TableCell>{ship.order_id}</TableCell>
                <TableCell>{ship.shipping_address}</TableCell>
                <TableCell>{ship.shipping_phone}</TableCell>
                <TableCell>
                  {new Date(ship.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{ship.reason || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ShipList;
