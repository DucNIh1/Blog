/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import axiosConfig from "../axios/config";
import PostCard from "../components/PostCard";
import moment from "moment";
import Pagination from "../components/Pagination";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import CryptoTicker from "../components/CryptoTicker/CryptoTicker";
import CryptoNews from "../components/CryptoNews/CryptoNews";

const Home = () => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(null);
  const [temptitle, setTempTitle] = useState("");
  const [title, setTitle] = useState(null);

  const locationRef = useRef(null);
  const { data: posts } = useQuery({
    queryKey: ["posts", { page, category, title }],
    queryFn: async () => {
      try {
        const res = await axiosConfig.get("/api/posts", {
          params: {
            page,
            limit: 100,
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

  // const { data: featuredPosts } = useQuery({
  //   queryKey: ["featuredPosts"],
  //   queryFn: async () => {
  //     try {
  //       const res = await axiosConfig.get("/api/posts", {
  //         params: {
  //           limit: 3,
  //           isFeatured: 1,
  //           sort: "desc",
  //           status: "published",
  //         },
  //       });
  //       setTotal(res.data?.total);
  //       return res.data?.posts;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  // });

  return (
    <main className="my-10">
      <div className="flex items-start justify-between gap-4 mb-10 h-[80vh]">
        <div className="flex-[8]">
          {/* All posts */}
          {posts?.length && 
            <div className="grid grid-cols-2 gap-4">
              <PostCard post={posts[0]} size="lg"/>
              <PostCard post={posts[1]} size="lg"/>
              <div className="col-span-2 flex items-stretch justify-between gap-4 [&_article]:flex-1">
               {posts.filter((_, idx) => 2 <= idx && idx <= 5).map((post, index) => <PostCard key={index} post={post} size="sm" />)}
              </div>
          </div>}
        </div>
        <div className="flex-[2] h-full overflow-hidden flex flex-col bg-[#ffebe6] rounded-md p-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-10 bg-[#e44243] rounded-full"></span>
            <h3 className="text-xl">Hot news</h3>
          </div>
          <div className="flex-1 overflow-auto mt-4">
            <div className="w-full flex flex-col gap-4">
              {posts?.filter((_, idx) => idx > 5).map((post, index) => <PostCard key={index} post={post} size="xs" />)}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-10">
        <CryptoTicker />
      </div>
      
      <div>
        {categories?.length && categories.map(category => {
          const postsByCategory = posts?.filter(p => p.cat_id === category.id)?.slice(0, 4);
          return (
            <React.Fragment key={category.id}>
              {postsByCategory?.length > 0 && 
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-10 bg-[#e44243] rounded-full"></span>
                    <h3 className="text-xl">{category.name}</h3>
                  </div>
                  <div className="grid grid-cols-4 gap-x-4 mt-4">
                    {postsByCategory.map(post => {
                      return <PostCard key={post.id} post={post} size="sm"/>
                    })}
                  </div>
              </div>}
            </React.Fragment>
          )
        })}
      </div>
      <div>
        <CryptoNews />
      </div>
    </main>
  );
};

export default Home;
