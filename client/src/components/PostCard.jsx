/* eslint-disable react/prop-types */
import moment from "moment";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <article className="relative overflow-hidden bg-white rounded-sm">
      <Link
        to={`/post/${post?.id}`}
        className="block w-full h-64 overflow-hidden"
      >
        <img
          loading="lazy"
          src={post?.img}
          alt={post?.title}
          className="object-cover w-full h-64 transition-all duration-150 ease-in-out hover:scale-110"
        />
      </Link>
      <div className="absolute p-2 text-gray-200 bg-black bg-opacity-40 top-5 right-5">
        {moment(post?.created_at).format("MMM Do YY")}
      </div>
      <div className="flex flex-col p-4 h-[320px]">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 text-xs text-gray-700  bg-slate-100`}>
            {post?.category_name}
          </span>
        </div>
        <h3 className="flex-1 mb-2 text-lg font-semibold hover:text-teal-500 ">
          <Link to={`/post/${post?.id}`}>{post?.title}</Link>
        </h3>
        <p className="mb-4 text-gray-600 teaser">{post?.teaser}</p>
        <div className="w-full h-[1px] bg-gray-100 mb-4"></div>
        <p className="flex items-end  text-[#495057] ">By: {post?.username}</p>
      </div>
    </article>
  );
};

export default PostCard;
