/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import axiosConfig from "../axios/config";
import PostCard from "../components/PostCard";
import moment from "moment";
import Pagination from "../components/Pagination";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const Home = () => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(null);
  const [temptitle, setTempTitle] = useState("");
  const [title, setTitle] = useState(null);

  const locationRef = useRef(null);

  useEffect(() => {
    if (locationRef.current) {
      locationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [page]);

  const { data: posts } = useQuery({
    queryKey: ["posts", { page, category, title }],
    queryFn: async () => {
      try {
        const res = await axiosConfig.get("/api/posts", {
          params: {
            page,
            limit: 6,
            status: "published",
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

  const { data: featuredPosts } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: async () => {
      try {
        const res = await axiosConfig.get("/api/posts", {
          params: {
            limit: 3,
            isFeatured: 1,
            sort: "desc",
            status: "published",
          },
        });
        setTotal(res.data?.total);
        return res.data?.posts;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <main className="my-10 ">
      <div className="flex flex-col   lg:flex-row items-center gap-5 lg:gap-10 mb-20 justify-between">
        <div className="flex items-center gap-5 lg:order-2">
          <input
            type="text"
            placeholder="Search..."
            value={temptitle}
            onChange={(e) => {
              setTempTitle(e.target.value);
            }}
            className="px-6 py-3 rounded-xl border border-gray-300 w-full max-w-[500px] focus:border-teal-500 outline-none focus:ring-1 focus:ring-teal-200 focus:ring-offset-2 focus:ring-offset-teal-300"
          />
          <button
            onClick={() => {
              setPage(1);
              setTitle(temptitle);
            }}
            className="bg-slate-950 py-3 px-6 text-primaryText hover:bg-opacity-80 rounded-xl"
          >
            Search
          </button>
        </div>

        <div className="flex gap-5 items-center">
          <select
            name="category"
            id="category"
            value={category || ""}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
            className="border border-slate-400 outline-none py-2 px-4 rounded-xl cursor-pointer focus:border focus:border-teal-800 text-sm text-gray-800 "
          >
            <option value="">All category</option>

            {categories &&
              categories.map((cat) => (
                <option value={cat.id} key={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
          <button
            className="bg-slate-950 text-primaryText px-4 rounded-xl hover:bg-opacity-80 py-2"
            onClick={() => {
              setCategory(null);
              setTempTitle("");
              setTitle(null);
              setPage(1);
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="w-full h-[2px] bg-gradient-to-r from-blue-400 via-green-500 to-indigo-400 my-10 "></div>
      <div className="flex items-center justify-between mb-8" ref={locationRef}>
        <h1 className="mb-5 text-2xl font-medium uppercase  bg-gradient-to-r from-blue-400 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
          All posts
        </h1>
      </div>
      {/* All posts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 md:grid-cols-2">
        {posts &&
          posts.map((post, index) => <PostCard post={post} key={index} />)}
      </div>
      <div className="flex justify-center mt-8 mb-20">
        <Pagination total={total} setPage={setPage} page={page} />
      </div>

      <div className=" flex flex-col lg:flex-row bg-[#212529] lg:mb-40 mb-20">
        <div className="p-5 md:p-20 ">
          <h1 className="mb-10 text-2xl font-medium text-primaryText">
            Featured Topics
          </h1>

          <div className="flex flex-col gap-10">
            {featuredPosts &&
              featuredPosts.map((post, index) => {
                return <PostCardFeature key={index} post={post} />;
              })}
          </div>
        </div>
        <img
          src="https://res.cloudinary.com/dnjz0meqo/image/upload/v1731160325/mer8pqnrxqyj8en65xmn.png"
          alt=""
          className="object-cover lg:w-1/2 md:h-[903px] h-96 "
        />
      </div>
    </main>
  );
};

const PostCardFeature = ({ post }) => {
  return (
    <div className="flex flex-col gap-5 md:flex-row">
      <img
        src={post?.img}
        alt=""
        className="object-cover w-full h-48 md:w-64 min-w-64"
      />
      <div className="flex flex-col gap-5">
        <p className="text-slate-300">
          {moment(post?.created_at).format("MMM Do YY")}
        </p>
        <h2 className="font-medium text-primaryText hover:text-teal-700">
          <Link to={`/post/${post.id}`}>{post?.title}</Link>
        </h2>
        <p className="text-sm font-light teaserFeature text-slate-300">
          {post?.teaser}
        </p>
      </div>
    </div>
  );
};
export default Home;
