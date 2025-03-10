import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import {
  ListAlt,
  People,
  ShoppingCart,
  LocalOffer,
  BarChart,
  ExitToApp,
  LocalShipping,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const StaffSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { text: "Đơn hàng", icon: <ListAlt />, path: "/staff/orders" },
    { text: "Hỗ trợ khách hàng", icon: <People />, path: "/staff/customers" },
    { text: "Sản phẩm", icon: <ShoppingCart />, path: "/staff/products" },
    { text: "Khuyến mãi", icon: <LocalOffer />, path: "/staff/promotions" },
    { text: "Báo cáo", icon: <BarChart />, path: "/staff/reports" },
    { text: "Giao hàng", icon: <LocalShipping />, path: "/staff/shipmanager" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 280,
          background: "#2C3E50",
          color: "#ECF0F1",
          paddingTop: 2,
          height: "100vh",
          boxShadow: "2px 0px 10px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          textAlign: "center",
          padding: "24px 0",
          backgroundColor: "#2980B9",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", fontFamily: "Roboto", color: "#fff" }}
        >
          Staff Dashboard
        </Typography>
      </Box>

      {/* Menu Items */}
      <List sx={{ padding: "16px 8px" }}>
        {menuItems.map(({ text, icon, path }) => (
          <ListItem
            key={text}
            component={Link}
            to={path}
            selected={location.pathname === path}
            sx={{
              bgcolor: location.pathname === path ? "#3498DB" : "transparent",
              "&:hover": {
                backgroundColor: "#3498DB",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease-in-out",
              borderRadius: "6px",
              marginBottom: "10px",
              padding: "12px 20px",
            }}
          >
            <ListItemIcon sx={{ color: "#ECF0F1" }}>{icon}</ListItemIcon>
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontSize: "16px",
                fontWeight: "500",
                fontFamily: "Roboto",
                color: "#ECF0F1",
              }}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ backgroundColor: "#ECF0F1", margin: "16px 20px" }} />
      <List>
        <ListItem
          component={Link}
          to="/logout"
          sx={{
            bgcolor: "transparent",
            "&:hover": {
              backgroundColor: "#E74C3C",
              transform: "scale(1.05)",
            },
            transition: "all 0.3s ease-in-out",
            borderRadius: "6px",
            margin: "10px 8px",
            padding: "12px 20px",
          }}
        >
          <ListItemIcon sx={{ color: "#ECF0F1" }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText
            primary="Đăng xuất"
            primaryTypographyProps={{
              fontSize: "16px",
              fontWeight: "500",
              fontFamily: "Roboto",
              color: "#ECF0F1",
            }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default StaffSidebar;
