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
} from "@mui/material";
import { FaMoneyBill1Wave } from "react-icons/fa6";

const DraftOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const customer = useSelector((state) => state.user.customer);

  const [paymentMethod, setPaymentMethod] = useState("cash");
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
  }, [address.ward, address.district]);

  const totalAmount = cart.reduce((sum, item) => {
    const originalPrice = Number(item.product_id?.price) || 0;
    const discountedPrice =
      originalPrice * (1 - item.product_id?.discountPercentage / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  const discounted = (totalAmount * discountAmount) / 100;

  const finalAmount = (totalAmount - discounted + shippingFee).toFixed(0);

  const handleApplyCoupon = async () => {
    if (!coupon) return toast.error("Vui lòng nhập mã giảm giá!");
    try {
      const response = await draftOrderService.applyPromotion({
        promoCode: coupon.toUpperCase(),
      });
      setDiscountAmount(response.data.discount_percentage);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Mã giảm giá không hợp lệ");
    }
  };

  const validateOrderData = () => {
    if (!address || !phone || !/^(0[1-9][0-9]{8})$/.test(phone)) {
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
        totalPay: finalAmount,
        address: `${address.street}, ${address.ward.WardName}, ${address.district.DistrictName}, ${address.province.ProvinceName}`,
        phone,
        discounted,
        shipping_price: shippingFee,
        payment_method: paymentType,
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
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        Xác nhận đơn hàng
      </Typography>
      <Card className="shadow-md">
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            Tổng tiền hàng: {formatCurrency(totalAmount)}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            Phí vận chuyển: {formatCurrency(shippingFee)}
          </Typography>
          {discountAmount > 0 && (
            <Typography variant="h6" fontWeight="bold">
              Giảm giá: {formatCurrency((totalAmount * discountAmount) / 100)}
            </Typography>
          )}
          <Typography variant="h6" fontWeight="bold">
            Tổng thanh toán: {formatCurrency(finalAmount)}
          </Typography>
        </CardContent>
      </Card>
      <Card className="mt-4 shadow-md">
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            Thông tin khách hàng
          </Typography>
          <AddressForm onAddressChange={setAddress} />
          <TextField
            fullWidth
            label="Số điện thoại"
            variant="outlined"
            sx={{ mt: 2, mb: 2 }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2"
          />
        </CardContent>
      </Card>
      <Box display="flex" gap={1} mt={2}>
        <TextField
          fullWidth
          label="Nhập mã giảm giá"
          variant="outlined"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />
        <Button variant="contained" onClick={handleApplyCoupon}>
          Áp dụng
        </Button>
      </Box>
      <Card className="mt-4 shadow-md">
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            Phương thức thanh toán
          </Typography>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="cash"
              control={<Radio />}
              label={
                <>
                  <FaMoneyBill1Wave className="text-green-500" /> Tiền mặt
                </>
              }
            />
            <FormControlLabel
              value="stripe"
              control={<Radio />}
              label={
                <>
                  <FaMoneyBill1Wave className="text-purple-500" /> Stripe
                </>
              }
            />
          </RadioGroup>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="success"
        fullWidth
        className="mt-4 py-3"
        onClick={() => handleCreateOrder(paymentMethod)}
      >
        Xác nhận đặt hàng
      </Button>
    </div>
  );
};

export default DraftOrder;
