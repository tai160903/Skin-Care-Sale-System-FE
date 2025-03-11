import { useState } from "react";
import { toast } from "react-toastify";
import authService from "../services/authService";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaEyeSlash } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";

function ResetPass() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const userId = params.get("userId");

  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [data, setData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.verifyEmailResetPassword(
        userId,
        token,
        data,
      );

      if (response.status === 200) {
        toast.success(response.message);
        setLoading(false);
        navigate("/signin");
      } else {
        setLoading(false);
        toast.error(response.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[url('assets/snowy-mountains.jpg')] bg-cover">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full max-w-md mx-auto border-2 rounded-lg p-10 backdrop-blur-lg">
          <div
            className="flex justify-between items-center"
            onClick={() => navigate("/")}
          >
            <p className="cursor-pointer text-white hover:text-slate-200">
              <FaArrowLeftLong className="inline" /> Back to home
            </p>
            <h1 className="text-center text-2xl font-bold">Reset Password</h1>
          </div>
          <form onSubmit={handleSubmit} className="">
            <div className="flex justify-center m-5 relative">
              <input
                type={`${showNewPassword ? "text" : "password"}`}
                name="newPassword"
                placeholder="New password"
                value={data.newPassword}
                onChange={handleChange}
                className="px-2 py-1 border-2 border-gray-700 rounded-md w-full"
                required
              />
              <div
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <IoEyeSharp className="text-lg" />
                ) : (
                  <FaEyeSlash className="text-lg" />
                )}
              </div>
            </div>
            <div className="flex justify-center m-5 relative">
              <input
                type={`${showConfirmNewPassword ? "text" : "password"}`}
                name="confirmNewPassword"
                placeholder="Confirm new password"
                value={data.confirmNewPassword}
                onChange={handleChange}
                className="px-2 py-1 border-2 border-gray-700 rounded-md w-full"
                required
              />
              <div
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() =>
                  setShowConfirmNewPassword(!showConfirmNewPassword)
                }
              >
                {showConfirmNewPassword ? (
                  <IoEyeSharp className="text-lg" />
                ) : (
                  <FaEyeSlash className="text-lg" />
                )}
              </div>
            </div>
            <div className="my-5 flex justify-center  ">
              <button
                type="submit"
                className={`w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition ${!(data.newPassword && data.confirmNewPassword) ? "cursor-not-allowed bg-slate-500" : "transition "}`}
                disabled={!data.newPassword && !data.confirmNewPassword}
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

export default ResetPass;
