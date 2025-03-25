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
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from "@mui/icons-material/Search";

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
      setPromotions(Array.isArray(response) ? response : []);
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

    const matchesStartDate = startDate
      ? promoStartDate.toLocaleDateString() ===
        startDate.toDate().toLocaleDateString()
      : true;
    const matchesEndDate = endDate
      ? promoEndDate.toLocaleDateString() ===
        endDate.toDate().toLocaleDateString()
      : true;
    const matchesName = searchName
      ? promo.name.toLowerCase().includes(searchName.toLowerCase())
      : true;

    return matchesStartDate && matchesEndDate && matchesName;
  });

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a237e" }}>
            🎉 Promotion Management
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={fetchPromotions}
            sx={{ borderRadius: 20, textTransform: "none" }}
          >
            Refresh
          </Button>
        </Box>

        {/* Filters */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mb: 4,
              alignItems: "center",
            }}
          >
            <TextField
              label="Search by Name"
              variant="outlined"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              sx={{ flex: "1 1 300px", minWidth: 200 }}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              sx={{ flex: "1 1 200px", minWidth: 150 }}
              slotProps={{ textField: { variant: "outlined" } }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              sx={{ flex: "1 1 200px", minWidth: 150 }}
              slotProps={{ textField: { variant: "outlined" } }}
            />
          </Box>
        </LocalizationProvider>

        {/* Table */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, overflow: "hidden" }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "#3f51b5",
                    "& th": { color: "#fff", fontWeight: 600 },
                  }}
                >
                  {[
                    "Name",
                    "Code",
                    "Description",
                    "Discount (%)",
                    "Start Date",
                    "End Date",
                    "Status",
                  ].map((header) => (
                    <TableCell key={header} align="center">
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPromotions.length > 0 ? (
                  filteredPromotions.map((promo) => (
                    <TableRow
                      key={promo._id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: "#f5f5f5" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell align="center">{promo.name}</TableCell>
                      <TableCell align="center">{promo.code}</TableCell>
                      <TableCell align="center">{promo.description}</TableCell>
                      <TableCell align="center">
                        {promo.discount_percentage}%
                      </TableCell>
                      <TableCell align="center">
                        {new Date(promo.start_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(promo.end_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={
                            new Date(promo.end_date) > new Date()
                              ? "Active"
                              : "Expired"
                          }
                          color={
                            new Date(promo.end_date) > new Date()
                              ? "success"
                              : "error"
                          }
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
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
                      No promotions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default PromotionManagement;
