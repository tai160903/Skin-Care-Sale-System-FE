import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import StaffSidebar from "../components/Staff/StaffSidebar";

const StaffLayout = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <StaffSidebar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#f4f6f8", overflow: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default StaffLayout;
