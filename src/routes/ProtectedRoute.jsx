import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const user = useSelector((state) => state.user.user);

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/error" />;
  }

  return element;
};

export default ProtectedRoute;
