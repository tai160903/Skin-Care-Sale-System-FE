import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../components/Loading";
import { useState, useEffect } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash, FaArrowLeftLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/slices/userSlice";
import authService from "../services/authService";

function Signin() {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.signin(data);
      if (response.data.status === 200) {
        const { user, accessToken, customer } = response.data;

        dispatch(
          login({
            user,
            token: accessToken,
            customer: customer,
          }),
        );
        toast.success(response.data.message);
        const redirectUrl = localStorage.getItem("redirectAfterLogin");
        localStorage.removeItem("redirectAfterLogin");
        if (redirectUrl) {
          navigate(redirectUrl);
          return;
        }
        switch (user.role) {
          case "customer":
            navigate("/");
            break;
          case "manager":
            navigate("/manager");
            break;
          case "staff":
            navigate("/staff");
            break;
          case "admin":
            navigate("/admin");
            break;
          default:
            navigate("/");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during login.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginGoogle = async () => {
    try {
      await authService.loginWithGoogle();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[url('assets/snowy-mountains.jpg')] bg-cover">
      <ToastContainer position="top-right" />
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full max-w-md mx-auto border-2 rounded-lg p-10 backdrop-blur-lg">
          <div
            className="flex justify-between items-center"
            onClick={() => navigate("/")}
          >
            <button onClick={() => navigate("/")}>
              <FaArrowLeftLong className="inline" /> Back to home
            </button>
            <h1 className="text-center text-2xl font-bold">Signin</h1>
          </div>
          <form onSubmit={handleSubmit} className="">
            <div className="flex justify-center m-5">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={data.email}
                onChange={handleChange}
                className="px-2 py-1 border-2 border-gray-700 rounded-md w-full"
                required
              />
            </div>
            <div className="flex justify-center m-5 relative">
              <input
                type={`${showPassword ? "text" : "password"}`}
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={handleChange}
                className="px-2 py-1 border-2 border-gray-700 rounded-md w-full"
                required
              />
              <div
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoEyeSharp className="text-lg" />
                ) : (
                  <FaEyeSlash className="text-lg" />
                )}
              </div>
            </div>
            <div>
              <Link to={"/forgot-password"}>Forgot Password?</Link>
            </div>
            <div className="my-5 flex justify-center  ">
              <button
                type="submit"
                className={`w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg ${!(data.email && data.password) ? "cursor-not-allowed bg-slate-500" : "transition "}`}
                disabled={!data.email || !data.password}
              >
                Submit
              </button>
            </div>
          </form>
          <div className="mt-4">
            <p className="text-sm">
              {`Don't have an account?`}
              <a
                href="/signup"
                className={`text-blue-600 underline hover:text-blue-800 ps-2 `}
              >
                Signup
              </a>
            </p>
          </div>
          <div className="py-5 flex items-center justify-between gap-4">
            <span className="w-1/2">
              <hr />
            </span>
            <p className="text-slate-600">OR</p>
            <span className="w-1/2">
              <hr />
            </span>
          </div>
          <div>
            <button
              onClick={handleLoginGoogle}
              className="flex justify-center mx-auto items-center gap-4 h-5 border-2 px-3 py-6 bg-white rounded-full"
            >
              <svg
                className="w-6 h-6"
                viewBox="-3 0 262 262"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
              >
                <path
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  fill="#4285F4"
                />
                <path
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  fill="#34A853"
                />
                <path
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  fill="#FBBC05"
                />
                <path
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  fill="#EB4335"
                />
              </svg>
              <p>Login with google</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signin;
