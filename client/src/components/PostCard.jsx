/* eslint-disable react/prop-types */
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post, size = 'md' }) => {
  return (
    <React.Fragment>
      {size === 'md' &&
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
          <div className="flex flex-col py-4 h-[320px]">
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-1 text-xs text-gray-200 bg-[#e44242] transition-colors`}>
                {post?.category_name}
              </span>
            </div>
            <h3 className="flex-1 mb-2 text-lg font-semibold hover:text-[#e44242] transition-colors">
              <Link to={`/post/${post?.id}`}>{post?.title}</Link>
            </h3>
            <p className="mb-4 text-gray-600 teaser">{post?.teaser}</p>
            <div className="w-full h-[1px] bg-gray-100 mb-4"></div>
            <p className="flex items-end  text-[#495057] ">Tác giả: {post?.username}</p>
          </div>
        </article>
      }
      {size === 'lg' &&
        <article className="relative overflow-hidden bg-white rounded-md">
          <Link
            to={`/post/${post?.id}`}
            className="block w-full h-[400px] overflow-hidden"
          >
            <img
              loading="lazy"
              src={post?.img}
              alt={post?.title}
              className="object-cover w-full h-full transition-all duration-150 ease-in-out hover:scale-110 brightness-[70%]"
            />
          </Link>
          <div className="absolute p-2 text-gray-200 bg-black bg-opacity-40 top-5 right-5">
            {moment(post?.created_at).format("MMM Do YY")}
          </div>
          <div className="flex flex-col py-4 absolute bottom-0 left-10 w-[80%] text-primaryText">
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-1 text-xs text-white bg-[#bd3838]`}>
                {post?.category_name}
              </span>
            </div>
            <h3 className="flex-1 mb-2 text-lg font-semibold">
              <Link to={`/post/${post?.id}`}>{post?.title}</Link>
            </h3>
          </div>
        </article>
      }
      {size === 'sm' &&
        <article className="relative overflow-hidden bg-white rounded-md">
          <Link
            to={`/post/${post?.id}`}
            className="block w-full h-[200px] overflow-hidden"
          >
            <img
              loading="lazy"
              src={post?.img}
              alt={post?.title}
              className="object-cover w-full h-full transition-all duration-150 ease-in-out hover:scale-110 brightness-[70%]"
            />
          </Link>
          <div className="absolute p-1 text-sm text-gray-200 bg-black bg-opacity-40 top-1 right-1">
            {moment(post?.created_at).format("MMM Do YY")}
          </div>
          <div className="flex flex-col py-2">
            <div className="flex items-center justify-between mb-1">
              <span className={`px-1 py-1 text-xs text-white bg-[#bd3838]`}>
                {post?.category_name}
              </span>
            </div>
            <h3 className="flex-1 mb-2 text-base font-semibold text-black">
              <Link to={`/post/${post?.id}`}>
                <p className="line-clamp-2 overflow-hidden text-ellipsis hover:text-[#bd3838]" title={post?.title}>{post?.title}</p>
              </Link>
            </h3>
          </div>
        </article>}
      {size === 'xs' &&
        <article className="flex items-center justify-between gap-2 overflow-hidden">
          <Link
            to={`/post/${post?.id}`}
            className="block max-w-[120px] overflow-hidden aspect-video"
          >
            <img
              loading="lazy"
              src={post?.img}
              alt={post?.title}
              className="object-cover w-full h-full transition-all duration-150 ease-in-out hover:scale-110 brightness-[70%]"
            />
          </Link>
          <div className="flex flex-col py-2">
            <h3 className="flex-1 mb-2 text-xs font-semibold text-black">
              <Link to={`/post/${post?.id}`}>
                <p className="line-clamp-3 overflow-hidden text-ellipsis hover:text-[#bd3838]" title={post?.title}>{post?.title}</p>
              </Link>
            </h3>
          </div>
        </article>}
    </React.Fragment>

  );
};

export default PostCard;
