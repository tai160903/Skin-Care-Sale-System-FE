import { createBrowserRouter } from "react-router-dom";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Verify from "../pages/Verify";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPass from "../pages/ResetPass";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import Detail from "../Customer/Detail";
import Cart from "../Customer/Cart";
import SkinTypeQuiz from "../Customer/quiz";
import DraftOrder from "../Customer/DraftOrder";
import SuccessPayment from "../pages/SuccessPayment";
import CancelPayment from "../pages/CancelPayment";
import Map from "../components/Header/Map";
import Blog from "../components/Header/Blog";
import BlogDetail from "../components/Header/BlogDetail";
import OrTrack from "../components/Header/OrTrack";
import ProfilePage from "../pages/ProfilePage";
import OrderHistory from "../pages/OrderHistory";
import User from "../components/Admin/User";
import BlogList from "../components/Admin/BlogList";
import QuizList from "../components/Admin/QuizList";
import PromoList from "../components/Admin/PromoList";
import ProductList from "../components/Admin/ProductList";
import OrdersTable from "../components/Admin/OrdersTable";
import Review from "../components/Admin/Review";
import ShipList from "../components/Admin/ShipList";
import StaffLayout from "../components/StaffLayout";
import OrderManagement from "../components/Staff/OrderManagement";
import ProductComparison from "../pages/ProductComparison";
import StaffList from "../components/Admin/StaffList";
import CustomerList from "../components/Admin/CustomerList";
import ProductManagement from "../components/Staff/ProductManagement";
import PromotionManagement from "../components/Staff/PromotionManagement";
import CustomerSupport from "../components/Staff/CustomerSupport";
import ShipManagement from "../components/Staff/ShipManagement";
import ProfileLayout from "../components/Header/ProfileLayout";
import OrderTracking from "../pages/OrderTracking";
import OrderDetail from "../Customer/OrderDetail";
import ChangePassword from "../pages/ChangePassword";
import Allproduct from "../pages/Allproduct";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home />, errorElement: <Error /> },
      { path: "signin", element: <Signin /> },
      { path: "signup", element: <Signup /> },
      { path: "all-products", element: <Allproduct /> },
      { path: "order-history/:customeId", element: <OrderHistory /> },
      { path: "verify-email", element: <Verify /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify-reset-password", element: <ResetPass /> },
      { path: "question", element: <SkinTypeQuiz /> },
      { path: "order-tracking/:customer_id", element: <OrTrack /> },
      { path: "store-location", element: <Map /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/:id", element: <BlogDetail /> },
      { path: "comparison", element: <ProductComparison /> },
      { path: "product/detail/:id", element: <Detail /> },
      { path: "/order-detail/:order_id", element: <OrderDetail /> },
      {
        path: "cart",
        element: (
          <ProtectedRoute allowedRoles={["customer"]}>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/:customerId",
        element: <ProfileLayout />,
        children: [
          { path: "", element: <ProfilePage /> },
          { path: "order-tracking", element: <OrderTracking /> },
          { path: "change-password", element: <ChangePassword /> },
        ],
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute allowedRoles={["customer"]}>
            <DraftOrder />
          </ProtectedRoute>
        ),
      },
      { path: "success", element: <SuccessPayment /> },
      { path: "cancel", element: <CancelPayment /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "users", element: <User /> },
      { path: "blog", element: <BlogList /> },
      { path: "faqs", element: <QuizList /> },
      { path: "promotions", element: <PromoList /> },
      { path: "products", element: <ProductList /> },
      { path: "orders", element: <OrdersTable /> },
      { path: "reviews", element: <Review /> },
      { path: "shipping", element: <ShipList /> },
      { path: "staff", element: <StaffList /> },
      { path: "customers", element: <CustomerList /> },
    ],
  },
  {
    path: "/staff",
    element: (
      <ProtectedRoute allowedRoles={["staff"]}>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "orders", element: <OrderManagement /> },
      { path: "products", element: <ProductManagement /> },
      { path: "promotions", element: <PromotionManagement /> },
      { path: "supportcustomers", element: <CustomerSupport /> },
      { path: "shipmanager", element: <ShipManagement /> },
    ],
  },
  { path: "*", element: <Error /> },
]);

export default Router;
