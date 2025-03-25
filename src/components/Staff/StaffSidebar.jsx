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
import {
  ListAlt,
  ShoppingCart,
  LocalOffer,
  BarChart,
  ExitToApp,
  LocalShipping,
  Menu,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";

const StaffSidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    { text: "Đơn hàng", icon: <ListAlt />, path: "/staff/orders" },
    { text: "Sản phẩm", icon: <ShoppingCart />, path: "/staff/products" },
    { text: "Khuyến mãi", icon: <LocalOffer />, path: "/staff/promotions" },
    { text: "Giao hàng", icon: <LocalShipping />, path: "/staff/shipmanager" },
    { text: "Báo cáo", icon: <BarChart />, path: "/staff/reports" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 260 : 70,
        flexShrink: 0,
        transition: "width 0.3s ease-in-out",
        "& .MuiDrawer-paper": {
          width: open ? 260 : 70,
          background: "#ECF5FF",
          color: "#34495E",
          paddingTop: 1,
          height: "100vh",
          borderRight: "none",
          boxShadow: "3px 0 15px rgba(0, 0, 0, 0.1)",
          transition: "width 0.3s ease-in-out",
          overflowX: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: "12px 16px",
          backgroundColor: "#3498DB",
          display: "flex",
          justifyContent: open ? "space-between" : "center",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          borderBottomLeftRadius: open ? 12 : 0,
          borderBottomRightRadius: open ? 12 : 0,
        }}
      >
        {open && (
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.3rem",
              letterSpacing: 0.5,
            }}
          >
            Staff
          </Typography>
        )}
        <IconButton onClick={toggleSidebar} sx={{ color: "#fff" }}>
          <Menu fontSize="medium" />
        </IconButton>
      </Box>

      {/* Menu Items */}
      <List sx={{ padding: "20px 10px" }}>
        {menuItems.map(({ text, icon, path }) => (
          <Tooltip title={!open ? text : ""} placement="right" key={text} arrow>
            <ListItem
              component={Link}
              to={path}
              selected={location.pathname === path}
              sx={{
                bgcolor: location.pathname === path ? "#85C1E9" : "transparent",
                "&:hover": {
                  bgcolor: "#D6EAF8",
                  transform: "translateX(4px)",
                },
                transition: "all 0.2s ease",
                borderRadius: "10px",
                mb: 1.5,
                py: 1.2,
                px: 2,
                display: "flex",
                alignItems: "center",
                boxShadow:
                  location.pathname === path
                    ? "0 2px 6px rgba(0, 0, 0, 0.05)"
                    : "none",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#2C3E50",
                  minWidth: open ? 40 : 0,
                  transition: "all 0.2s",
                }}
              >
                {icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    fontSize: "15px",
                    fontWeight: 500,
                    letterSpacing: 0.3,
                  }}
                />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Logout */}
      <Divider sx={{ mx: 2, my: 2, bgcolor: "#2C3E50", height: 1.5 }} />
      <List sx={{ padding: "0 10px 20px" }}>
        <Tooltip title={!open ? "Đăng xuất" : ""} placement="right" arrow>
          <ListItem
            onClick={handleLogout}
            sx={{
              bgcolor: "transparent",
              "&:hover": {
                bgcolor: "#F5B7B1",
                transform: "translateX(4px)",
              },
              transition: "all 0.2s ease",
              borderRadius: "10px",
              py: 1.2,
              px: 2,
              cursor: "pointer",
            }}
          >
            <ListItemIcon
              sx={{
                color: "#E74C3C",
                minWidth: open ? 40 : 0,
                transition: "all 0.2s",
              }}
            >
              <ExitToApp />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Đăng xuất"
                primaryTypographyProps={{
                  fontSize: "15px",
                  fontWeight: 500,
                  letterSpacing: 0.3,
                }}
              />
            )}
          </ListItem>
        </Tooltip>
      </List>
    </Drawer>
  );
};

export default StaffSidebar;
