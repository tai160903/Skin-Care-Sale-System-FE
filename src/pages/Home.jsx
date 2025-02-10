import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../redux/slices/userSlice";

function Home() {
  const user = useSelector(selectUser);
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("access_token");
  const dispatch = useDispatch();
  if (accessToken) {
    localStorage.setItem("accessToken", `Bearer ${accessToken}`);
  }
  const handleLogout = () => {
    dispatch(logout());
    // Optionally clear localStorage/sessionStorage as well
    localStorage.removeItem("persist:root"); // Removes persisted state
  };
  return (
    <div className="h-screen bg-slate-100">
      {user ? (
        <div>
          <h1>{JSON.stringify(user, null, 2)}</h1>
          <button onClick={handleLogout}>logout</button>
        </div>
      ) : (
        <p>No user data found</p>
      )}
    </div>
  );
}

export default Home;
