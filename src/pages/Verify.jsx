import { useEffect } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

function Verify() {
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("userId");
    if (token && userId) {
      authService
        .verifyEmail({ id: userId, token: token })
        .then(() => {
          confirm("verified");
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [navigate]);

  return <div>Verify</div>;
}

export default Verify;
