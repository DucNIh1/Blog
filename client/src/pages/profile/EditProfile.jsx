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

  //  for country
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  //
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
      setPreviewImage(URL.createObjectURL(file)); // Tạo link tạm để preview ảnh
    }
  };

  const updateAvatarMutation = useMutation({
    mutationFn: async () => {
      try {
        const data = new FormData();
        data.append("image", selectedImg);

        toast.info("Please wait a second...");

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
        toast.success("Update avatar successfully");
      } catch (error) {
        toast.error("Error updating avatar");
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
      <div className="flex gap-5 items-center mb-5 flex-wrap">
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
          className="w-20 h-20 object-cover rounded-full"
        />
        <label
          htmlFor="image"
          className=" border border-slate-300  rounded-3xl cursor-pointer py-2 px-5 text-sm flex items-center font-medium hover:border-teal-500 transition-all duration-100 ease-in-out"
        >
          Upload new picture
        </label>
        <button
          onClick={updateAvatarMutation.mutate}
          className="bg-[#f8f7f4] text-sm font-medium rounded-2xl px-5 text-slate-900 py-2 hover:bg-slate-900 hover:text-primaryText"
        >
          Save
        </button>
      </div>
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          updateProfileMutation.mutate();
        }}
      >
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="username">Name</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            type="text"
            className="w-full outline-none rounded-lg border border-gray-200 px-6 py-2 text-sm text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-offset-1 focus:ring-teal-200"
          />
        </div>

        {/* Birth day */}
        <div className="flex flex-col gap-2">
          <label htmlFor="birth">Birth date</label>
          <input
            id="birth"
            type="date"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            className="w-full outline-none rounded-lg border border-gray-200 px-6 py-2 text-sm text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-offset-1 focus:ring-teal-200"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label htmlFor="gender">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            name="gender"
            id="gender"
            className="outline-none border border-gray-200 rounded-lg px-4 py-2 cursor-pointer focus:border-teal-500 focus:ring-1 focus:ring-offset-1 focus:ring-teal-200 text-sm text-slate-900"
          >
            <option value="">Select gender</option>

            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="profession">Profession</label>
          <input
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            id="profession"
            type="text"
            className="w-full outline-none rounded-lg border border-gray-200 px-6 py-2 text-sm text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-offset-1 focus:ring-teal-200"
          />
        </div>
        {/* Country */}
        <div className="flex flex-col gap-2">
          <label htmlFor="country">Country</label>
          <div className="relative">
            <div
              className="border border-gray-200 rounded-lg px-4 py-2 cursor-pointer text-sm text-slate-900 flex items-center justify-between"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex gap-2 items-center">
                {selectedCountry?.flag && (
                  <img
                    src={selectedCountry?.flag}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover"
                  />
                )}
                <span>
                  {me?.country
                    ? me?.country
                    : selectedCountry?.name || "Select a country"}
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
              <ul className="absolute mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                {countries?.data.map((c) => (
                  <li
                    key={c.name}
                    onClick={() => {
                      setSelectedCountry(c);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={c.flag}
                      alt={c.name}
                      className="w-6 h-6 rounded-full object-cover mr-2"
                    />
                    <span>{c.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="bio">Bio</label>
          <textarea
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            id="bio"
            className="border border-gray-200 rounded-lg min-h-32 outline-none focus:border-teal-500 focus:ring-1 focus:ring-offset-1 focus:ring-teal-200 p-5 text-sm text-slate-900"
          ></textarea>
        </div>

        <button className="max-w-[200px] ml-auto text-sm font-medium hover:bg-opacity-70 px-4 py-2 rounded-3xl bg-slate-950 text-primaryText">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
