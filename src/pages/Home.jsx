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

  return    <>
    <main className="min-h-screen bg-gray-100 py-10">
      <section className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-[#326f51]">Welcome to Our Website</h2>
        <p className="text-gray-600 mt-4">Discover our amazing services and features.</p>
        <button className="mt-6 bg-[#326f51] hover:bg-[#28573f] text-white px-6 py-3 rounded-lg shadow-md transition">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[1, 2, 3].map((item) => (
          <div key={item} className="shadow-lg p-6 bg-white rounded-lg text-center border border-gray-200 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-[#326f51]">Feature {item}</h3>
            <p className="text-gray-600 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        ))}
      </section>
    </main>
  </>;
}

export default Home;
