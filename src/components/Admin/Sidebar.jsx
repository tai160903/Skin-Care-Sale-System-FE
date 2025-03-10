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
  AdminPanelSettings,
  Inventory,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

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
        {
          text: "Kế hoạch chăm sóc da",
          icon: <Science />,
          path: "/admin/skincare-plans",
        },
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
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          background: "#E3F2FD", // Xanh nhạt pastel
          color: "#424242", // Xám đậm
          paddingTop: 2,
          height: "100vh",
          boxShadow: "2px 0px 5px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
        },
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          padding: "16px 0",
          backgroundColor: "#BBDEFB", // Xanh nhạt pastel
          borderRadius: "0 0 8px 8px",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", fontFamily: "Roboto", color: "#1565C0" }}
        >
          Manager Panel
        </Typography>
      </Box>

      <List>
        {sections.map((section) => (
          <Box key={section.title}>
            <ListSubheader
              sx={{
                backgroundColor: "transparent",
                color: "#424242", // Xám đậm
                fontWeight: "bold",
                fontSize: "14px",
                paddingLeft: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {section.icon} {section.title}
            </ListSubheader>
            {section.items.map(({ text, icon, path }) => (
              <ListItem
                key={text}
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
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    fontFamily: "Roboto",
                    color: location.pathname === path ? "#0D47A1" : "#424242",
                  }}
                />
              </ListItem>
            ))}
            <Divider sx={{ backgroundColor: "#90CAF9", margin: "8px 16px" }} />
          </Box>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <List>
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
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "Roboto",
              color: "#D32F2F",
            }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
