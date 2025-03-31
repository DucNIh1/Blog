import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosConfig from "../../axios/config";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";

const EditProfile = () => {
  const { setUser, user } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [username, setUsername] = useState(null);
  const [birth, setBirth] = useState(null);
  const [gender, setGender] = useState(null);
  const [bio, setBio] = useState(null);
  const [profession, setProfession] = useState(null);

  const queryClient = useQueryClient();

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

  const { data: countries } = useQuery({
    queryFn: async () => {
      try {
        const res = await axios.get(
          "https://countriesnow.space/api/v0.1/countries/flag/images",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(res);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  // Khi người dùng chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImg(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const updateAvatarMutation = useMutation({
    mutationFn: async () => {
      try {
        const data = new FormData();
        data.append("image", selectedImg);

        toast.info("Vui lòng chờ một chút...");

        const res = await axiosConfig.post(`/api/upload`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await axiosConfig.put("/api/users/profile", {
          img: res.data?.data?.secure_url,
        });
        setUser({ ...user, img: res.data?.data?.secure_url });
        setSelectedImg(null);
        toast.success("Cập nhật ảnh đại diện thành công");
      } catch (error) {
        toast.error("Lỗi khi cập nhật ảnh đại diện");
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      try {
        const res = await axiosConfig.put("/api/users/profile", {
          username,
          birth_date: birth,
          gender,
          bio,
          profession,
          country: selectedCountry?.name,
        });
        console.log(res);
        toast.success(res.data?.message);
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });

  useEffect(() => {
    setUsername(me?.username || null);
    const birthDate = me?.birth_date
      ? new Date(
        new Date(me.birth_date).toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
        })
      )
      : null;
    setBirth(birthDate ? birthDate.toISOString().split("T")[0] : null);

    setGender(me?.gender || null);
    setBio(me?.bio || null);
    setSelectedCountry(me?.country || {});
    setProfession(me?.profession || null);
  }, [me]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-5 mb-5">
        <input
          type="file"
          name="image"
          id="image"
          className="hidden"
          onChange={handleImageChange}
        />
        <img
          src={previewImage || me?.img}
          alt=""
          className="object-cover w-20 h-20 rounded-full"
        />
        <label
          htmlFor="image"
          className="flex items-center px-5 py-2 text-sm font-medium transition-all duration-100 ease-in-out border cursor-pointer border-slate-300 rounded-3xl hover:border-[#e7423e]"
        >
          Tải lên ảnh mới
        </label>
        <button
          onClick={updateAvatarMutation.mutate}
          className="bg-[#f8f7f4] text-sm font-medium rounded-2xl px-5 text-slate-900 py-2 hover:bg-slate-900 hover:text-primaryText"
        >
          Lưu
        </button>
      </div>
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          updateProfileMutation.mutate();
        }}
      >
        {/* Tên */}
        <div className="flex flex-col gap-2">
          <label htmlFor="username">Tên</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            type="text"
            className="w-full px-6 py-2 text-sm border border-gray-200 rounded-lg outline-none text-slate-900 focus:border-[#e7423e]  "
          />
        </div>

        {/* Ngày sinh */}
        <div className="flex flex-col gap-2">
          <label htmlFor="birth">Ngày sinh</label>
          <input
            id="birth"
            type="date"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            className="w-full px-6 py-2 text-sm border border-gray-200 rounded-lg outline-none text-slate-900 focus:border-[#e7423e]  "
          />
        </div>

        {/* Giới tính */}
        <div className="flex flex-col gap-2">
          <label htmlFor="gender">Giới tính</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            name="gender"
            id="gender"
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg outline-none cursor-pointer focus:border-[#e7423e]   text-slate-900"
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="profession">Nghề nghiệp</label>
          <input
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            id="profession"
            type="text"
            className="w-full px-6 py-2 text-sm border border-gray-200 rounded-lg outline-none text-slate-900 focus:border-[#e7423e]  "
          />
        </div>
        {/* Quốc gia */}
        <div className="flex flex-col gap-2">
          <label htmlFor="country">Quốc gia</label>
          <div className="relative">
            <div
              className="flex items-center justify-between px-4 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer text-slate-900"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex items-center gap-2">
                {selectedCountry?.flag && (
                  <img
                    src={selectedCountry?.flag}
                    alt=""
                    className="object-cover w-5 h-5 rounded-full"
                  />
                )}
                <span>
                  {me?.country
                    ? me?.country
                    : selectedCountry?.name || "Chọn một quốc gia"}
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {isDropdownOpen && (
              <ul className="absolute z-10 mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-40">
                {countries?.data.map((c) => (
                  <li
                    key={c.name}
                    onClick={() => {
                      setSelectedCountry(c);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <img
                      src={c.flag}
                      alt={c.name}
                      className="object-cover w-6 h-6 mr-2 rounded-full"
                    />
                    <span>{c.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="bio">Tiểu sử</label>
          <textarea
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            id="bio"
            className="p-5 text-sm border border-gray-200 rounded-lg outline-none min-h-32 focus:border-[#e7423e]   text-slate-900"
          ></textarea>
        </div>

        <button className="max-w-[200px] ml-auto text-sm font-medium hover:bg-opacity-70 px-4 py-2 rounded-3xl bg-slate-950 text-primaryText">
          Lưu hồ sơ
        </button>
      </form>
    </div>
  );
};

export default EditProfile;