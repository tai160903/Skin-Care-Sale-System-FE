import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import {
  Menu,
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
  Settings,
  Group,
  AdminPanelSettings,
  Inventory,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const sections = [
    {
      title: "Quản lý chính",
      icon: <AdminPanelSettings />,
      items: [
        { text: "Dashboard", icon: <Dashboard />, path: "" },
        { text: "Đơn hàng", icon: <ListAlt />, path: "/admin/orders" },
        { text: "Sản phẩm", icon: <ShoppingCart />, path: "/admin/products" },
      ],
    },
    {
      title: "Quản lý sản phẩm",
      icon: <Inventory />,
      items: [
        {
          text: "Kế hoạch chăm sóc da",
          icon: <Science />,
          path: "/admin/skincare-plans",
        },
        { text: "Khuyến mãi", icon: <LocalOffer />, path: "/admin/promotions" },
        { text: "Blog", icon: <Article />, path: "/admin/blog" },
      ],
    },
    {
      title: "Quản lý người dùng",
      icon: <People />,
      items: [
        { text: "Nhân viên", icon: <Group />, path: "/admin/staff" },
        { text: "Khách hàng", icon: <People />, path: "/admin/customers" },
      ],
    },
    {
      title: "Đánh giá",
      icon: <Settings />,
      items: [
        { text: "Quiz", icon: <LiveHelp />, path: "/admin/faqs" },
        { text: "Đánh giá", icon: <Star />, path: "/admin/reviews" },
      ],
    },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? 260 : 80,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? 260 : 80,
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          color: "#333",
          transition: "width 0.3s ease",
          paddingTop: 2,
          height: "100vh",
          boxShadow: "2px 0px 5px rgba(0,0,0,0.1)",
          overflowX: "hidden",
          scrollbarWidth: "none",
        },
      }}
    >
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
            onClick={() => navigate("/")}
          >
            Manager
          </Typography>
        )}
        <IconButton onClick={toggleDrawer}>
          <Menu sx={{ color: "#333" }} />
        </IconButton>
      </Box>
      <List>
        {sections.map((section) => (
          <Box key={section.title}>
            {open && (
              <ListItem
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#555",
                  pl: 2,
                  textOverflow: "ellipsis",
                }}
              >
                {section.title}
              </ListItem>
            )}
            {section.items.map(({ text, icon, path }) => (
              <Tooltip title={!open ? text : ""} placement="right" key={text}>
                <ListItem
                  button
                  component={Link}
                  to={path}
                  selected={location.pathname === path}
                  sx={{
                    bgcolor:
                      location.pathname === path ? "#BBDEFB" : "transparent",
                    "&:hover": {
                      backgroundColor: "#90CAF9",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease-in-out",
                    borderRadius: "8px",
                    margin: "4px",
                  }}
                >
                  <ListItemIcon sx={{ color: "#1565C0" }}>{icon}</ListItemIcon>
                  {open && <ListItemText primary={text} />}
                </ListItem>
              </Tooltip>
            ))}
            <Divider sx={{ backgroundColor: "#90CAF9", margin: "8px 16px" }} />
          </Box>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <List>
        <Tooltip title={!open ? "Logout" : ""} placement="right">
          <ListItem
            onClick={handleLogout} // Trigger logout function here
            sx={{
              bgcolor: "transparent",
              "&:hover": {
                backgroundColor: "#FFCDD2",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
              borderRadius: "8px",
              margin: "4px",
            }}
          >
            <ListItemIcon sx={{ color: "#D32F2F" }}>
              <ExitToApp />
            </ListItemIcon>
            {open && <ListItemText primary="Logout" />}
          </ListItem>
        </Tooltip>
      </List>
    </Drawer>
  );
};

export default Sidebar;
