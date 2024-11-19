// import { useQuery } from "@tanstack/react-query";
import axiosConfig from "../axios/config";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { useEffect, useRef, useState } from "react";

const Author = () => {
  const { id } = useParams();
  const [limit, setLimit] = useState(4);
  const [author, setAuthor] = useState(null);
  const ref = useRef();

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await axiosConfig.get(`/api/users/author/${id}`, {
          params: {
            limit,
          },
        });
        setAuthor(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAuthor();
  }, [limit, id]);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [limit]);

  return (
    <div className="w-full max-w-3xl mx-auto border p-5 my-20">
      <div className="flex gap-5 items-center mb-10">
        <img
          src={author?.infor.img}
          alt=""
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex flex-col gap-2">
          <p className="text-slate-950 font-medium">{author?.infor.username}</p>
          <p className="font-light text-slate-900 text-sm">
            {author?.infor.profession}
          </p>
        </div>
      </div>
      <p>
        <i className="leading-7 text-slate-700 font-light">
          {author?.infor.bio}
        </i>
      </p>

      <div className="flex gap-5 my-5">
        <a href={author?.infor.fb_url} target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-blue-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
          </svg>
        </a>
        <a href={author?.infor.github_url} target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-slate-800"
            fill="currentColor "
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <a href={author?.infor.ig_url} target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-pink-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
      </div>
      <div className="h-[1px] bg-slate-600 w-full my-10 bg-opacity-80"></div>

      <div className="">
        <h1 className="text-xl font-medium text-slate-900 mb-5" ref={ref}>
          Recent articles from the author
        </h1>

        <div className="flex flex-col gap-8 w-full">
          {author?.posts?.length > 0 &&
            author?.posts.map((post, index) => (
              <div
                className="flex flex-col gap-5 lg:flex-row w-full"
                key={index}
              >
                <img
                  src={post.img}
                  alt=""
                  className="lg:min-w-[288px] lg:max-w-[288px] h-[200px] object-cover w-full"
                />
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-slate-600">
                    {moment(post?.updated_at).format("MMM Do YY")}
                  </p>

                  <h2 className="text-lg font-medium cursor-pointer text-slate-950 hover:text-teal-600">
                    <Link to={`/post/${post?.id}`}>{post?.title}</Link>
                  </h2>

                  <div className="">
                    <span className="px-4 py-1 text-sm font-medium rounded-md bg-slate-100 text-slate-600">
                      {post?.cat}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <button
          onClick={() => setLimit((pre) => pre + 4)}
          className="bg-slate-950 px-6 py-2 text-primaryText mx-auto block my-10 hover:bg-opacity-70"
        >
          Load more
        </button>
      </div>
    </div>
  );
};

export default Author;
