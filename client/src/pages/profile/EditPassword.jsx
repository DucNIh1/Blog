import { useState } from "react";
import axiosConfig from "../../axios/config";
import { toast } from "react-toastify";

const EditPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword) {
        toast.info("Please fill all required fields");
        return;
      }

      const res = await axiosConfig.patch("/api/auth/update-password", {
        currentPassword,
        newPassword,
      });
      toast.success(res.data?.message || "Change Password Successfully");
    } catch (error) {
      toast.info(error.response?.data?.message);
    }
  };
  return (
    <div>
      <div className="w-full mt-2 ">
        <div className="flex flex-col w-full gap-2 mb-5">
          <label htmlFor="email" className=" text-slate-900 font-medium">
            Old password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 text-sm text-gray-800 transition-all duration-100 ease-linear border rounded-xl outline-none  focus:border-teal-500 focus:ring-1 focus:ring-offset-1 focus:ring-teal-200"
            placeholder="At least 8 characters"
          />
        </div>
        <div className="flex flex-col w-full gap-2 mb-10 ">
          <label htmlFor="email" className="text-slate-900 font-medium">
            Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 text-sm text-gray-800 transition-all duration-100 ease-linear border rounded-xl outline-none focus:border-teal-500 focus:ring-1 focus:ring-offset-1 focus:ring-teal-200 "
          />
          <span className="text-[#9e9ea7] text-sm font-light">
            Minimum 8 characters
          </span>
        </div>

        <button
          onClick={handleChangePassword}
          className="max-w-[200px] block ml-auto text-sm font-medium hover:bg-opacity-70 px-4 py-2 rounded-3xl bg-slate-950 text-primaryText"
        >
          Change
        </button>
      </div>
    </div>
  );
};

export default EditPassword;
