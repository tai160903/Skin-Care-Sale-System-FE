import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Admin/Sidebar";

const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box>
        <Sidebar />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#f5f5f5" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
