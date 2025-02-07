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
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

export default Router;
