import { useEffect, useState } from "react";
import {
  Box,
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
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import allUserService from "../../services/adminService/alluserService";

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await allUserService.getStaff();
        console.log("Staff data:", response);
        const staffData = Array.isArray(response.data) ? response.data : [];
        setStaffList(staffData);
        setFilteredStaff(staffData);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);
    const filtered = staffList.filter(
      (staff) =>
        staff.email.toLowerCase().includes(value) ||
        staff.role.toLowerCase().includes(value),
    );
    setFilteredStaff(filtered);
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          👨‍💼 Staff Management
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
          placeholder="Search by email or role..."
          value={search}
          onChange={handleSearch}
          InputProps={{ disableUnderline: true }}
        />
      </Box>
      {loading ? (
        <Box sx={{ textAlign: "center", marginTop: 5 }}>
          <CircularProgress />
        </Box>
      ) : filteredStaff.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center", color: "gray" }}>
          No staff found.
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
                  Full Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Role
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff._id} hover>
                  <TableCell>
                    <Avatar src={staff.avatar} alt={staff.fullName} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                    {staff.fullName || "N/A"}
                  </TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    {staff.role}
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

export default StaffList;
