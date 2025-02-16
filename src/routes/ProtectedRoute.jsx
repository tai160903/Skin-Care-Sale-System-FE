import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "../redux/slices/userSlice";

function ProtectedRoute({ children, role }) {
  const user = useSelector(selectUser);

  if (!user || !user.user || !user.user.role) {
    return <Navigate to="/signin" />;
  }

  if (user.user.role !== role) {
    switch (user.user.role) {
      case "customer":
        return <Navigate to="/" replace />;
      case "manager":
        return <Navigate to="/manager" replace />;
      case "staff":
        return <Navigate to="/staff" replace />;
      case "admin":
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
