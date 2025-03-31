/* eslint-disable react/prop-types */
import { Link, Outlet, useNavigate } from "react-router-dom";
import { GoPlus, GoHome } from "react-icons/go";
import { BsFilePost } from "react-icons/bs";
import { MdOutlineDashboard, MdOutlineSupervisorAccount } from "react-icons/md";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { TfiWrite } from "react-icons/tfi";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/authContext";
import { toast } from "react-toastify";
import { TbCategory } from "react-icons/tb";

const Admin = () => {
  const { user, logout, setOpenProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await logout();
      toast.success(res.data?.message || "Đăng xuất thành công");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full gap-5 p-5 bg-gray-100">
      {/* Bên trái */}
      <div className="flex flex-col w-64 min-h-screen p-4 bg-white shadow-md rounded-xl">
        <div className="flex items-center mb-8">
          <span className="text-xl font-bold text-[#e7423e]">Gemme.</span>
        </div>
        <button className="hover:bg-[#c73130] bg-[#e7423e] text-white py-2 px-4 rounded mb-8">
          <Link to={"/write"} className="flex items-center justify-center gap-2">
            <span>Bài viết mới</span> <GoPlus className="font-semibold size-5" />
          </Link>
        </button>

        <nav className="flex-1">
          <NavItem Icon={GoHome} label="Trang chủ" to={"/admin"} />
          <NavItem Icon={BsFilePost} label="Bài viết" to={"/admin/posts"} />
          <NavItem Icon={MdOutlineSupervisorAccount} label="Tài khoản" to={"/admin/accounts"} />
          <NavItem Icon={TbCategory} label="Danh mục" to={"/admin/categories"} />
          <div className="mt-10">
            <NavItem Icon={IoReturnDownBackOutline} label="Quay về trang chủ" to={"/"} />
          </div>
        </nav>
      </div>

      {/* Bên phải */}
      <div className="flex-1">
        {/* Header */}
        <header className="flex justify-between px-10 pb-5 border-b">
          <PersonDropdown user={user} handleLogout={handleLogout} setOpenProfile={setOpenProfile} />
        </header>

        {/* Nội dung */}
        <div className="p-5 mt-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

function NavItem({ Icon, label, to }) {
  return (
    <Link
      to={to}
      className="hover:text-[#e7423e] flex items-center py-2 px-4 mb-2 text-gray-600 hover:bg-[#fde8e7] rounded cursor-pointer gap-5"
    >
      <Icon className="size-5" />
      <span>{label}</span>
    </Link>
  );
}

const PersonDropdown = ({ user: { email, username, img, role }, handleLogout, setOpenProfile }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        ref.current && !ref.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button ref={buttonRef} className="flex items-center text-sm font-medium text-gray-700 rounded-full">
        <img className="object-cover w-8 h-8 mr-4 rounded-full" src={img} alt="user photo" />
        {username}
      </button>

      <div ref={ref} className={`z-10 absolute top-full ${open ? "block" : "hidden"} bg-white rounded-lg shadow w-44`}>
        <div className="px-4 py-3 text-sm text-gray-900">
          <div className="font-medium">{username}</div>
          <div className="truncate">{email}</div>
        </div>
        <ul className="px-1 py-2 text-sm text-gray-700">
          <li>
            <Link to={"/write"} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-[#e7423e] hover:bg-gray-100">
              <TfiWrite className="size-5" />
              <span>Viết bài</span>
            </Link>
          </li>
          {role === "admin" && (
            <li>
              <Link to={"/admin"} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-[#e7423e] hover:bg-gray-100">
                <MdOutlineDashboard className="size-5" />
                <span>Quản trị viên</span>
              </Link>
            </li>
          )}
          <li>
            <span onClick={() => { setOpenProfile(true); setOpen(false); }} className="block px-4 py-2 cursor-pointer hover:bg-gray-100">
              Hồ sơ
            </span>
          </li>
          <li>
            <Link onClick={() => setOpen(false)} to={"/my-posts"} className="block px-4 py-2 hover:bg-gray-100">
              Bài viết của tôi
            </Link>
          </li>
        </ul>
        <div className="py-2 cursor-pointer" onClick={handleLogout}>
          <span className="block px-4 py-2 text-sm font-medium text-[#e7423e] hover:bg-gray-100">
            Đăng xuất
          </span>
        </div>
      </div>
    </div>
  );
};

export default Admin;
