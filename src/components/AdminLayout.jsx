import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Admin/Sidebar";

const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
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

export default AdminLayout;
