import { useEffect, useState } from "react";
import axiosConfig from "../../axios/config";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaPencil, FaRegTrashCan } from "react-icons/fa6";
import DeleteModal from "../../components/DeleteModal";
import moment from "moment";
import Pagination from "../../components/Pagination";

const statusColors = {
  draft: "bg-slate-900",
  published: "bg-blue-900",
};

const Published = () => {
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
            status: "published",
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
      await axiosConfig.delete(`/api/posts/${id}`);
      toast.success("Xóa bài viết thành công");
      setOpenDelete(false);
      setRefetch((pre) => pre + 1);
    } catch (error) {
      toast.error("Xóa bài viết thất bại");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {posts?.length > 0 &&
        posts?.map((post, index) => (
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
                  {moment(post?.updated_at).format("DD/MM/YYYY")}
                </p>
                <h2 className="text-lg font-medium cursor-pointer text-slate-950 hover:text-[#e7423e] ">
                  <Link to={`/post/${post?.id}`}>{post?.title}</Link>
                </h2>
                <div className="flex flex-row gap-5 lg:flex-col">
                  <div className="">
                    <span className="px-4 py-1 text-sm font-medium bg-slate-100 text-slate-600">
                      {post?.cat_name}
                    </span>
                  </div>
                  <div className="">
                    <span
                      className={`text-sm px-4 py-1  text-primaryText  first-letter:uppercase ${statusColors[post?.status]
                        }`}
                    >
                      {post?.status == 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-5 lg:gap-10">
              <Link to={"/write"} state={post}>
                <FaPencil className="p-1 text-white transition-all duration-100 ease-out bg-blue-600 rounded-full cursor-pointer size-6 hover:scale-110 hover:bg-blue-800" />
              </Link>
              <FaRegTrashCan
                onClick={() => setOpenDelete(post?.id)}
                className="p-1 text-white transition-all duration-100 ease-out bg-red-600 rounded-full cursor-pointer size-6 hover:scale-110 hover:bg-red-800"
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
        <h1 className="my-10 text-xl text-center">Bạn chưa có bài viết nào!</h1>
      )}
    </div>
  );
};

export default Published;
