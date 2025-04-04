/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { toast } from "react-toastify";
import axiosConfig from "../axios/config";
import { TfiWrite } from "react-icons/tfi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CiMenuFries } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Link as ScrollLink } from "react-scroll";
import { IoMdArrowRoundUp } from "react-icons/io";
import { MdOutlineDashboard } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { FaChevronDown } from "react-icons/fa";

const NAV_LINKS = [
  {
    "title": "Trang chủ",
    "to": "/"
  },

  {
    "title": "Nổi bật",
    "to": "/featured"
  },
  {
    "title": "GEMME TV",
    "to": "/tv"
  },
]

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false); // scroll
  const [openMobile, setOpenMobile] = useState(false);
  const navigate = useNavigate();

  const { data: categories } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      try {
        const res = await axiosConfig.get("/api/category", {
          params: {
            limit: 1000,
            isActive: 1,
          },
        });
        return res.data?.categories || [];
      } catch (err) {
        console.log(err);
      }
    },
  });

  const handleLogout = async () => {
    try {
      const res = await logout();
      toast.success("Đăng xuất thành công");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <React.Fragment>
      {isVisible && (
        <ScrollLink
          to="top"
          smooth={true}
          duration={500}
          className="fixed bottom-5 right-5 z-[999] bg-black p-3 rounded-lg"
        >
          <IoMdArrowRoundUp className="cursor-pointer size-5 hover:opacity-85 z-[999] text-white" />
        </ScrollLink>
      )}
      <header className="flex items-center justify-between w-full px-20 text-gray-900 fixed top-0 left-0 z-50 bg-[#e44241]">
        <h1 className="text-2xl font-bold text-primaryText">
          <Link to={"/"}>GEMME.</Link>
        </h1>
        <Nav categories={categories} />
        <div className="items-center hidden gap-5 lg:flex">
          {user ? (
            <>
              <PersonDropdown user={user} handleLogout={handleLogout} />
            </>
          ) : (
            <Link to="/login" className="text-white px-6 py-2 bg-black rounded-md hover:text-[#e44241] hover:bg-white transition-colors">
              Login
            </Link>
          )}
        </div>
        <CiMenuFries
          className="block font-medium cursor-pointer lg:hidden text-primaryText size-8"
          onClick={() => setOpenMobile(true)}
        />
        <MobileMenu
          to={"/my-posts"}
          handleLogout={handleLogout}
          user={user}
          openMobile={openMobile}
          setOpenMobile={setOpenMobile}
          categories={categories}
        />
      </header>
    </React.Fragment>
  );
};

const Nav = ({ categories = [] }) => {
  return (
    <div className="items-center hidden lg:flex">
      {NAV_LINKS.map(link => {
        return (
          <NavLink key={link.title} to={link.to} className="text-primaryText hover:bg-[#c2150f] transition-colors p-5">
            {link.title}
          </NavLink>
        )
      })}
      <div className="group">
        <NavLink
          className={`text-primaryText overflow-hidden flex items-center gap-2 group-hover:bg-[#c2150f] hover:bg-[#c2150f] transition-colors p-5`}
          to={`/`}
        >
          <span>Danh mục</span>
          <FaChevronDown size={10} />
        </NavLink>
        <div className="absolute top-full left-0 h-auto bg-[#c2150f] text-primaryText w-full hidden group-hover:flex items-center justify-center gap-4">
          {categories.map(cat => {
            return <Link key={cat.id} to={`/blog/${cat.id}`} className="inline-flex p-4">{cat.name}</Link>
          })}
        </div>
      </div>
    </div>
  );
};

const PersonDropdown = ({
  user: { email, username, img, role },
  handleLogout,
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
          className={`z-10 absolute top-full  ${open ? "block" : "hidden"
            } bg-white divide-y divide-gray-100 rounded-lg shadow w-44`}
        >
          <div className="px-4 py-3 text-sm text-gray-900 ">
            <div className="font-medium ">{username}</div>
            <div className="truncate">{email}</div>
          </div>
          <ul className="px-1 py-2 text-sm text-gray-700">

            {role === "admin" && (
              <>
                <li>
                  <Link
                    to={"/write"}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 font-medium text-[#E7423E] hover:bg-gray-100"
                  >
                    <TfiWrite className="size-5" />

                    <span>Viết bài</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/admin"}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 font-medium text-[#E7423E] border-b hover:bg-gray-100"
                  >
                    <MdOutlineDashboard className="size-5" />
                    <span>Admin </span>
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => setOpen(false)}
                    to={"/my-posts/draft"}
                    className="block px-4 py-2 hover:bg-gray-100 "
                  >
                    Bài viết của tôi
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                onClick={() => setOpen(false)}
                to={"/account/edit-profile"}
                className="block px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                Thông tin cá nhân
              </Link>
            </li>

          </ul>
          <div className="py-2 cursor-pointer" onClick={handleLogout}>
            <span className="block px-4 py-2 text-sm font-medium text-[#E7423E] hover:bg-gray-100 ">
              Đăng xuất
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

const MobileMenu = ({
  openMobile,
  setOpenMobile,
  categories,
  user,
  handleLogout,
}) => {
  return (
    <>
      {openMobile && (
        <div className="fixed w-[80%] md:w-[60%] lg:w-[30%] top-0 right-0 bottom-0 bg-slate-900 bg-opacity-90 shadow-md z-50 p-5">
          <IoCloseCircleOutline
            className="absolute cursor-pointer top-5 right-5 text-primaryText size-8 hover:scale-110 hover:text-red-200"
            onClick={() => setOpenMobile(false)}
          />
          <h2 className="mt-10 text-xl uppercase text-lightColor ">
            Categories
          </h2>
          <div className="flex flex-col gap-5 mt-10">
            {categories.map((cat) => (
              <Link
                to={`/blog/${cat?.id}`}
                className="text-primaryText"
                key={cat?.id}
                onClick={() => {
                  setOpenMobile(false);
                }}
              >
                {cat?.name}
              </Link>
            ))}
          </div>

          {user && (
            <>
              <ul className="py-2 mt-5 text-sm border-t text-primaryText border-lightColor">
                <li>
                  <Link
                    onClick={() => {
                      setOpenMobile(false);
                    }}
                    to={"/write"}
                    className="flex items-center gap-3 px-4 py-2 font-medium text-teal-200 "
                  >
                    <TfiWrite />

                    <span>Write</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to={"/account/edit-profile"}
                    className="block px-4 py-2 cursor-pointer hover:text-teal-500 "
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => {
                      setOpenMobile(false);
                    }}
                    to={"/my-posts/draft"}
                    className="block px-4 py-2 hover:text-teal-500 "
                  >
                    My posts
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={handleLogout}
                    className="block px-4 py-2 hover:text-teal-500 "
                  >
                    logout
                  </Link>
                </li>
              </ul>
            </>
          )}
        </div>
      )}
    </>
  );
};
export default Navbar;
