import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../redux/slices/orderSlice";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { FaMoneyBill1Wave, FaPaypal } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import AddressForm from "./AddressForm";
import shipfeeService from "../services/shipfeeService";
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
import draftOrderService from "../services/draftOrderService";

const DraftOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const customer = useSelector((state) => state.user.customer);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [coupon, setCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [address, setAddress] = useState(customer?.address || {});
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    if (address?.province && address?.district) {
      fetchShippingFee();
    }
  }, [address.province, address.district]);

  const fetchShippingFee = async () => {
    try {
      const response = await shipfeeService.getShipfee(
        address.province,
        address.district,
      );
      setShippingFee(response.data.shiping_price || 0);
    } catch (error) {
      toast.error("Lỗi khi lấy phí ship: " + error.message);
      setShippingFee(0);
    }
  };

  const totalAmount = cart.reduce((sum, item) => {
    const originalPrice = Number(item.product_id?.price) || 0;
    const discountRate = Number(item.product_id?.purchaseCount) || 0;
    const discountedPrice = originalPrice * (1 - discountRate / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  const handleApplyCoupon = async () => {
    try {
      const response = await draftOrderService.applyPromotion({
        promoCode: coupon.toUpperCase(),
      });
      if (response.status === 200) {
        setDiscountAmount(response.data.discount_percentage);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Mã giảm giá không hợp lệ" + error.message);
    }
  };

  const handleOrder = async (paymentType) => {
    if (!address?.province || !address?.district || !address?.ward || !phone) {
      toast.error("Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }
    if (!/^(0[1-9][0-9]{8})$/.test(phone)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }

    const orderData = {
      customer: customer._id,
      cart,
      totalAmount:
        totalAmount - (totalAmount * discountAmount) / 100 + shippingFee,
      address,
      phone,
      paymentMethod,
      status: "pending",
    };

    try {
      await dispatch(createOrder(orderData));
      toast.success("Đơn hàng đã được tạo thành công!");
      if (paymentType === "cash") navigate("/success");
    } catch (error) {
      toast.error("Lỗi khi tạo đơn hàng! " + error.message);
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
            Tổng thanh toán:{" "}
            {formatCurrency(
              totalAmount - (totalAmount * discountAmount) / 100 + shippingFee,
            )}
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
        <Button variant="contained" color="primary" onClick={handleApplyCoupon}>
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
              value="paypal"
              control={<Radio />}
              label={
                <>
                  <FaPaypal className="text-blue-500" /> PayPal
                </>
              }
            />
          </RadioGroup>
        </CardContent>
      </Card>
      {paymentMethod === "paypal" && (
        <PayPalScriptProvider options={{ "client-id": "your-client-id" }}>
          <PayPalButtons
            createOrder={(data, actions) =>
              actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: (
                        totalAmount -
                        discountAmount +
                        shippingFee
                      ).toFixed(0),
                    },
                  },
                ],
              })
            }
            onApprove={(data, actions) =>
              actions.order.capture().then(() => handleOrder("paypal"))
            }
          />
        </PayPalScriptProvider>
      )}
      <Button
        variant="contained"
        color="success"
        fullWidth
        className="mt-4 py-3"
        onClick={() => handleOrder(paymentMethod)}
      >
        Xác nhận đặt hàng
      </Button>
    </div>
  );
};

export default DraftOrder;
