import { useEffect, useState } from "react";
import axiosConfig from "../../axios/config";
import { toast } from "react-toastify";
import { MdPublish } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaPencil, FaRegTrashCan } from "react-icons/fa6";
import DeleteModal from "../../components/DeleteModal";
import moment from "moment";
import Pagination from "../../components/Pagination";

const statusColors = {
  draft: "bg-slate-400",
  published: "bg-green-800",
  pending: "bg-yellow-600",
};

const Draft = () => {
  const [page, setPage] = useState(1);
  const [openDelete, setOpenDelete] = useState(false);
  const [total, setTotal] = useState(null);

  const [posts, setPosts] = useState(null);
  const [refetch, setRefetch] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosConfig.get("/api/posts/my-posts", {
          params: {
            page,
            limit: 3,
            status: "draft",
          },
        });
        setTotal(res.data?.total);
        setPosts(res.data?.posts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [page, refetch]);

  const handleDelete = async (id) => {
    try {
      const res = await axiosConfig.delete(`/api/posts/${id}`);
      toast.success(res.data?.message || "Deleted successfully");
      setOpenDelete(false);
      setRefetch((pre) => pre + 1);
    } catch (error) {
      toast.error("Delete failed");
      console.log(error);
    }
  };

  const handlePublish = async (id) => {
    try {
      const res = await axiosConfig.patch(`/api/posts/${id}/publish`);
      toast(res.data?.message);
      setRefetch((pre) => pre + 1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {posts &&
        posts?.length > 0 &&
        posts &&
        posts.map((post, index) => (
          <div
            className="flex flex-col justify-between gap-5 lg:flex-row"
            key={index}
          >
            <div className="flex flex-col gap-5 lg:flex-row">
              <img
                src={post.img}
                alt=""
                className="lg:w-[288px] h-[200px] object-cover w-full"
              />
              <div className="flex flex-col gap-4">
                <p className="text-sm text-slate-600">
                  {moment(post?.updated_at).format("MMM Do YY")}
                </p>
                <h2 className="text-lg font-medium cursor-pointer text-slate-950 hover:text-teal-600">
                  <Link to={`/post/${post?.id}`}>{post?.title}</Link>
                </h2>
                <div className="flex flex-row gap-5 lg:flex-col">
                  <div className="">
                    <span className="px-4 py-1 text-sm font-medium rounded-md bg-slate-100 text-slate-600">
                      {post?.cat_name}
                    </span>
                  </div>
                  <div className="">
                    <span
                      className={`text-sm px-4 py-1 rounded-md text-primaryText  first-letter:uppercase ${
                        statusColors[post?.status]
                      }`}
                    >
                      {post?.status}
                    </span>
                  </div>
                  {post?.status == "draft" ? (
                    <div>
                      <button
                        onClick={() => handlePublish(post?.id)}
                        className="flex items-center gap-2 px-4 py-1 bg-slate-950 text-primaryText"
                      >
                        <MdPublish />
                        <span>Publish</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex gap-5 lg:gap-10">
              <Link to={"/write"} state={post}>
                <FaPencil className="p-1 text-white transition-all duration-100 ease-out bg-blue-400 rounded-full cursor-pointer size-6 hover:scale-110 hover:bg-blue-800" />
              </Link>
              <FaRegTrashCan
                onClick={() => setOpenDelete(post?.id)}
                className="p-1 text-white transition-all duration-100 ease-out bg-red-400 rounded-full cursor-pointer size-6 hover:scale-110 hover:bg-red-800"
              />
              <DeleteModal
                open={openDelete === post?.id}
                setOpen={setOpenDelete}
                onClick={() => handleDelete(post?.id)}
              />
            </div>
          </div>
        ))}
      {posts?.length > 0 ? (
        <Pagination page={page} setPage={setPage} total={total} />
      ) : (
        <img src="https://res.cloudinary.com/dnjz0meqo/image/upload/v1731905318/zdpduoe3wi13rebwfg7y.png" />
      )}
    </div>
  );
};

export default Draft;
