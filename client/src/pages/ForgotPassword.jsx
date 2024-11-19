import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosConfig from "../axios/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Please enter your email address");
    try {
      setIsLoading(true);
      const res = await axiosConfig.post("/api/auth/forgot-password", {
        email,
      });
      setIsLoading(false);
      toast.success(res.data?.message);
    } catch (error) {
      setIsLoading(false);
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
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-gray-800 transition-all duration-100 ease-linear border outline-none border-slate-200 rounded-xl bg-slate-50 focus:border-teal-500"
                placeholder="Email"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="mb-10 hover:bg-teal-800 w-full bg-teal-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg  focus:outline-none focus:ring-2 focus:ring-teal-800 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send email"}
            </button>
            <p className="mb-10 text-slate-600">
              <Link to={"/login"} className="font-medium text-teal-600">
                <span className="text-slate-600">Oh, i remember now 🙊!</span>
                <span className="hover:text-sm transition-all ease-in-out duration-150">
                  Let&apos;s Login
                </span>
              </Link>
            </p>
          </form>
        </div>
        <div className="relative lg:w-1/2  w-full lg:h-full h-48 order-1 lg:order-2">
          <img
            src="https://res.cloudinary.com/dnjz0meqo/image/upload/v1731160325/mer8pqnrxqyj8en65xmn.png"
            alt=""
            className="object-cover h-full lg:w-full rounded-xl w-full "
          />
          <Link
            to={"/"}
            className="absolute px-6 py-2 text-lg font-medium text-teal-500 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg top-1/2 left-1/2 hover:bg-teal-200 hover:text-white"
          >
            Let explore
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
