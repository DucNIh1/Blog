import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosConfig from "../axios/config";
import { AuthContext } from "../context/authContext";

// eslint-disable-next-line react/prop-types
const VerifyEmail = ({ userId }) => {
  const { setUser } = useContext(AuthContext);

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axiosConfig.post(
        `/api/auth/verify-email?userId=${userId}`,
        {
          code: code.join(""),
        }
      );
      console.log(res);
      setIsLoading(false);
      setUser(res.data?.user);
      toast.success(res.data?.message);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      // Nếu nhập 1 số
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25">
      <div className="bg-black bg-opacity-90 rounded-2xl shadow-2xl md:p-10 p-6 w-[80%] md:max-w-md   top-1/2 -translate-y-1/2  absolute py-16  left-1/2  -translate-x-1/2">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          veirfy your email
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit number sent via email.
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="6"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="md:w-12 md:h-12  w-9 h-9   text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-teal-500 focus:outline-none"
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg  focus:outline-none focus:ring-2 focus:ring-teal-800 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "verify email"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default VerifyEmail;
