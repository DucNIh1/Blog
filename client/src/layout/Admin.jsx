/* eslint-disable react/prop-types */
import { Link, Outlet, useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { GoHome } from "react-icons/go";
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
      toast.success(res.data?.message || "Logout successfull");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-gray-100 flex gap-5 w-full p-5  ">
      {/* left */}
      <div className="w-64 bg-white p-4 flex flex-col rounded-xl min-h-screen">
        <div className="flex items-center mb-8">
          <span className="text-xl font-bold">Gemme.</span>
        </div>
        <button className="hover:bg-teal-950 bg-teal-600 text-white py-2 px-4 rounded mb-8 ">
          <Link
            to={"/write"}
            className="flex items-center justify-center gap-2"
          >
            <span>New post</span> <GoPlus className="size-5 font-semibold" />
          </Link>
        </button>

        <nav className="flex-1">
          <NavItem Icon={GoHome} label="Home" to={"/admin"} />
          <NavItem Icon={BsFilePost} label="Posts" to={"/admin/posts"} />
          <NavItem
            Icon={MdOutlineSupervisorAccount}
            label="Accounts"
            to={"/admin/accounts"}
          />
          <NavItem
            Icon={TbCategory}
            label="Categories"
            to={"/admin/categories"}
          />
          <div className=" mt-10">
            <NavItem
              Icon={IoReturnDownBackOutline}
              label="Back to home"
              to={"/"}
            />
          </div>
        </nav>

        <div className="mt-auto"></div>
      </div>

      {/* right */}
      <div className="flex-1">
        {/* header */}

        <header className="flex justify-between border-b pb-5 px-10">
          <PersonDropdown
            user={user}
            handleLogout={handleLogout}
            setOpenProfile={setOpenProfile}
          />
        </header>

        {/* Content */}
        <div className="p-5 mt-5 ">
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
      className="hover:text-teal-900 flex items-center py-2 px-4 mb-2 text-gray-600 hover:bg-teal-50 rounded cursor-pointer gap-5 "
    >
      <Icon className="size-5" />
      <span>{label}</span>
    </Link>
  );
}

const PersonDropdown = ({
  user: { email, username, img, role },
  handleLogout,
  setOpenProfile,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
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
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          className="flex items-center text-sm font-medium rounded-full text-primaryText "
          onClick={() => setOpen(() => setOpen((prev) => !prev))}
        >
          <img
            className="object-cover w-8 h-8 mr-4 rounded-full "
            src={img}
            alt="user photo"
          />
          {username}
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        <div
          ref={ref}
          className={`z-10 absolute top-full  ${
            open ? "block" : "hidden"
          } bg-white divide-y divide-gray-100 rounded-lg shadow w-44`}
        >
          <div className="px-4 py-3 text-sm text-gray-900 ">
            <div className="font-medium ">{username}</div>
            <div className="truncate">{email}</div>
          </div>
          <ul className="px-1 py-2 text-sm text-gray-700">
            <li>
              <Link
                to={"/write"}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2 font-medium text-teal-600 hover:bg-gray-100"
              >
                <TfiWrite className="size-5" />

                <span>Write</span>
              </Link>
            </li>
            {role === "admin" && (
              <li>
                <Link
                  to={"/admin"}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 font-medium text-teal-600 border-b hover:bg-gray-100"
                >
                  <MdOutlineDashboard className="size-5" />

                  <span>Admin </span>
                </Link>
              </li>
            )}
            <li>
              <span
                onClick={() => {
                  setOpenProfile(true);
                  setOpen(false);
                }}
                className="block px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                Profile
              </span>
            </li>
            <li>
              <Link
                onClick={() => setOpen(false)}
                to={"/my-posts"}
                className="block px-4 py-2 hover:bg-gray-100 "
              >
                My posts
              </Link>
            </li>
          </ul>
          <div className="py-2 cursor-pointer" onClick={handleLogout}>
            <span className="block px-4 py-2 text-sm font-medium text-teal-600 hover:bg-gray-100 ">
              Sign out
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
export default Admin;
