import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Router from "./routes";

function App() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect to a role-based route after login
      switch (user.role) {
        case "customer":
          navigate("/customer-dashboard");
          break;
        case "staff":
          navigate("/staff-dashboard");
          break;
        case "manager":
          navigate("/manager-dashboard");
          break;
        case "guest":
          navigate("/guest-dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, navigate]);

  return (
    <>
      <Router />
      <ToastContainer limit={4} autoClose={1000} stacked />
    </>
  );
}

export default App;
