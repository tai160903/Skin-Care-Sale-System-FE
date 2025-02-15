import React, { useState } from "react";
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
  IconButton,
  MenuItem,
} from "@mui/material";
import {
  Dashboard,
  ShoppingCart,
  People,
  BarChart,
  Settings,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CategoryIcon from "@mui/icons-material/Category";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage dropdown toggle

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(!isMenuOpen); // Toggle dropdown
  };

  const handleClose = () => {
    setAnchorEl(null);
    // setIsMenuOpen(false);  // Uncomment this line if you want to close the dropdown when clicking outside.
  };

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
          overflowY: "auto", // Allow scrolling within the sidebar
        },
      }}
    >
      {/* Admin Panel Header */}
      <Box
        sx={{
          textAlign: "center",
          mb: 2,
          padding: 2,
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

      {/* Dashboard Section */}
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

        <ListItem
          button
          sx={{
            borderRadius: "8px",
            mx: 2,
            mb: 1,
            display: "flex",
            justifyContent: "space-between", // Space between the text and icon
            "&:hover": {
              backgroundColor: "#c7b9b9",
            },
          }}
          onClick={handleClick}
        >
          <ListItemIcon component={Link} to="/dashboard" sx={{ color: "#fff" }}>
            <Dashboard />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
            primaryTypographyProps={{
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "Roboto",
              color: "#fff",
            }}
          />
          <IconButton sx={{ color: "#fff", marginLeft: 2 }}>
            {isMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </ListItem>

        {/* Dropdown menu (will scroll if content overflows) */}
        {isMenuOpen && (
          <Box
            sx={{
              maxHeight: "200px",
              overflowY: "auto",
              backgroundColor: "#fff",
            }}
          >
            <List>
              <MenuItem
                component={Link}
                to="/dashboard"
                onClick={handleClose}
                sx={{ paddingLeft: "32px", paddingRight: "32px" }}
              >
                <ListItemIcon sx={{ color: "#1976d2" }}>
                  <BarChart />
                </ListItemIcon>
                <ListItemText primary="Analysis" sx={{ color: "#333" }} />
              </MenuItem>
              <Divider sx={{ margin: "4px 0" }} />
              <MenuItem
                component={Link}
                to="/ecommerce"
                onClick={handleClose}
                sx={{ paddingLeft: "32px", paddingRight: "32px" }}
              >
                <ListItemIcon sx={{ color: "#1976d2" }}>
                  <ShoppingCart />
                </ListItemIcon>
                <ListItemText primary="Ecommerce" sx={{ color: "#333" }} />
              </MenuItem>
            </List>
          </Box>
        )}
      </List>

      {/* Orders and Customers Section */}
      <List>
        <ListSubheader
          sx={{
            backgroundColor: "transparent",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Đơn Hàng & Khách Hàng
        </ListSubheader>
        <ListItem
          component={Link}
          to="/orders"
          button
          sx={{
            borderRadius: "8px",
            mx: 2,
            mb: 1,
            "&:hover": {
              backgroundColor: "#c7b9b9", // Màu hover rõ ràng hơn
            },
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <ShoppingCart />
          </ListItemIcon>
          <ListItemText
            primary="Đơn Hàng"
            primaryTypographyProps={{
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "Roboto",
              color: "#fff", // Màu chữ sáng
            }}
          />
        </ListItem>

        <ListItem
          component={Link}
          to="/customers"
          button
          sx={{
            borderRadius: "8px",
            mx: 2,
            mb: 1,
            "&:hover": {
              backgroundColor: "#c7b9b9", // Màu hover rõ ràng hơn
            },
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <People />
          </ListItemIcon>
          <ListItemText
            primary="Khách Hàng"
            primaryTypographyProps={{
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "Roboto",
              color: "#fff", // Màu chữ sáng
            }}
          />
        </ListItem>
      </List>

      {/* Orders and Customers Section */}
      <List>
        <ListSubheader
          sx={{
            backgroundColor: "transparent",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Sản Phẩm & Nhân Viên
        </ListSubheader>
        <ListItem
          component={Link}
          to="/orders"
          button
          sx={{
            borderRadius: "8px",
            mx: 2,
            mb: 1,
            "&:hover": {
              backgroundColor: "#c7b9b9", // Màu hover rõ ràng hơn
            },
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText
            primary="Sản Phẩm"
            primaryTypographyProps={{
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "Roboto",
              color: "#fff", // Màu chữ sáng
            }}
          />
        </ListItem>

        <ListItem
          component={Link}
          to="/customers"
          button
          sx={{
            borderRadius: "8px",
            mx: 2,
            mb: 1,
            "&:hover": {
              backgroundColor: "#c7b9b9", // Màu hover rõ ràng hơn
            },
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <PeopleAltIcon />
          </ListItemIcon>
          <ListItemText
            primary="Nhân Viên"
            primaryTypographyProps={{
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "Roboto",
              color: "#fff", // Màu chữ sáng
            }}
          />
        </ListItem>
      </List>

      {/* Analytics & Settings Section */}
      <List>
        <ListSubheader
          sx={{
            backgroundColor: "transparent",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Thống Kê & Cài Đặt
        </ListSubheader>
        <ListItem
          component={Link}
          to="/dashboard"
          button
          sx={{
            borderRadius: "8px",
            mx: 2,
            mb: 1,
            "&:hover": {
              backgroundColor: "#c7b9b9", // Màu hover rõ ràng hơn
            },
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <BarChart />
          </ListItemIcon>
          <ListItemText
            primary="Thống Kê"
            primaryTypographyProps={{
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "Roboto",
              color: "#fff", // Màu chữ sáng
            }}
          />
        </ListItem>

        <ListItem
          component={Link}
          to="/settings"
          button
          sx={{
            borderRadius: "8px",
            mx: 2,
            mb: 1,
            "&:hover": {
              backgroundColor: "#c7b9b9", // Màu hover rõ ràng hơn
            },
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <Settings />
          </ListItemIcon>
          <ListItemText
            primary="Cài Đặt"
            primaryTypographyProps={{
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "Roboto",
              color: "#fff", // Màu chữ sáng
            }}
          />
        </ListItem>
        <ListItem
          component={Link}
          to="/home"
          button
          sx={{
            borderRadius: "8px",
            mx: 2,
            mb: 1,
            "&:hover": {
              backgroundColor: "#c7b9b9", // Màu hover rõ ràng hơn
            },
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Exit"
            primaryTypographyProps={{
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "Roboto",
              color: "#fff", // Màu chữ sáng
            }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
