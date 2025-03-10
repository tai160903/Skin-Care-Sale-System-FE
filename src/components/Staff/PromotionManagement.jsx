import { useEffect, useState } from "react";
import { getPromotion } from "../../services/adminService/promoService";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await getPromotion();
      if (Array.isArray(response)) {
        setPromotions(response);
      } else {
        setPromotions([]);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast.error("Failed to fetch promotions");
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPromotions = promotions.filter((promo) => {
    const promoStartDate = new Date(promo.start_date);
    const promoEndDate = new Date(promo.end_date);
    
    const matchesStartDate = startDate ? promoStartDate.toLocaleDateString() === startDate.toDate().toLocaleDateString() : true;
    const matchesEndDate = endDate ? promoEndDate.toLocaleDateString() === endDate.toDate().toLocaleDateString() : true;
    const matchesName = searchName ? promo.name.toLowerCase().includes(searchName.toLowerCase()) : true;

    return matchesStartDate && matchesEndDate && matchesName;
  });

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          🎉 Promotion Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={fetchPromotions}
        >
          Refresh Promotions
        </Button>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
            label="Search by Name"
            variant="outlined"
            fullWidth
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
          />
        </Box>
      </LocalizationProvider>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#1976d2" }}>
                {["Name", "Code", "Description", "Discount (%)", "Start Date", "End Date", "Status"].map((header) => (
                  <TableCell key={header} sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPromotions.length > 0 ? (
                filteredPromotions.map((promo) => (
                  <TableRow key={promo._id}>
                    <TableCell align="center">{promo.name}</TableCell>
                    <TableCell align="center">{promo.code}</TableCell>
                    <TableCell align="center">{promo.description}</TableCell>
                    <TableCell align="center">{promo.discount_percentage}%</TableCell>
                    <TableCell align="center">
                      {new Date(promo.start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(promo.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={new Date(promo.end_date) > new Date() ? "Active" : "Expired"}
                        color={new Date(promo.end_date) > new Date() ? "success" : "error"}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ p: 3, color: "gray" }}>
                    No promotions available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default PromotionManagement;
