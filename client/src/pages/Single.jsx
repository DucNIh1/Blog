import { FaPencil } from "react-icons/fa6";
import Menu from "../components/Menu";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axiosConfig from "../axios/config";
import moment from "moment";
import { AuthContext } from "../context/authContext";
import ReactQuill from "react-quill";
import { IoIosSend } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Single = () => {
  const queryClient = useQueryClient();

  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const [post, setPost] = useState(null);

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      try {
        const res = await axiosConfig.get(`/api/comments/${id}`, {
          params: {
            userId: user?.id || null,
          },
        });
        return res.data?.comments;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      try {
        const res = await axiosConfig.post(`/api/comments`, {
          content: comment,
          post_id: id,
        });
        console.log(res);
        toast.success("Comment successfully");
        setComment("");
      } catch (error) {
        toast.error("Comment failed to be created");
        console.log(error);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["comment"]);
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (commentId) => {
      try {
        await axiosConfig.patch(`/api/comments/${commentId}/like`);
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comment"]);
    },
  });

  useEffect(() => {
    const handleFetchPosts = async () => {
      try {
        const res = await axiosConfig.get("/api/posts/" + id);

        setPost(res.data?.post);
      } catch (error) {
        console.log(error);
      }
    };

    handleFetchPosts();
  }, [id]);

  useEffect(() => {
    window.scrollTo({
      top: 400,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="flex flex-col gap-20 mb-20 lg:gap-5 lg:flex-row">
      <div className="w-full lg:w-2/3 ">
        <img
          src={post?.img}
          alt=""
          className="w-full h-[400px] object-cover mb-5"
        />
        <div className="flex items-center gap-5 mb-5 user">
          <Link to={`/author/${post?.user_id}`}>
            <img
              src={post?.user_img}
              alt=""
              className="object-cover w-20 h-20 rounded-full  hover:scale-110 transition-all ease-in-out"
            />
          </Link>
          <div className="flex flex-col gap-2">
            <p className="font-semibold hover:text-teal-500">
              <Link to={`/author/${post?.user_id}`}>{post?.username}</Link>
            </p>
            <p className=" first-letter:uppercase">
              {moment(post?.updated_at).format("MMM Do YY")}
            </p>
          </div>

          {user?.email === post?.email && (
            <div className="flex items-center gap-2">
              <Link to={"/write"} state={post}>
                <FaPencil className="p-1 text-white bg-blue-400 rounded-full cursor-pointer size-6" />
              </Link>
            </div>
          )}
        </div>
        <p className="mb-10 text-sm text-slate-600">
          Click on the avatar for more infor about the author!
        </p>

        <h1 className="mb-10 text-4xl font-bold text-gray-900">
          {post?.title}
        </h1>
        <p
          className="mb-20 leading-8 text-justify text-gray-900"
          dangerouslySetInnerHTML={{ __html: post?.content }}
        />

        <div className="pt-5 border-t border-gray-200">
          <h2 className="mb-5 text-2xl font-medium text-teal-800 ">Comment</h2>
          <div className="flex items-center w-full gap-5 mb-10">
            <ReactQuill
              className="w-full"
              theme="snow"
              value={comment}
              onChange={setComment}
            />
            <IoIosSend
              className="cursor-pointer size-10 hover:text-teal-600 hover:scale-125"
              onClick={() => {
                user
                  ? commentMutation.mutate()
                  : toast.info("Hey, Let's login to write a comment😁");
              }}
            />
          </div>
          <div className="flex flex-col gap-10">
            {comments?.length > 0 &&
              comments.map((c, index) => (
                <div className="flex gap-10" key={index}>
                  <img
                    src={c?.img}
                    alt=""
                    className="object-cover w-10 h-10 rounded-full"
                  />
                  <div className="">
                    <h2 className="mb-2 font-semibold text-slate-950">
                      {c.username}
                    </h2>
                    <p
                      className="mb-3 leading-8 text-gray-600"
                      dangerouslySetInnerHTML={{ __html: c?.content }}
                    />
                    <div className="flex gap-10">
                      <button
                        disabled={!user}
                        className={`inline-flex items-center gap-1 cursor-pointer hover:text-teal-600   ${
                          c.isLiked == 1 ? "text-pink-500" : "text-slate-600"
                        }`}
                        onClick={() => likeMutation.mutate(c.id)}
                      >
                        <AiOutlineLike className={`size-6 `} />
                        <span>Like</span>
                      </button>
                      <div className="flex items-center gap-2">
                        <FcLike className="size-6" />
                        <span className="text-sm text-slate-600">
                          {c.likes || ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/3">
        <Menu cat_id={post?.cat_id} post_id={post?.id} />
      </div>
    </div>
  );
};

export default Single;
