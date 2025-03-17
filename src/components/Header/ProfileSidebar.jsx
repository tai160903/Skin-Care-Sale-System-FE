import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ListAlt, People, ExitToApp, Menu } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

const ProfileSidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const token = useSelector((state) => state.user.token);
  const customerId = useSelector((state) => state?.user?.customer?._id);
  const toggleSidebar = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action to clear user data
    navigate("/"); // Navigate to the home page or login page
  };

  const menuItems = [
    { text: "Đơn hàng", icon: <ListAlt />, path: `/profile/${customerId}` },
    {
      text: "Hỗ trợ khách hàng",
      icon: <People />,
      path: `/profile/${customerId}/orderhistory`,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 260 : 80,
        flexShrink: 0,
        transition: "width 0.3s ease-in-out",
        "& .MuiDrawer-paper": {
          width: open ? 260 : 80,
          background: "#ECF5FF",
          color: "#34495E",
          paddingTop: 2,
          height: "100vh",
          boxShadow: "2px 0px 10px rgba(0,0,0,0.15)",
          transition: "width 0.3s ease-in-out",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          textAlign: "center",
          padding: "16px 0",
          backgroundColor: "#3498DB",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: open ? "20px" : "8px",
          paddingRight: "8px",
        }}
      >
        {open && (
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
            Profile
          </Typography>
        )}
        <IconButton onClick={toggleSidebar} sx={{ color: "#fff" }}>
          <Menu />
        </IconButton>
      </Box>

      {/* Menu Items */}
      <List sx={{ padding: "16px 8px" }}>
        {menuItems.map(({ text, icon, path }) => (
          <Tooltip title={!open ? text : ""} placement="right" key={text}>
            <ListItem
              component={Link}
              to={path}
              selected={location.pathname === path}
              sx={{
                bgcolor: location.pathname === path ? "#85C1E9" : "transparent",
                "&:hover": {
                  backgroundColor: "#D6EAF8",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s",
                borderRadius: "8px",
                marginBottom: "10px",
                padding: "12px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ListItemIcon sx={{ color: "#2C3E50", minWidth: "40px" }}>
                {icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ backgroundColor: "#2C3E50", margin: "16px 20px" }} />
      <List>
        <ListItem
          onClick={handleLogout} // Trigger logout function here
          sx={{
            bgcolor: "transparent",
            "&:hover": {
              backgroundColor: "#F5B7B1",
              transform: "scale(1.05)",
            },
            transition: "all 0.3s",
            borderRadius: "8px",
            margin: "10px 8px",
            padding: "12px",
          }}
        >
          <ListItemIcon sx={{ color: "#E74C3C" }}>
            <ExitToApp />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Đăng xuất"
              primaryTypographyProps={{ fontSize: "16px", fontWeight: "500" }}
            />
          )}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default ProfileSidebar;
