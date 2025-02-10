import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "../redux/slices/userSlice";

function ProtectedRoute({ children, role }) {
  const user = useSelector(selectUser);
  console.log("user.user.role", user.user.role);

  if (!user || user.user.role !== role) {
    switch (user.user.role) {
      case "customer":
        return <Navigate to="/" />;
      case "manager":
        return <Navigate to="/manager" />;
      case "staff":
        return <Navigate to="/staff" />;
      case "admin":
        return <Navigate to="/admin" />;
      default:
        return <Navigate to="/" />;
    }
  }

  return children;
}

export default ProtectedRoute;
