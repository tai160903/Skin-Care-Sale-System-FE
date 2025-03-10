import { useEffect, useState } from "react";
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
  CircularProgress,
  Box,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import allUserService from "../../services/adminService/allUserService";

const CustomerList = () => {
  const [customerList, setCustomerList] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await allUserService.getCustomers();
        console.log("Customer data:", response);
        const customers = Array.isArray(response.data) ? response.data : [];
        setCustomerList(customers);
        setFilteredCustomers(customers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);
    const filtered = customerList.filter(
      (customer) =>
        customer.name.toLowerCase().includes(value) ||
        customer.phone.includes(value)
    );
    setFilteredCustomers(filtered);
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        👥 Customer Management
      </Typography>
        </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: 3,
          paddingX: 2,
          boxShadow: 1,
          marginBottom: 3,
        }}
      >
        <SearchIcon sx={{ color: "gray", marginRight: 1 }} />
        <TextField
          fullWidth
          variant="standard"
          placeholder="Search by name or phone..."
          value={search}
          onChange={handleSearch}
          InputProps={{ disableUnderline: true }}
        />
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", marginTop: 5 }}>
          <CircularProgress />
        </Box>
      ) : filteredCustomers.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center", color: "gray" }}>
          No customers found.
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden" }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Avatar
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Phone
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Email
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer._id} hover>
                  <TableCell>
                    <Avatar src={customer.avatar} alt={customer.name} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                    {customer.name}
                  </TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell sx={{ color: "gray" }}>
                    {customer.email || "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default CustomerList;