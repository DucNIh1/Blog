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
          <label htmlFor="email" className="font-medium text-slate-900">
            Mật khẩu cũ
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 text-sm text-gray-800 transition-all duration-100 ease-linear border outline-none rounded-xl focus:border-[#e7423e]"
            placeholder="ít nhất 8 kí tự"
          />
        </div>
        <div className="flex flex-col w-full gap-2 mb-10 ">
          <label htmlFor="email" className="font-medium text-slate-900">
            Mật khẩu mới
          </label>
          <input
            type="password"
            value={newPassword}
            placeholder="ít nhất 8 kí tự"
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 text-sm text-gray-800 transition-all duration-100 ease-linear border outline-none rounded-xl focus:border-[#e7423e] "
          />
        </div>

        <button
          onClick={handleChangePassword}
          className="max-w-[200px] block ml-auto text-sm font-medium hover:bg-opacity-70 px-4 py-2 rounded-3xl bg-slate-950 text-primaryText"
        >
          Thay đổi
        </button>
      </div>
    </div>
  );
};

export default EditPassword;
