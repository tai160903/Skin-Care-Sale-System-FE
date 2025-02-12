// import { useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { login } from "../redux/slices/userSlice";
// import axios from "axios";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/userSlice";

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");
    const user = JSON.parse(urlParams.get("user"));

    if (token && user) {
      dispatch(
        login({
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          token,
        }),
      );
    }
    setTimeout(() => {
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 1000);
  }, [dispatch]);

  return <div>Home Page</div>;
}

export default Home;
