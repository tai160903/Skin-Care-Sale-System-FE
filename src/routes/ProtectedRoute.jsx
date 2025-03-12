import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "../redux/slices/userSlice";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = useSelector(selectUser);

  // If there is no user and allowedRoles contains 'guest', allow the route for guests
  if (!user && allowedRoles.includes("guest")) {
    return children;
  }

  // If the user is not authenticated and does not match any allowed role, redirect to sign-in page
  if (!user || !user.user || !user.user.role) {
    return <Navigate to="/signin" />;
  }

  // If the user's role doesn't match the required role, redirect accordingly
  if (allowedRoles.length && !allowedRoles.includes(user.user.role)) {
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
