/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { toast } from "react-toastify";
import axiosConfig from "../axios/config";
import { TfiWrite } from "react-icons/tfi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CiMenuFries } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Link as ScrollLink } from "react-scroll";
import { IoMdArrowRoundUp } from "react-icons/io";
import { MdOutlineDashboard } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { FaChevronDown } from "react-icons/fa";

const settings = {
  dots: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  pauseOnHover: false,
};

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
      toast.success(res.data?.message || "Logout successfull");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // xu li scroll
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
    <>
      {isVisible && (
        <ScrollLink
          to="top"
          smooth={true}
          duration={500}
          className="fixed top-2/3 right-5 z-[999]"
        >
          <IoMdArrowRoundUp className="cursor-pointer size-10 hover:opacity-85 z-[999] text-slate-950" />
        </ScrollLink>
      )}
      <header className="relative mb-20 overflow-hidden " id="top">
        <div className="">
          <Slider {...settings}>
            <div className="">
              <img
                src="https://res.cloudinary.com/dnjz0meqo/image/upload/v1731152313/vigpyhiahmdbahjzkapa.png"
                alt="A tall building with a dark sky background"
                className="object-cover w-full h-[500px]"
              />
            </div>
            <div className="">
              <img
                src="https://res.cloudinary.com/dnjz0meqo/image/upload/v1731220845/eqea8esptrinkgemqtr1.png"
                alt="A tall building with a dark sky background"
                className="object-cover w-full h-[500px]"
              />
            </div>
          </Slider>
        </div>

        <div className="absolute top-0 left-0 flex flex-col justify-between w-full h-full p-8 bg-opacity-50 lg:px-20 ">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center justify-between w-full py-5 mb-16 text-gray-900">
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
                  <Link to="/login" className="text-white hover:text-teal-500">
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
            </div>
          </div>

          <div className="text-white">
            <h2 className="text-4xl font-bold">
              I Like to Keep Things Simple to Appreciate the Details
            </h2>
            <p className="mt-2">
              Many years ago, I realized that my parents also run a video
              production company.
            </p>
          </div>

          <div className="flex items-center justify-between text-white">
            <span>25 June 2023</span>
          </div>
        </div>
      </header>
    </>
  );
};

const Nav = ({ categories = [] }) => {
  const [isOpenNav, setIsOpenNav] = useState(false);
  return (
    <div className="items-center hidden gap-5 lg:flex">
      <NavLink
        className={({ isActive }) =>
          `text-primaryText relative overflow-hidden
          after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] 
        after:bg-lightColor after:transition-all after:duration-500 
          ${isActive ? "after:w-full after:bg-lightColor" : "after:w-0"}
          hover:after:w-full hover:after:bg-lightColor hover:after:scale-100`
        }
        to={`/`}
      >
        HOME
      </NavLink>
      {categories.length > 0 &&
        categories.map((cat, index) => {
          if (index < 3)
            return (
              <NavLink
                key={index}
                className={({ isActive }) =>
                  `text-primaryText relative overflow-hidden
                        after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] 
                        after:bg-lightColor after:transition-all after:duration-500 
                        ${
                          isActive
                            ? "after:w-full after:bg-lightColor"
                            : "after:w-0"
                        }
                        hover:after:w-full hover:after:bg-lightColor hover:after:scale-100`
                }
                to={`/blog/${cat.id}`}
              >
                {cat.name.toUpperCase()}
              </NavLink>
            );
        })}

      <div
        className="relative inline-block ml-4"
        onMouseLeave={() => setIsOpenNav(false)}
      >
        <button
          onMouseOver={() => setIsOpenNav(true)}
          className="text-white uppercase flex items-center gap-2"
        >
          <span>More categories</span>
          <FaChevronDown />
        </button>

        {isOpenNav && (
          <div className="absolute z-10 bg-slate-950 divide-y divide-gray-100 rounded-lg shadow w-44 bg-opacity-20">
            <ul className="py-4 text-sm flex flex-col p-4 gap-3 ">
              {categories &&
                categories.map((cat, index) => {
                  if (index >= 3)
                    return (
                      <NavLink
                        key={cat.id}
                        className={({ isActive }) =>
                          `text-primaryText relative overflow-hidden
                        after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] 
                        after:bg-lightColor after:transition-all after:duration-500 
                        ${
                          isActive
                            ? "after:w-full after:bg-lightColor"
                            : "after:w-0"
                        }
                        hover:after:w-full hover:after:bg-lightColor hover:after:scale-100`
                        }
                        to={`/blog/${cat.id}`}
                      >
                        {cat.name.toUpperCase()}
                      </NavLink>
                    );
                })}
            </ul>
          </div>
        )}
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
              <Link
                onClick={() => setOpen(false)}
                to={"/account/edit-profile"}
                className="block px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setOpen(false)}
                to={"/my-posts/draft"}
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
            {" "}
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
                    className="block px-4 py-2 hover:text-teal-500  "
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
