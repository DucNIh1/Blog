import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password)
      return toast.error("Vui lòng điển đẩy đủ thông tin đăng nhập")
    if (password.trim().length < 8)
      return toast.error("Mật khẩu phải chứa tối thiểu 8 kí tự")
    try {
      setIsLoading(true);
      const res = await login({ email: email, password: password });
      if (res.data.id) {
        toast.success(res.data?.message);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      navigate("/");
      toast.success(res.data?.message || "Đăng nhập thành công");
    } catch (error) {
      setIsLoading(false);
      toast.error("Tài khoản hoặc mật khẩu không chính xác");
    }
  };

  return (
    <>
      <div className="flex flex-col w-full h-screen p-5 lg:flex-row">
        <div className="flex items-center order-2 lg:w-1/2 lg:order-1">
          <form
            onSubmit={handleSubmit}
            className="mx-auto bg-white max-w-[400px] w-full flex flex-col items-center px-5 pt-10 pb-20 shadow-sm rounded-md "
          >
            <div className="mb-12 ">
              <h1 className="mb-5 text-3xl font-semibold uppercase text-slate-950">
                Đăng nhập
              </h1>
              <p className="text-sm font-normal text-slate-800">
                Coin68 là nơi cung cấp cái nhìn tổng quan nhanh và chính xác nhất về tiến bộ công nghệ blockchain trên toàn cầu.
              </p>
            </div>

            <div className="flex flex-col w-full gap-2 mb-12">
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
              <label htmlFor="password" className="">
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
                "Đăng nhập"
              )}
            </button>
            <p className="text-slate-600">
              Bạn chưa có tài khoản?{" "}
              <Link to={"/register"} className="font-medium text-[#E7423E]">
                Đăng kí
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

export default Login;
