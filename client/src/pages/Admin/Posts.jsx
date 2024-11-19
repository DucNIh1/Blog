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
  draft: "border-slate-400 text-slate-900",
  published: "border-green-800 text-green-900",
  pending: "border-yellow-600 text-yellow-900",
};

const Posts = () => {
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  //filter
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
        toast.success(res.data?.message || "Deleted successfully");
        setOpenDelete(false);
      } catch (error) {
        toast.error("Delete failed");
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
        toast.success(res.data?.message);
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
        console.log(error);
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
        console.log(res);
        toast.success(res.data?.message);
      } catch (error) {
        toast.error(error.response.data?.message || "Something went wrong!");
        console.log(error);
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
    <div className="bg-white rounded-lg p-8">
      <h1 className="mb-10">All Posts</h1>
      <div className="flex items-center gap-4 mb-10 justify-center">
        <input
          placeholder="search"
          type="text"
          value={temptitle}
          onChange={(e) => setTempTitle(e.target.value)}
          className="border border-slate-200 focus:border-teal-500  outline-none bg-white rounded-xl px-6 py-2 min-w-[300px] text-sm font-light text-slate-800"
        />
        <RiSearchLine
          onClick={() => setTitle(temptitle)}
          className="cursor-pointer hover:scale-125 hover:text-teal-800 size-5 text-slate-700"
        />
      </div>
      <div className="flex gap-10 mb-20">
        <select
          name="status"
          id="status"
          value={status || ""}
          onChange={(e) => setStatus(e.target.value)}
          className="outline-none py-2 px-4 rounded-xl cursor-pointer focus:border focus:border-teal-500 text-sm text-gray-800 "
        >
          <option value="">All status</option>

          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="published">Published</option>
        </select>

        <select
          name="category"
          id="category"
          value={category || ""}
          onChange={(e) => setCategory(e.target.value)}
          className="outline-none py-2 px-4 rounded-xl cursor-pointer focus:border focus:border-teal-500 text-sm text-gray-800 "
        >
          <option value="">All category</option>

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
          className="outline-none py-2 px-4 rounded-xl cursor-pointer focus:border focus:border-teal-500 text-sm text-gray-800 "
        >
          <option value="">Sort: default</option>
          <option value="asc">Ascending</option>
          <option value="des">Descending</option>
        </select>

        <button
          className="bg-slate-950 text-primaryText px-4 rounded-xl hover:bg-opacity-80"
          onClick={() => {
            setCategory(null);
            setSort(null);
            setStatus(null);
            setTempTitle("");
            setTitle(null);
            setPage(1);
          }}
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col gap-10 items-start">
        {posts?.length > 0 &&
          posts.map((post) => (
            <div key={post.id} className="flex gap-5 w-full">
              <img
                src={post?.img}
                alt=""
                className="w-[280px] object-cover h-48"
              />
              <div className="flex flex-col gap-3 flex-1">
                <h2 className="text-gray-800 tex-lg font-medium mb-2 max-w-96 hover:text-teal-700">
                  <Link to={`/post/${post.id}`}> {post?.title}</Link>
                </h2>
                <p className="text-sm font-light text-gray-700">
                  {moment(post?.created_at).format("MMM Do YY")}
                </p>
                <div className="mb-5">
                  <p className="bg-teal-900 inline-block px-4 py-1 text-primaryText text-sm font-light rounded-xl">
                    {post?.category_name}
                  </p>
                </div>
                <p className="text-sm  text-slate-600">
                  Write by: {post?.username}
                </p>
              </div>

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
                className={`h-10 px-4 py-1 rounded-xl outline-none border cursor-pointer  ${
                  post.isFeatured
                    ? "border-teal-500 text-teal-900"
                    : "border-blue-500 text-blue-900"
                } `}
              >
                <option value={1} className="bg-white text-slate-950 ">
                  Featured
                </option>
                <option value={0} className="bg-white text-slate-950">
                  Normal
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
                className={`h-10 px-4 py-1 rounded-xl outline-none border cursor-pointer  ${
                  statusColors[post?.status]
                }`}
              >
                <option value="draft" className="bg-white text-slate-950 ">
                  Draft
                </option>
                <option value="pending" className="bg-white text-slate-950">
                  Pending
                </option>
                <option value="published" className="bg-white text-slate-950">
                  Published
                </option>
              </select>
              <button
                className="h-10 bg-red-700 px-4 rounded-xl text-white hover:bg-red-900"
                onClick={() => setOpenDelete(post?.id)}
              >
                Delete
              </button>
              <DeleteModal
                setOpen={setOpenDelete}
                onClick={() => deleteMutation.mutate(post?.id)}
                open={openDelete == post?.id}
              />
            </div>
          ))}
        <Pagination page={page} setPage={setPage} total={total} />
      </div>
    </div>
  );
};

export default Posts;
