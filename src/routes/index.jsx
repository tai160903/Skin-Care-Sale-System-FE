import { createBrowserRouter } from "react-router-dom";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Verify from "../pages/Verify";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPass from "../pages/ResetPass";
import Layout from "../components/Layout";
import CustomerDashboard from "../pages/CustomerDashboard";
import StaffDashboard from "../pages/StaffDashboard";
import ManagerDashboard from "../pages/ManagerDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import Detail from "../Customer/Detail";
import Cart from "../Customer/Cart";
import SkinTypeQuiz from "../Customer/quiz";
import DraftOrder from "../Customer/DraftOrder";
import SuccessPayment from "../pages/SuccessPayment";
import Map from "../components/Header/Map";
import Blog from "../components/Header/Blog";
import OrTrack from "../components/Header/OrTrack";
import Profile from "../components/Header/Profile";
import Customer from "../components/Admin/Customer";
import BlogList from "../components/Admin/BlogList";
import QuizList from "../components/Admin/QuizList";
import PromoList from "../components/Admin/PromoList";
import ProductList from "../components/Admin/ProductList";
const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
        errorElement: <Error />,
      },
      {
        path: "signin",
        element: <Signin />,
      },
      {
        path: "signup",
        element: <Signup />,
      },

      {
        path: "verify-email",
        element: <Verify />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-reset-password",
        element: <ResetPass />,
      },
      {
        path: "question",
        element: <SkinTypeQuiz />,
      },
      {
        path: "order-tracking",
        element: <OrTrack />,
      },
      {
        path: "store-location",
        element: <Map />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "customer-dashboard",
        element: (
          <ProtectedRoute
            element={<CustomerDashboard />}
            allowedRoles={["customer"]}
          />
        ),
      },
      {
        path: "staff-dashboard",
        element: (
          <ProtectedRoute
            element={<StaffDashboard />}
            allowedRoles={["staff"]}
          />
        ),
      },
      {
        path: "manager-dashboard",
        element: (
          <ProtectedRoute
            element={<ManagerDashboard />}
            allowedRoles={["manager"]}
          />
        ),
      },
      {
        path: "product/:id",
        element: <Detail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <DraftOrder />,
      },
      {
        path: "success",
        element: <SuccessPayment />,
      },
    ],
  },
  {
    path: "admin",
    element: (
      // <ProtectedRoute role="admin">
      <AdminLayout />
      // </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <Customer />,
      },
      {
        path: "blog",
        element: <BlogList />,
      },
      {
        path: "faqs",
        element: <QuizList />,
      },
      {
        path: "promotions",
        element: <PromoList />,
      },
      {
        path: "products",
        element: <ProductList />,
      },
    ],
  },

  {
    path: "*",
    element: <Error />,
  },
]);

export default Router;
