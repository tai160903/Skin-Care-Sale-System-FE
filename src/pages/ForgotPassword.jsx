import { useState } from "react";
import { toast } from "react-toastify";
import authService from "../services/authService";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaCheck } from "react-icons/fa6";

function ForgotPassword() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
  });

  const handleChange = (event) =>
    setData({ ...data, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await authService.forgotPassword(data.email);
      toast.success(response.message);
      setStatus(response.status);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[url('assets/snowy-mountains.jpg')] bg-cover">
      {loading ? (
        <Loading />
      ) : status === 200 ? (
        <div className="w-full max-w-md mx-auto border-2 rounded-lg p-10 backdrop-blur-lg">
          <div className="flex flex-col items-center justify-center gap-10 w-full">
            <FaCheck className="size-20 text-green-500" />
            <p className="text-lg text-white">
              Verify link sent! Please check your email
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto border-2 rounded-lg p-10 backdrop-blur-lg">
          <div
            className="flex justify-between items-center"
            onClick={() => navigate("/signin")}
          >
            <p className="cursor-pointer text-white hover:text-slate-300">
              <FaArrowLeftLong className="inline" /> Back to Signin
            </p>
            <h1 className="text-center text-2xl font-bold">Forgot Password</h1>
          </div>
          <form onSubmit={handleSubmit}>
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
            <div className="my-5 flex justify-center ">
              <button
                type="submit"
                className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
