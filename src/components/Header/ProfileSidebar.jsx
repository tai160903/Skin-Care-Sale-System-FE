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
    { text: "Trang chủ", icon: <Home />, path: "/" },
    { text: "Hồ sơ", icon: <Person />, path: `/profile/${customerId}` },
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
          bgcolor: "grey.50",
          color: "grey.900",
          paddingTop: 2,
          height: "100vh",
          borderRight: "none",
          boxShadow: "4px 0px 20px rgba(0, 0, 0, 0.05)",
        },
      }}
    >
      {/* Header với Avatar */}
      <Box
        sx={{
          textAlign: "center",
          padding: "20px 0",
          bgcolor: "primary.main",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <Avatar
          src={customerAvatar || "/default-avatar.png"}
          sx={{
            width: 70,
            height: 70,
            mb: 1.5,
            cursor: "pointer",
            border: "3px solid white",
            transition: "transform 0.3s",
            "&:hover": { transform: "scale(1.05)" },
          }}
          onClick={() => navigate(`/profile/${customerId}`)}
        />
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: "bold",
            letterSpacing: "0.5px",
          }}
        >
          {customerName || "Người dùng"}
        </Typography>
      </Box>

      {/* Danh sách menu */}
      <List sx={{ padding: "16px 8px" }}>
        {menuItems.map(({ text, icon, path }) => (
          <Tooltip title={text} placement="right" key={text}>
            <ListItem
              component={Link}
              to={path}
              selected={location.pathname === path}
              sx={{
                bgcolor:
                  location.pathname === path ? "primary.light" : "transparent",
                color: location.pathname === path ? "primary.main" : "grey.700",
                "&:hover": {
                  bgcolor: "grey.100",
                  color: "primary.main",
                },
                borderRadius: "12px",
                mb: 1,
                py: 1.5,
                px: 2,
                transition: "all 0.3s ease",
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === path ? "primary.main" : "grey.600",
                  minWidth: "40px",
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontSize: "16px",
                  fontWeight: location.pathname === path ? "600" : "500",
                }}
              />
            </ListItem>
          </Tooltip>
        ))}
      </List>

      {/* Khoảng trống đẩy logout xuống dưới */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Divider và nút đăng xuất */}
      <Divider sx={{ mx: 2, my: 2, bgcolor: "grey.300" }} />
      <List>
        <ListItem
          onClick={handleLogout}
          sx={{
            "&:hover": {
              bgcolor: "error.light",
              color: "error.main",
            },
            borderRadius: "12px",
            mx: 1,
            py: 1.5,
            px: 2,
            transition: "all 0.3s ease",
          }}
        >
          <ListItemIcon sx={{ color: "error.main", minWidth: "40px" }}>
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
