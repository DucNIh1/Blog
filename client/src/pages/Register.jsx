import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/authContext";
import VerifyEmail from "./VerifyEmail";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openVerify, setOpenVerify] = useState(false);
  const { register } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.length < 3)
      return toast.error("Username must be at least 3 characters");
    if (password.length < 8)
      return toast.error("Password must be at least 8 characters");

    try {
      setIsLoading(true);
      const res = await register({
        username: username,
        email: email,
        password: password,
      });
      setUserId(res.data?.id);
      setIsLoading(false);

      setOpenVerify(true);
      toast.success(res.data?.message || "Register successful");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error Register Failed");
    }
  };

  return (
    <>
      <div className="flex flex-col w-full h-screen p-5 lg:flex-row">
        <div className="flex items-center order-2 lg:w-1/2 md:order-2 lg:order-1">
          <form
            onSubmit={handleSubmit}
            className="mx-auto bg-white max-w-[400px] w-full flex flex-col items-center px-5 pt-10 pb-20 shadow-sm rounded-md "
          >
            <div className="mb-12 ">
              <h1 className="mb-5 text-3xl font-medium text-slate-950">
                Welcome to Website 👋
              </h1>
              <p className="text-sm font-normal text-slate-800">
                Today is a new day. It&apos;s your day. You shape it. Sign in to
                start managing your projects.
              </p>
            </div>

            <div className="flex flex-col w-full gap-2 mb-12">
              <div className="flex flex-col w-full gap-2 mb-5">
                <label htmlFor="username" className="">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 text-gray-800 transition-all duration-100 ease-linear border outline-none border-slate-200 rounded-xl bg-slate-50 focus:border-teal-500"
                  placeholder="At least 3 characters"
                />
              </div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-gray-800 transition-all duration-100 ease-linear border outline-none border-slate-200 rounded-xl bg-slate-50 focus:border-teal-500"
                placeholder="Email"
              />
            </div>
            <div className="flex flex-col w-full gap-2 mb-5">
              <label htmlFor="email" className="">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 text-gray-800 transition-all duration-100 ease-linear border outline-none border-slate-200 rounded-xl bg-slate-50 focus:border-teal-500"
                placeholder="At least 8 characters"
              />
            </div>

            <Link
              to="/forgot-password"
              className="block w-full mb-5 text-teal-800 text-end hover:text-teal-950"
            >
              Forgot Password?
            </Link>
            <button className="w-full px-6 py-2 mb-10 text-lg text-white rounded-md bg-teal-950 hover:bg-opacity-70">
              {isLoading ? (
                <div className="mx-auto w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                "Sign up"
              )}
            </button>

            <p className="text-slate-600">
              Already have an account?{" "}
              <Link to={"/login"} className="font-medium text-teal-600">
                Login
              </Link>
            </p>
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

      {openVerify && <VerifyEmail userId={userId} />}
    </>
  );
};

export default Register;
