import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosConfig from "../axios/config";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { search, pathname } = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = search.split("=")[1];
    const token = pathname.split("/")[2];

    if (newPassword.length < 8)
      return toast.error("Password must be at least 8 characters!");
    if (newPassword !== confirmPassword)
      return toast.error("Confirm password does not match!");

    try {
      setIsLoading(true);
      const res = await axiosConfig.post(`/api/auth/reset-password/${token}`, {
        password: newPassword,
        userId: userId,
      });
      setIsLoading(false);
      navigate("/");
      toast.success(res.data?.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data?.message || "Something went wrong😥");
    }
  };

  return (
    <>
      <div className="flex flex-col w-full h-screen p-5 lg:flex-row">
        <div className="flex items-center lg:w-1/2 order-2 lg:order-1">
          <form
            onSubmit={handleSubmit}
            className="mx-auto bg-white max-w-[400px] w-full flex flex-col items-center px-5 pt-10 pb-20 shadow-sm rounded-md "
          >
            <div className="mb-12 ">
              <h1 className="mb-5 text-3xl font-medium text-slate-950">
                Forgot password 😫
              </h1>
              <p className="text-sm font-normal text-slate-800">
                Please enter your email to get started!. Then check your email
                for further instructions
              </p>
            </div>

            <div className="flex flex-col w-full gap-2 mb-12">
              <label htmlFor="email">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 text-gray-800 transition-all duration-100 ease-linear border outline-none border-slate-200 rounded-xl bg-slate-50 focus:border-teal-500"
                placeholder="new password"
              />
            </div>
            <div className="flex flex-col w-full gap-2 mb-12">
              <label htmlFor="email">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 text-gray-800 transition-all duration-100 ease-linear border outline-none border-slate-200 rounded-xl bg-slate-50 focus:border-teal-500"
                placeholder="confirm password"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="hover:bg-teal-800 w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg  focus:outline-none focus:ring-2 focus:ring-teal-800 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send email"}
            </button>
          </form>
        </div>
        <div className="relative lg:w-1/2  w-full lg:h-full h-48 order-1 lg:order-2">
          <img
            src="https://res.cloudinary.com/dnjz0meqo/image/upload/v1732017444/wdum4k8pkefzqdnzxsny.gif"
            alt=""
            className="object-cover h-full lg:w-full rounded-xl w-full "
          />
          <Link
            to={"/"}
            className="absolute px-6 py-2 text-lg font-medium text-teal-500 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg top-1/2 left-1/2 hover:bg-teal-600 hover:text-white"
          >
            Let explore
          </Link>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
