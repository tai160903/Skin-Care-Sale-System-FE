import React, { useState } from "react";
import {
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
} from "@mui/material";

const steps = [
  "Đã nhận đơn",
  "Đang chuẩn bị hàng",
  "Đang giao",
  "Đã giao thành công",
];

const OrTrack = () => {
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // Giả lập dữ liệu đơn hàng
  const mockOrders = {
    123456: 2, // Đang giao hàng
    789012: 3, // Đã giao thành công
  };

  const handleTrackOrder = () => {
    if (mockOrders[orderId]) {
      setOrderStatus(`Trạng thái: ${steps[mockOrders[orderId]]}`);
      setActiveStep(mockOrders[orderId]);
    } else {
      setOrderStatus("Không tìm thấy đơn hàng!");
      setActiveStep(0);
    }
  };

  return (
    <Box className="flex flex-col items-center p-6 bg-white shadow-lg rounded-xl w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">🔍 Tra cứu đơn hàng</h2>
      <TextField
        label="Nhập mã đơn hàng"
        variant="outlined"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        className="w-full mb-4"
      />
      <Button variant="contained" color="primary" onClick={handleTrackOrder}>
        Kiểm tra
      </Button>

      {orderStatus && (
        <Box className="mt-6 w-full">
          <p className="text-center font-medium">{orderStatus}</p>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}
    </Box>
  );
};

export default OrTrack;
