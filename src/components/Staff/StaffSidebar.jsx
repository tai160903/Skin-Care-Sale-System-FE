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
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const StaffSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { text: "Quản lý đơn hàng", icon: <ListAlt />, path: "/staff/orders" },
    { text: "Hỗ trợ khách hàng", icon: <People />, path: "/staff/customers" },
    {
      text: "Quản lý sản phẩm",
      icon: <ShoppingCart />,
      path: "/staff/products",
    },
    {
      text: "Quản lý khuyến mãi",
      icon: <LocalOffer />,
      path: "/staff/promotions",
    },
    { text: "Báo cáo & phân tích", icon: <BarChart />, path: "/staff/reports" },
    { text: "Quản lý ship", icon: <BarChart />, path: "/staff/ship" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          background: "#1e3a56",
          color: "#fff",
          paddingTop: 2,
          height: "100vh",
          boxShadow: "2px 0px 5px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
        },
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          padding: "16px 0",
          backgroundColor: "#1e90ff",
          borderRadius: "0 0 8px 8px",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", fontFamily: "Roboto", color: "#fff" }}
        >
          Staff Panel
        </Typography>
      </Box>

      <List>
        {menuItems.map(({ text, icon, path }) => (
          <ListItem
            key={text}
            component={Link}
            to={path}
            selected={location.pathname === path}
            sx={{
              bgcolor: location.pathname === path ? "#1976d2" : "transparent",
              "&:hover": {
                backgroundColor: "#1976d2",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
              borderRadius: "8px",
              margin: "4px",
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>{icon}</ListItemIcon>
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontSize: "16px",
                fontWeight: "bold",
                fontFamily: "Roboto",
                color: "#fff",
              }}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ backgroundColor: "#fff", margin: "8px 16px" }} />
      <List>
        <ListItem
          component={Link}
          to="/logout"
          sx={{
            bgcolor: "transparent",
            "&:hover": {
              backgroundColor: "#ff4d4d",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease-in-out",
            borderRadius: "8px",
            margin: "4px",
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "Roboto",
              color: "#fff",
            }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default StaffSidebar;
