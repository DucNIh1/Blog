import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosConfig from "../../axios/config";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import moment from "moment";
import DeleteModal from "../../components/DeleteModal";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";

const statusColors = {
  draft: "border-gray-400 text-gray-700 bg-gray-50",
  published: "border-green-600 text-green-700 bg-green-50",
};

const Posts = () => {
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [status, setStatus] = useState(null);
  const [category, setCategory] = useState(null);
  const [sort, setSort] = useState(null);
  const [temptitle, setTempTitle] = useState("");
  const [title, setTitle] = useState(null);

  const { data: posts } = useQuery({
    queryKey: ["posts", { status, sort, category, page, title }],
    queryFn: async () => {
      try {
        const res = await axiosConfig.get("/api/posts", {
          params: {
            page,
            limit: 3,
            status,
            sort,
            cat: category,
            title,
          },
        });
        setTotal(res.data?.total);

        return res.data?.posts;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axiosConfig.delete(`/api/posts/${id}`);
        toast.success("Xóa thành công");
        setOpenDelete(false);
      } catch (error) {
        toast.error("Xóa thất bại");
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", page]);
    },
  });

  const changePostStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      try {
        const res = await axiosConfig.patch(`/api/posts/${id}/status`, {
          status,
        });
        toast.success("Cập nhật thành công");
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", page]);
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      try {
        const res = await axiosConfig.get("/api/category");
        return res.data?.categories;
      } catch (error) {
      }
    },
  });

  const changePostFeatured = useMutation({
    mutationFn: async ({ id, isFeatured, cat }) => {
      try {
        const res = await axiosConfig.patch(`/api/posts/${id}/featured-post`, {
          id: id,
          isFeatured,
          cat,
        });
        toast.success("Cập nhật thành công");
      } catch (error) {
        toast.error(error.response.data?.message || "Đã xảy ra lỗi!");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  useEffect(() => {
    setPage(1);
  }, [status, title, sort, category]);

  return (
    <div className="p-8 bg-white rounded-md shadow-md">
      <h1 className="mb-10 text-2xl font-bold text-gray-800 border-b-2 border-[#e7423e] pb-3 inline-block">Tất cả bài viết</h1>

      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="relative w-full max-w-md">
          <input
            placeholder="Tìm kiếm theo tiêu đề..."
            type="text"
            value={temptitle}
            onChange={(e) => setTempTitle(e.target.value)}
            className="border border-gray-200 focus:border-[#e7423e] outline-none bg-white rounded-md px-6 py-3 w-full text-sm font-light text-gray-800 shadow-sm transition-all"
          />
          <RiSearchLine
            onClick={() => setTitle(temptitle)}
            className="cursor-pointer hover:scale-125 hover:text-[#e7423e] size-5 text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-4 mb-10 rounded-md shadow-sm bg-gray-50">
        <select
          name="status"
          id="status"
          value={status || ""}
          onChange={(e) => setStatus(e.target.value)}
          className="outline-none py-2 px-4 rounded-md cursor-pointer border border-gray-200 focus:border-[#e7423e] text-sm text-gray-800 bg-white shadow-sm transition-all hover:shadow"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="draft">Bản nháp</option>
          <option value="published">Xuất bản</option>
        </select>

        <select
          name="category"
          id="category"
          value={category || ""}
          onChange={(e) => setCategory(e.target.value)}
          className="outline-none py-2 px-4 rounded-md cursor-pointer border border-gray-200 focus:border-[#e7423e] text-sm text-gray-800 bg-white shadow-sm transition-all hover:shadow"
        >
          <option value="">Tất cả danh mục</option>
          {categories &&
            categories.map((cat) => (
              <option value={cat.id} key={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>

        <select
          name="sort"
          id="sort"
          value={sort || ""}
          onChange={(e) => setSort(e.target.value)}
          className="outline-none py-2 px-4 rounded-md cursor-pointer border border-gray-200 focus:border-[#e7423e] text-sm text-gray-800 bg-white shadow-sm transition-all hover:shadow"
        >
          <option value="">Sắp xếp: mặc định</option>
          <option value="asc">Tăng dần</option>
          <option value="des">Giảm dần</option>
        </select>

        <button
          className="px-6 py-2 text-sm font-medium text-gray-700 transition-all bg-gray-100 border border-gray-200 rounded-md shadow-sm hover:bg-gray-200"
          onClick={() => {
            setCategory(null);
            setSort(null);
            setStatus(null);
            setTempTitle("");
            setTitle(null);
            setPage(1);
          }}
        >
          Đặt lại
        </button>
      </div>

      <div className="flex flex-col items-start gap-8">
        {posts?.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col w-full gap-5 p-4 transition-all bg-white border border-gray-100 rounded-md shadow-sm md:flex-row hover:shadow-md"
            >
              <div className="md:w-[280px] overflow-hidden rounded-md">
                <img
                  src={post?.img}
                  alt=""
                  className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="flex flex-col flex-1 gap-3">
                <h2 className="text-gray-800 text-lg font-medium mb-2 hover:text-[#e7423e] transition-colors">
                  <Link to={`/post/${post.id}`}>{post?.title}</Link>
                </h2>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{moment(post?.created_at).format("DD/MM/YYYY")}</span>
                  <span className="text-xs">•</span>
                  <span>Tác giả: {post?.username}</span>
                </div>

                <div className="my-3">
                  <span className="bg-[#e7423e] bg-opacity-10 inline-block px-4 py-1 text-[#e7423e] text-sm font-medium rounded-md border border-[#e7423e] border-opacity-20">
                    {post?.category_name}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                <select
                  name="isFeatured"
                  id="isFeatured"
                  value={post?.isFeatured}
                  onChange={(e) =>
                    changePostFeatured.mutate({
                      id: post.id,
                      isFeatured: e.target.value,
                      cat: post.cat_id,
                    })
                  }
                  className={`px-4 py-2 rounded-md outline-none border cursor-pointer text-sm transition-all ${post.isFeatured
                    ? "border-[#e7423e] text-[#e7423e] bg-red-50"
                    : "border-blue-500 text-blue-600 bg-blue-50"
                    }`}
                >
                  <option value={1} className="text-gray-800 bg-white">
                    Nổi bật
                  </option>
                  <option value={0} className="text-gray-800 bg-white">
                    Bình thường
                  </option>
                </select>

                <select
                  name="status"
                  id="status"
                  value={post?.status}
                  onChange={(e) =>
                    changePostStatusMutation.mutate({
                      id: post.id,
                      status: e.target.value,
                    })
                  }
                  className={`px-4 py-2 rounded-md outline-none border cursor-pointer text-sm transition-all ${statusColors[post?.status]
                    }`}
                >
                  <option value="draft" className="text-gray-800 bg-white">
                    Bản nháp
                  </option>
                  <option value="published" className="text-gray-800 bg-white">
                    Xuất bản
                  </option>
                </select>

                <button
                  className="px-4 py-2 bg-[#e7423e] rounded-md text-white hover:bg-opacity-90 transition-all text-sm font-medium shadow-sm hover:shadow"
                  onClick={() => setOpenDelete(post?.id)}
                >
                  Xóa
                </button>

                <DeleteModal
                  setOpen={setOpenDelete}
                  onClick={() => deleteMutation.mutate(post?.id)}
                  open={openDelete == post?.id}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="w-full py-10 text-center text-gray-500">
            Không tìm thấy bài viết nào. Hãy thử điều chỉnh bộ lọc của bạn.
          </div>
        )}
        <div className="w-full">
          <Pagination page={page} setPage={setPage} total={total} />
        </div>
      </div>
    </div>
  );
};

export default Posts;