import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/authContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.length < 3)
      return toast.error("Họ và tên phải có ít nhất 3 ký tự");
    if (password.length < 8)
      return toast.error("Mật khẩu phải chứa tối thiểu 8 kí tự");

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
      navigate('/login')
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
              <h1 className="mb-5 text-3xl font-semibold uppercase text-slate-950">
                Đăng kí
              </h1>
              <p className="text-sm font-normal text-slate-800">
                Coin68 là nơi cung cấp cái nhìn tổng quan nhanh và chính xác nhất về tiến bộ công nghệ blockchain trên toàn cầu.
              </p>
            </div>

            <div className="flex flex-col w-full gap-2 mb-12">
              <div className="flex flex-col w-full gap-2 mb-5">
                <label htmlFor="username" className="">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 text-gray-800 transition-all duration-100 ease-linear border outline-none border-slate-200 rounded-lg bg-slate-50 focus:border-[#ff2d55]"

                  placeholder="Tối thiểu 3 kí tự"
                />
              </div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-gray-800 transition-all duration-100 ease-linear border outline-none border-slate-200 rounded-lg bg-slate-50 focus:border-[#ff2d55]"

                placeholder="Email"
              />
            </div>
            <div className="flex flex-col w-full gap-2 mb-5">
              <label htmlFor="email" className="">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 text-gray-800 transition-all duration-100 ease-linear border outline-none border-slate-200 rounded-lg bg-slate-50 focus:border-[#ff2d55]"

                placeholder="Tối thiểu 8 kí tự"
              />
            </div>
            <button className="w-full px-6 py-2 mb-10 mt-5 text-lg text-white rounded-md bg-[#E7423E] hover:bg-[#ad2a28] transition-all duration-150">
              {isLoading ? (
                <div className="w-8 h-8 mx-auto border-2 border-white rounded-full border-t-transparent animate-spin"></div>
              ) : (
                "Đăng kí"
              )}
            </button>

            <p className="text-slate-600">
              Bạn đã có tài khoản?{" "}
              <Link to={"/login"} className="font-medium text-[#E7423E]">
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
        <div className="relative order-1 w-full h-48 lg:w-1/2 lg:h-full lg:order-2">
          <img
            src="/login.jpg"
            alt=""
            className="object-cover w-full h-full lg:w-full rounded-xl "
          />

        </div>
      </div>

    </>
  );
};

export default Register;
