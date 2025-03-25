import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Box,
  IconButton,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  People,
  VerifiedUser,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import userService from "../../services/userService";

const User = () => {
  const [users, setUsers] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const customers = await userService.getCustomers();
        const staffs = await userService.getStaffs();
        setUsers([...customers, ...staffs]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleCreateEmployee = async () => {
    try {
      const response = await userService.createEmployee(newEmployee);
      setUsers([...users, response]);
      setSnackbarMessage("Employee created successfully!");
      setSnackbarSeverity("success");
      setNewEmployee({ email: "", password: "" });
    } catch (error) {
      setSnackbarMessage("Error creating employee!");
      setSnackbarSeverity("error");
      setNewEmployee({ email: "", password: "" });
    }
    setOpenSnackbar(true);
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          color="primary"
          gutterBottom
        >
          User Management
        </Typography>
      </motion.div>

      {/* User List */}
      <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            <People sx={{ mr: 1, color: "#1565c0" }} /> User List
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Email sx={{ mr: 1, color: "#1565c0" }} /> {user.email}
                    </TableCell>
                    <TableCell>
                      <Person sx={{ mr: 1, color: "#2e7d32" }} /> {user.role}
                    </TableCell>
                    <TableCell>
                      {user.isBanned ? (
                        <Tooltip title="Banned">
                          <Typography color="error">Banned</Typography>
                        </Tooltip>
                      ) : user.isVerify ? (
                        <Tooltip title="Verified">
                          <VerifiedUser sx={{ color: "green" }} />
                        </Tooltip>
                      ) : (
                        "Not Verified"
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* Add Employee Form */}
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            align="center"
            sx={{ mb: 2 }}
          >
            Add New Employee
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxWidth: 400,
              mx: "auto",
            }}
          >
            <TextField
              label="Email"
              name="email"
              value={newEmployee.email}
              onChange={handleInputChange}
              fullWidth
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: "#1565c0" }} />,
              }}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={newEmployee.password}
              onChange={handleInputChange}
              fullWidth
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: "#1565c0" }} />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1565c0",
                color: "white",
                "&:hover": { backgroundColor: "#0d47a1" },
              }}
              onClick={handleCreateEmployee}
              startIcon={<Add />}
            >
              Add Employee
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setOpenSnackbar(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default User;
