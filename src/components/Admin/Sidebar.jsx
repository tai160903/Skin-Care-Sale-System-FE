import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  ListSubheader,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  People,
  ShoppingCart,
  ExitToApp,
  ListAlt,
  Star,
  Article,
  LiveHelp,
  LocalOffer,
  Science,
  Compare,
  BarChart,
  Settings,
  Group,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin/" },
    { text: "Blog", icon: <Article />, path: "/admin/blog" },
    { text: "Promotions", icon: <LocalOffer />, path: "/admin/promotions" },
    { text: "Reports", icon: <BarChart />, path: "/admin/reports" },
    { text: "Orders", icon: <ListAlt />, path: "/admin/orders" },
    { text: "Products", icon: <ShoppingCart />, path: "/admin/products" },
    { text: "Compare Products", icon: <Compare />, path: "/admin/compare" },
    {
      text: "Skin Care Plans",
      icon: <Science />,
      path: "/admin/skincare-plans",
    },
    { text: "Users", icon: <ListAlt />, path: "/admin/users" },
    { text: "Customers", icon: <People />, path: "/admin/customers" },
    { text: "Staff", icon: <Group />, path: "/admin/staff" },
    { text: "Reviews", icon: <Star />, path: "/admin/reviews" },
    { text: "FAQs", icon: <LiveHelp />, path: "/admin/faqs" },
    { text: "Settings", icon: <Settings />, path: "/admin/settings" },
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
          Admin Panel
        </Typography>
      </Box>

      <List>
        <ListSubheader
          sx={{
            backgroundColor: "transparent",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "14px",
            paddingLeft: "16px",
          }}
        >
          Main Menu
        </ListSubheader>
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
            "&:hover": { backgroundColor: "#ff4d4d", transform: "scale(1.05)" },
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

export default Sidebar;
