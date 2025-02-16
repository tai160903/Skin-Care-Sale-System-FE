import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Import SearchIcon

function MyApp() {
  return (
    <AppBar position="static" sx={{ background: "#1976d2" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Admin Dashboard</Typography>

        {/* Thanh tìm kiếm */}
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm..."
          size="small"
          sx={{
            bgcolor: "white",
            borderRadius: 1,
            width: 250,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "transparent" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Toolbar>
    </AppBar>
  );
}

export default MyApp;
