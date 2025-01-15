import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { toast } from "react-toastify";

function OtpModal({ email, closeModal }) {
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15);
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (event, index) => {
    const value = event.target.value.replace(/[^0-9]/g, "");
    if (value) {
      inputsRef.current[index].value = value;
      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = async () => {
    const otp = inputsRef.current.map((input) => input.value).join("");
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await authService.verifyOtp({ email, otp });
      console.log("response", response);
      console.log("response.data.message", response.message);
      if (response.status === 200) {
        localStorage.setItem(
          "accessToken",
          `Bearer ${response.data.accessToken}`,
        );
        toast.success(response.message);
        navigate("/");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleBackspace = (event, index) => {
    if (event.key === "Backspace" && !event.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (event) => {
    const pasteData = event.clipboardData.getData("text").slice(0, 6).split("");
    pasteData.forEach((char, index) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index].value = char;
      }
    });
  };

  const handleResentOtp = async () => {
    try {
      if (countdown > 0) {
        return;
      }
      const resentOtp = await authService.resendOtp({ email });
      if (resentOtp.status === 200) {
        setCountdown(15);
        toast.success(resentOtp.message);
      } else {
        toast.error(resentOtp.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={closeModal}
        >
          &times;
        </button>
        <p className="text-sm text-slate-600">
          Enter the 6-digit OTP sent to <strong>{email}</strong>
        </p>
        <div
          className="flex items-center space-x-2 mt-4 justify-center gap-3"
          onPaste={handlePaste}
        >
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputsRef.current[index] = el)}
              className="w-10 h-10 bg-transparent text-center placeholder:text-slate-400 text-slate-700 text-lg border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
            />
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">
          {"Did not receive the code? "}
          <span
            className={`font-bold  ${countdown > 0 ? "hidden" : "cursor-pointer inline-block"}`}
            onClick={handleResentOtp}
          >
            Resend
          </span>
          {countdown > 0
            ? `  ( ${Math.floor(countdown / 60)}:${(countdown % 60)
                .toString()
                .padStart(2, "0")} )`
            : ""}
        </p>
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default OtpModal;
