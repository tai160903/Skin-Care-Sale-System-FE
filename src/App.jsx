import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Router from "./routes";
import { selectUser } from "./redux/slices/userSlice";

function App() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
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
