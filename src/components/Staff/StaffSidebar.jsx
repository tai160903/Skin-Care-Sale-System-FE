import React from "react";
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Container, Box, Paper } from "@mui/material";
import OrderManagement from "./OrderManagement";
import CustomerSupport from "./CustomerSupport";
import ProductManagement from "./ProductManagement";
import PromotionManagement from "./PromotionManagement";
import ReportsDashboard from "./ReportsDashboard";

const menuItems = [
  "Quản lý đơn hàng",
  "Hỗ trợ khách hàng",
  "Quản lý sản phẩm",
  "Quản lý khuyến mãi & tích điểm",
  "Báo cáo & phân tích"
];

const components = {
  "Quản lý đơn hàng": <OrderManagement />,
  "Hỗ trợ khách hàng": <CustomerSupport />,
  "Quản lý sản phẩm": <ProductManagement />,
  "Quản lý khuyến mãi & tích điểm": <PromotionManagement />,
  "Báo cáo & phân tích": <ReportsDashboard />
};

const StaffDashboard = () => {
  const [selectedItem, setSelectedItem] = React.useState(menuItems[0]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer variant="permanent" sx={{ width: 250, flexShrink: 0 }}>
        <List>
          {menuItems.map((text) => (
            <ListItem 
              button 
              key={text} 
              onClick={() => setSelectedItem(text)}
              sx={{ backgroundColor: selectedItem === text ? "#e0e0e0" : "inherit" }}
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Staff Dashboard</Typography>
          </Toolbar>
        </AppBar>

        <Container>
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            {components[selectedItem]}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default StaffDashboard;