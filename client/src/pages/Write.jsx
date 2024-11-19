import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoMdCloudUpload } from "react-icons/io";
import axiosConfig from "../axios/config.js";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const Write = () => {
  const { state } = useLocation();
  // Create and update
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [teaser, setTeaser] = useState("");
  const [category, setCategory] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Khi người dùng chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImg(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", selectedImg);

      const res = await axiosConfig.post(`/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data?.data?.secure_url;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (status) => {
    toast.info("Please wait a second! It'll take some time⌛...");
    const imgURL = await uploadImage();
    setPreviewImage(imgURL || previewImage);
    const url = state ? `/api/posts/${state?.id}` : "/api/posts";
    try {
      const res = await axiosConfig({
        method: state ? "PUT" : "POST",
        url: url,
        data: {
          title,
          teaser,
          img: imgURL || previewImage,
          cat_id: category,
          content,
          status,
        },
      });
      toast.success(res.data?.message);
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  useEffect(() => {
    setContent(state?.content);
    setTitle(state?.title);
    setCategory(state?.cat_id);
    setPreviewImage(state?.img);
    setTeaser(state?.teaser);
  }, [state]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await axiosConfig.get("/api/category", {
          params: {
            limit: 100,
          },
        });
        return res.data?.categories;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="flex flex-col gap-10 mb-40 lg:flex-row">
      <div className="w-full lg:w-2/3 content">
        <input
          type="text"
          placeholder="Title"
          className="w-full px-6 py-2 mb-5 border outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          type="text"
          placeholder="Teaser"
          className="w-full px-6 py-2 mb-5 border outline-none"
          value={teaser}
          onChange={(e) => setTeaser(e.target.value)}
        />
        <div className="w-full ">
          <ReactQuill
            className=""
            theme="snow"
            value={content}
            onChange={setContent}
          />
        </div>
      </div>

      <div className="flex-1 menu ">
        <div className="p-5 mb-5 border">
          <h1 className="mb-10 text-xl font-medium text-center text-gray-600 uppercase">
            Upload Image
          </h1>
          <p className="mb-3">Status: {state?.status || "Draft"}</p>
          <div className="relative flex items-center justify-center mb-10 border w-full min-h-[200px]">
            <input
              type="file"
              name="image"
              id="image"
              className="hidden"
              onChange={handleImageChange}
            />
            <>
              <label
                htmlFor="image"
                className="flex items-center justify-center w-full h-full cursor-pointer"
              >
                <div className="flex flex-col gap-2 img-area">
                  <div className="flex justify-center text-center">
                    {previewImage ? (
                      <div className="absolute inset-0 bg-blue-50">
                        <img
                          src={previewImage}
                          className="mx-auto w-[80%] h-full object-cover"
                        />
                      </div>
                    ) : (
                      <IoMdCloudUpload className="size-32" />
                    )}
                  </div>

                  <h3 className="text-lg font-medium text-center">
                    Upload Image
                  </h3>
                  <p className="text-center text-gray-600">
                    {selectedImg && (
                      <span>Image size must be less than 5MB</span>
                    )}
                  </p>
                </div>
              </label>
            </>
          </div>
          <div className="flex justify-between">
            {state && state.status === "draft" && (
              <>
                <button
                  className="px-4 py-2 text-teal-600 border border-teal-600"
                  onClick={() => handleClick("draft")}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 text-white bg-teal-600 hover:bg-opacity-80"
                  onClick={() => handleClick("pending")}
                >
                  Publish
                </button>
              </>
            )}
            {state && state.status === "pending" && (
              <>
                <button
                  className="px-4 py-2 text-teal-600 border border-teal-600"
                  onClick={() => handleClick("pending")}
                >
                  Save
                </button>
              </>
            )}
            {state && state.status === "published" && (
              <>
                <button
                  className="px-4 py-2 text-teal-600 border border-teal-600"
                  onClick={() => handleClick("published")}
                >
                  Save
                </button>
              </>
            )}
            {!state && (
              <>
                <button
                  className="px-4 py-2 text-teal-600 border border-teal-600"
                  onClick={() => handleClick("draft")}
                >
                  Save as a draff
                </button>
                <button
                  className="px-4 py-2 text-white bg-teal-600 hover:bg-opacity-80"
                  onClick={() => handleClick("pending")}
                >
                  Publish
                </button>
              </>
            )}
          </div>
        </div>
        <div className="p-5 border">
          <h1 className="mb-5 text-lg font-medium uppercase text-slate-950">
            Category
          </h1>
          <div className="flex flex-col gap-2">
            {categories?.length > 0 &&
              categories.map((cat, index) => (
                <div className="flex items-center gap-5" key={index}>
                  <input
                    type="radio"
                    name="category"
                    id={`cat${cat.id}`}
                    value={cat.id}
                    checked={category == cat.id}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                  <label
                    htmlFor={`cat${cat.id}`}
                    className="text-sm font-medium cursor-pointer text-slate-600 first-letter:uppercase"
                  >
                    {cat.name}
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
