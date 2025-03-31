import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import axiosConfig from "../../axios/config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import DeleteModal from "../../components/DeleteModal";

const Profile = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const { logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data: me } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const res = await axiosConfig.get("/api/users/get-me");
        return res.data?.user;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const deleteMeMutation = useMutation({
    mutationFn: async () => {
      try {
        const res = await axiosConfig.delete("/api/users/delete-me");
        await logout();
        navigate("/login");
        toast.success(res.data?.message || "Deleted account successfully😥");
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="w-full max-w-4xl mx-auto my-20">
      <div className="flex gap-5 mb-10">
        <img
          src={me?.img}
          alt=""
          className="object-cover w-12 h-12 rounded-full"
        />
        <div className="">
          <div className="flex mb-1">
            <h3 className="text-lg text-slate-950 ">{me?.username}</h3>
            <span className="text-[#dbdbde] mx-1">/</span>
            <h3 className="text-lg text-slate-950 first-letter:uppercase">
              {pathname === '/account/social-profiles' && <h1>Liên kết mạng xã hội,</h1>}
              {pathname === '/account/edit-profile' && <h1>Cập nhật tiểu sử</h1>}
              {pathname === '/account/password' && <h1>Mật khẩu</h1>}
            </h3>
          </div>
          <h2 className="text-sm text-[#6e6d7a]">
            Thiết lập lại thông tin hồ sơ của bạn
          </h2>
        </div>
      </div>
      <div className="flex flex-col gap-20 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <ul className="flex flex-row flex-wrap justify-between w-full gap-5 lg:flex-col lg:gap-2">
            <li>
              <NavLink
                to={"edit-profile"}
                className={({ isActive }) =>
                  `text-[15px] text-slate-600 font-light hover:text-slate-950 ${isActive ? "text-slate-950 font-medium" : ""
                  }`
                }
              >
                Cập nhật tiểu sử
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"password"}
                className={({ isActive }) =>
                  `text-[15px] text-slate-600 font-light hover:text-slate-950 ${isActive ? "text-slate-950 font-medium" : ""
                  } `
                }
              >
                Mật khẩu
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"social-profiles"}
                className={({ isActive }) =>
                  `text-[15px] text-slate-600 font-light hover:text-slate-950 ${isActive ? "text-slate-950 font-medium" : ""
                  }`
                }
              >
                Liên kết mạng xã hội
              </NavLink>
            </li>

            <li>
              <div className="h-[1px] bg-slate-300 w-full my-5"></div>
            </li>
            <li>
              <button
                onClick={() => setOpenDelete(true)}
                className="font-light text-[#e7423e] hover:text-[#ac3533]"
              >
                Xóa tài khoản
              </button>

              <DeleteModal
                open={openDelete}
                setOpen={setOpenDelete}
                onClick={deleteMeMutation.mutate}
                title="We’re sorry to see you go😥"
              />
            </li>
          </ul>
        </div>
        <div className="flex-1 px-5 pb-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Profile;
