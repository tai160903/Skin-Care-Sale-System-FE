import { createBrowserRouter } from "react-router-dom";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Verify from "../pages/Verify";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPass from "../pages/ResetPass";
import Layout from "../components/Layout";
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
        path: "manager",
        element: (
          <ProtectedRoute role="manager">
            <ManagerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "staff",
        element: (
          <ProtectedRoute role="staff">
            <StaffDashboard />
          </ProtectedRoute>
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
