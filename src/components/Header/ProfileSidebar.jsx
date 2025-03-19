import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Avatar,
  Typography,
} from "@mui/material";
import {
  ListAlt,
  Settings,
  ExitToApp,
  Home,
  Person,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/userSlice";

const ProfileSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customerId = useSelector((state) => state?.user?.customer?._id);
  const customerName = useSelector((state) => state?.user?.customer?.name);
  const customerAvatar = useSelector((state) => state?.user?.customer?.avatar);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    {
      text: "Trang chủ",
      icon: <Home />,
      path: "/",
    },
    {
      text: "Hồ sơ",
      icon: <Person />,
      path: `/profile/${customerId}`,
    },
    {
      text: "Lịch sử đơn hàng",
      icon: <ListAlt />,
      path: `/profile/${customerId}/order-tracking`,
    },
    {
      text: "Đổi mật khẩu",
      icon: <Settings />,
      path: `/profile/${customerId}/change-password`,
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
          background: "#F4F6F7",
          color: "#2C3E50",
          paddingTop: 2,
          height: "100vh",
          boxShadow: "2px 0px 10px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          padding: "16px 0",
          backgroundColor: "#2980B9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          src={customerAvatar || "/default-avatar.png"}
          sx={{ width: 64, height: 64, marginBottom: 1, cursor: "pointer" }}
          onClick={() => navigate(`/profile/${customerId}`)}
        />
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
          {customerName || "Người dùng"}
        </Typography>
      </Box>

      <List sx={{ padding: "16px 8px" }}>
        {menuItems.map(({ text, icon, path }) => (
          <Tooltip title={text} placement="right" key={text}>
            <ListItem
              component={Link}
              to={path}
              selected={location.pathname === path}
              sx={{
                bgcolor: location.pathname === path ? "#AED6F1" : "transparent",
                "&:hover": {
                  backgroundColor: "#D6EAF8",
                },
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
              <ListItemText
                primary={text}
                primaryTypographyProps={{ fontSize: "16px", fontWeight: "500" }}
              />
            </ListItem>
          </Tooltip>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ backgroundColor: "#2C3E50", margin: "16px 20px" }} />
      <List>
        <ListItem
          onClick={handleLogout}
          sx={{
            bgcolor: "transparent",
            "&:hover": {
              backgroundColor: "#F5B7B1",
            },
            borderRadius: "8px",
            margin: "10px 8px",
            padding: "12px",
          }}
        >
          <ListItemIcon sx={{ color: "#E74C3C" }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText
            primary="Đăng xuất"
            primaryTypographyProps={{ fontSize: "16px", fontWeight: "500" }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default ProfileSidebar;
