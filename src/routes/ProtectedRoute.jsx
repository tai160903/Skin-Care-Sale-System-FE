import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "../redux/slices/userSlice";
import { toast } from "react-toastify";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = useSelector(selectUser)?.user;

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    toast.warning("Bạn không có quyền truy cập vào trang này!", {
      duration: 3000,
    });
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
