import { useEffect, useState } from "react";
import shipFeeService from "../../services/adminService/shipfeeService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Typography,
} from "@mui/material";

const ShipFee = () => {
  const [shipFees, setShipFees] = useState([]);
  const [location, setLocation] = useState("");
  const [shiping_price, setPrice] = useState("");

  useEffect(() => {
    fetchShipFees();
  }, []);

  const fetchShipFees = async () => {
    const data = await shipFeeService.getAllShipFees();
    setShipFees(data);
  };

  const handleCreate = async () => {
    await shipFeeService.createShipFee({ location, shiping_price });
    setPrice("");
    setLocation("");
  };

  const handleDelete = async (id) => {
    await shipFeeService.deleteShipFee(id);
    fetchShipFees();
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
        Giá Ship
      </Typography>
      <TextField
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        sx={{ marginRight: 2 }}
      />
      <TextField
        label="Price"
        type="number"
        value={shiping_price}
        onChange={(e) => setPrice(e.target.value)}
        sx={{ marginRight: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleCreate}>
        Add Ship Fee
      </Button>
      <TableContainer sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipFees.map((fee) => (
              <TableRow
                key={fee._id}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
              >
                <TableCell>{fee._id}</TableCell>
                <TableCell>{fee.location}</TableCell>
                <TableCell>{fee.shiping_price}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(fee._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ShipFee;
