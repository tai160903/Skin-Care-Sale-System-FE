import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  const user = useSelector((state) => state.user.user);
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("access_token");

  if (accessToken) {
    localStorage.setItem("accessToken", `Bearer ${accessToken}`);
  }

  return (
    <div className="h-screen bg-slate-100">
      {user ? (
        <div>
          <h1>
            {user.email} - {user.role} - {user._id}
          </h1>
          {/* Other user data */}
        </div>
      ) : (
        <p>No user data found</p>
      )}
    </div>
  );
}

export default Home;
