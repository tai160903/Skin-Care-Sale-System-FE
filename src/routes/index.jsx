import { createBrowserRouter } from "react-router-dom";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Verify from "../pages/Verify";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPass from "../pages/ResetPass";
import Layout from "../components/Layout";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
        errorElement: <Error />,
        context: { showHeader: true, showFooter: true },
      },
      {
        path: "signin",
        element: <Signin />,
        context: { showHeader: false, showFooter: true },
      },
      {
        path: "signup",
        element: <Signup />,
        context: { showHeader: true, showFooter: true },
      },
      {
        path: "verify-email",
        element: <Verify />,
        context: { showHeader: true, showFooter: true },
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
        context: { showHeader: false, showFooter: false },
      },
      {
        path: "verify-reset-password",
        element: <ResetPass />,
      },
      {
        path: "",
      },
      {
        path: "*",
        element: <Error />,
        context: { showHeader: false, showFooter: false },
      },
    ],
  },
]);

export default Router;
