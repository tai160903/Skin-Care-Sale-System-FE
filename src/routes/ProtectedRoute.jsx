import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "../redux/slices/userSlice";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = useSelector(selectUser)?.user;

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={
          user.role === "manager"
            ? "/manager"
            : user.role === "staff"
              ? "/staff"
              : "/"
        }
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
