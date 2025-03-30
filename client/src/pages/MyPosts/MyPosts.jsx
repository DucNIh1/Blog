import { useEffect, useRef } from "react";
import { NavLink, Outlet } from "react-router-dom";

const MyPosts = () => {
  const locationRef = useRef(null);

  useEffect(() => {
    if (locationRef.current) {
      locationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  return (
    <div className="mb-20">
      <h1 className="mb-10 text-2xl font-medium text-slate-900">Bài đăng của tôi</h1>
      <div className="flex gap-5 mb-10" ref={locationRef}>
        <NavLink
          to={"draft"}
          className="bg-slate-800 text-white font-medium rounded-sm text-sm px-5 py-2.5 text-center me-2 mb-2 hover:bg-slate-950"
        >
          Bản nháp
        </NavLink>

        <NavLink
          to={"published"}
          className=" font-medium rounded-sm text-sm px-5 py-2.5 text-center me-2 mb-2 bg-blue-800 text-white hover:bg-blue-950"
        >
          Đã xuất bản
        </NavLink>
      </div>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default MyPosts;
