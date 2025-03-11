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
  Compare,
  BarChart,
  Settings,
  Group,
  AdminPanelSettings,
  Inventory,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const sections = [
    {
      title: "Quản lý chính",
      icon: <AdminPanelSettings />, 
      items: [
        { text: "Dashboard", icon: <Dashboard />, path: "/admin/" },
        { text: "Blog", icon: <Article />, path: "/admin/blog" },
        { text: "Khuyến mãi", icon: <LocalOffer />, path: "/admin/promotions" },
        { text: "Báo cáo", icon: <BarChart />, path: "/admin/reports" },
      ],
    },
    {
      title: "Quản lý sản phẩm",
      icon: <Inventory />, 
      items: [
        { text: "Đơn hàng", icon: <ListAlt />, path: "/admin/orders" },
        { text: "Sản phẩm", icon: <ShoppingCart />, path: "/admin/products" },
        { text: "So sánh sản phẩm", icon: <Compare />, path: "/admin/compare" },
        {text: "Kế hoạch chăm sóc da",icon: <Science />,path: "/admin/skincare-plans"},
        { text: "Đánh giá", icon: <Star />, path: "/admin/reviews" },
      ],
    },
    {
      title: "Quản lý người dùng",
      icon: <People />, 
      items: [
        { text: "Người dùng", icon: <ListAlt />, path: "/admin/users" },
        { text: "Khách hàng", icon: <People />, path: "/admin/customers" },
        { text: "Nhân viên", icon: <Group />, path: "/admin/staff" },
      ],
    },
    {
      title: "Hỗ trợ & Cài đặt",
      icon: <Settings />,
      items: [
        { text: "FAQs", icon: <LiveHelp />, path: "/admin/faqs" },
        { text: "Cài đặt", icon: <Settings />, path: "/admin/settings" },
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
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
        <IconButton onClick={toggleDrawer}>
          <Menu sx={{ color: "#333" }} />
        </IconButton>
      </Box>
      <List>
        {sections.map((section) => (
          <Box key={section.title}>
            {open && (
              <ListItem sx={{ fontWeight: "bold", fontSize: "14px", color: "#555", pl: 2 }}>
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
                    bgcolor: location.pathname === path ? "#BBDEFB" : "transparent",
                    "&:hover": { backgroundColor: "#90CAF9", transform: "scale(1.05)" },
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
            component={Link}
            to="/logout"
            sx={{
              bgcolor: "transparent",
              "&:hover": { backgroundColor: "#FFCDD2", transform: "scale(1.05)" },
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