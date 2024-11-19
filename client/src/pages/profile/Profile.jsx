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
        console.log(res);
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
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="">
          <div className="flex mb-1">
            <h3 className="text-slate-950 text-lg ">{me?.username}</h3>
            <span className="text-[#dbdbde] mx-1">/</span>
            <h3 className="text-slate-950 text-lg first-letter:uppercase">
              {(pathname && pathname?.split("/")[2]?.split("-")?.join(" ")) ||
                "Edit Profile"}
            </h3>
          </div>
          <h2 className="text-sm text-[#6e6d7a]">
            Set up your Gemme presence{" "}
          </h2>
        </div>
      </div>
      <div className="flex gap-20 flex-col lg:flex-row">
        <div className="lg:w-1/4 w-full">
          <ul className="flex lg:flex-col flex-row w-full  lg:gap-2  justify-between flex-wrap gap-5">
            <li>
              <NavLink
                to={"edit-profile"}
                className={({ isActive }) =>
                  `text-[15px] text-slate-600 font-light hover:text-slate-950 ${
                    isActive ? "text-slate-950 font-medium" : ""
                  }`
                }
              >
                Edit Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"password"}
                className={({ isActive }) =>
                  `text-[15px] text-slate-600 font-light hover:text-slate-950 ${
                    isActive ? "text-slate-950 font-medium" : ""
                  } `
                }
              >
                Password
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"social-profiles"}
                className={({ isActive }) =>
                  `text-[15px] text-slate-600 font-light hover:text-slate-950 ${
                    isActive ? "text-slate-950 font-medium" : ""
                  }`
                }
              >
                Social Profiles
              </NavLink>
            </li>

            <li>
              <div className="h-[1px] bg-slate-300 w-full my-5"></div>
            </li>
            <li>
              <button
                onClick={() => setOpenDelete(true)}
                className="text-red-500 font-light hover:text-red-800"
              >
                Delete Account
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
        <div className="flex-1  px-5 pb-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Profile;
