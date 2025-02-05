import { useSearchParams } from "react-router-dom";

function Home() {
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("access_token");

  if (accessToken) {
    localStorage.setItem("accessToken", `Bearer ${accessToken}`);
  }

  return <div className="h-screen bg-slate-100">home</div>;
}

export default Home;
