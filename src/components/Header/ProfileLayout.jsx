import { Box } from "@mui/material";
import { Outlet, useParams } from "react-router-dom";
import ProfileSidebar from "./ProfileSidebar";

const ProfileLayout = () => {
  const { customerId } = useParams();
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <ProfileSidebar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Box sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
          <Outlet context={{ customerId }} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileLayout;
