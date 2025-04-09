import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import AddressForm from "./AddressForm";
import shipfeeService from "../services/shipfeeService";
import draftOrderService from "../services/draftOrderService";
import {
  Button,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@mui/material";
import { FaMoneyBill1Wave } from "react-icons/fa6";

const DraftOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const customer = useSelector((state) => state.user.customer);

  const [promotionId, setPromotionId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [coupon, setCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [address, setAddress] = useState(customer?.address || {});
  const [shippingFee, setShippingFee] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchShippingFee = async () => {
      if (address?.ward && address?.district) {
        try {
          const response = await shipfeeService.getShipfee(
            address.district.DistrictID,
            address.ward.WardCode,
            cart.length,
          );
          setShippingFee(response.data.data.total);
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Lỗi khi lấy phí vận chuyển",
          );
          setShippingFee(0);
        }
      }
    };
    fetchShippingFee();
  }, [address.ward, address.district, cart.length]);

  const subtotal = cart.reduce((sum, item) => {
    const originalPrice = Number(item.product_id?.price) || 0;
    const discountedPrice =
      originalPrice * (1 - item.product_id?.discountPercentage / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  const discount = (subtotal * discountAmount) / 100;
  const totalAmount = (subtotal - discount + shippingFee).toFixed(0);

  const handleApplyCoupon = async () => {
    if (!coupon) return toast.error("Vui lòng nhập mã giảm giá!");
    try {
      const response = await draftOrderService.applyPromotion({
        promoCode: coupon.toUpperCase(),
      });
      setPromotionId(response.data._id);
      setDiscountAmount(response.data.discount_percentage);
      toast.success("Áp dụng mã giảm giá thành công");
    } catch (error) {
      toast.error(error.response?.data?.message || "Mã giảm giá không hợp lệ");
    }
  };

  const validateOrderData = () => {
    if (
      !address ||
      !address.street ||
      !phone ||
      !/^(0[1-9][0-9]{8})$/.test(phone) ||
      !name
    ) {
      toast.error("Vui lòng nhập thông tin giao hàng hợp lệ!");
      return false;
    }
    return true;
  };

  const handleCreateOrder = async (paymentType) => {
    if (isProcessing || !validateOrderData()) return;
    setIsProcessing(true);

    try {
      const orderData = {
        customerId: customer._id,
        totalPay: totalAmount,
        address: `${address.street}, ${address.ward.WardName}, ${address.district.DistrictName}, ${address.province.ProvinceName}`,
        phone,
        name,
        discounted: discount,
        shipping_price: shippingFee,
        payment_method: paymentType,
        promotionId,
      };

      const response = await draftOrderService.createOrder(orderData);
      localStorage.setItem("order", JSON.stringify(response.data));

      if (paymentType === "stripe" && response.data.data.Url) {
        window.location.href = response.data.data.Url;
      } else {
        toast.success(response.data.message);
        navigate("/success");
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "600px", mx: "auto", py: 6, px: { xs: 2, sm: 4 } }}>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 4 }}>
        <button
          onClick={() => navigate("/cart")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
        >
          Quay về Giỏ Hàng
        </button>
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          color: "grey.800",
          mb: 4,
        }}
      >
        Xác Nhận Đơn Hàng
      </Typography>
      <Card
        sx={{ mb: 4, borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "grey.700" }}
          >
            Tổng tiền hàng:{" "}
            <Typography component="span" sx={{ color: "grey.900" }}>
              {formatCurrency(subtotal)}
            </Typography>
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "grey.700", mt: 1 }}
          >
            Phí vận chuyển:{" "}
            <Typography component="span" sx={{ color: "grey.900" }}>
              {formatCurrency(shippingFee)}
            </Typography>
          </Typography>
          {discountAmount > 0 && (
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "success.main", mt: 1 }}
            >
              Giảm giá:{" "}
              <Typography component="span">
                {formatCurrency(discount)}
              </Typography>
            </Typography>
          )}
          <Divider sx={{ my: 2, bgcolor: "grey.300" }} />
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Tổng thanh toán:{" "}
            <Typography component="span">
              {formatCurrency(totalAmount)}
            </Typography>
          </Typography>
        </CardContent>
      </Card>
      <Card
        sx={{ mb: 4, borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "grey.800", mb: 2 }}
          >
            Thông Tin Giao Hàng
          </Typography>
          <AddressForm onAddressChange={setAddress} />
          <TextField
            fullWidth
            label="Tên người nhận"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": { borderColor: "primary.main" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
          <TextField
            fullWidth
            label="Số điện thoại"
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": { borderColor: "primary.main" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          label="Nhập mã giảm giá"
          variant="outlined"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "&:hover fieldset": { borderColor: "primary.main" },
              "&.Mui-focused fieldset": { borderColor: "primary.main" },
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleApplyCoupon}
          sx={{ px: 4, borderRadius: 2 }}
        >
          Áp dụng
        </Button>
      </Box>
      <Card
        sx={{ mb: 4, borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "grey.800", mb: 2 }}
          >
            Phương Thức Thanh Toán
          </Typography>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="cash"
              control={<Radio color="success" />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FaMoneyBill1Wave size={20} color="#2e7d32" />
                  <Typography>Tiền mặt</Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="stripe"
              control={<Radio color="primary" />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FaMoneyBill1Wave size={20} color="#673ab7" />
                  <Typography>Stripe</Typography>
                </Box>
              }
            />
          </RadioGroup>
        </CardContent>
      </Card>
      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={() => handleCreateOrder(paymentMethod)}
        disabled={isProcessing}
        sx={{
          py: 1.5,
          fontSize: "1rem",
          fontWeight: "bold",
          borderRadius: 2,
          "&:hover": {
            bgcolor: "success.dark",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          },
          transition: "all 0.3s ease",
        }}
      >
        {isProcessing ? "Đang xử lý..." : "Xác Nhận Đặt Hàng"}
      </Button>
    </Box>
  );
};

export default DraftOrder;
