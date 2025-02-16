import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  ListSubheader,
} from "@mui/material";
import {
  Dashboard,
  People,
  ShoppingCart,
  ExitToApp,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin/" },
    { text: "Products", icon: <ShoppingCart />, path: "/admin/products" },
    { text: "Users", icon: <People />, path: "/admin/users" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          background: "#1f6192",
          color: "#fff",
          paddingTop: 2,
          height: "100vh",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          border: "2px solid #1976d2",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", fontFamily: "Roboto", color: "#1976d2" }}
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
          }}
        >
          Dashboard
        </ListSubheader>
        {menuItems.map(({ text, icon, path }) => (
          <ListItem
            key={text}
            component={Link}
            to={path}
            selected={location.pathname === path}
            sx={{
              bgcolor: location.pathname === path ? "#1976d2" : "transparent",
              "&:hover": { backgroundColor: "#c7b9b9" },
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
      <List>
        <ListItem
          component={Link}
          to="/logout"
          sx={{
            bgcolor: "transparent",
            "&:hover": { backgroundColor: "#c7b9b9" },
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
