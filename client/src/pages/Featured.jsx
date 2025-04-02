import { useEffect, useRef, useState } from "react";
import axiosConfig from "../axios/config";
import PostCard from "../components/PostCard";
import Pagination from "../components/Pagination";
import { useQuery } from "@tanstack/react-query";

const Featured = () => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

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
    queryKey: ["posts", { page }],
    queryFn: async () => {
      try {
        const res = await axiosConfig.get("/api/posts", {
          params: {
            page,
            limit: 6,
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
    <main className="my-10">
      <div className="mb-8 flex items-center gap-2" ref={locationRef}>
        <span className="h-2 w-10 bg-[#e44243] rounded-full"></span>
        <h1 className="text-xl font-medium uppercase inline-block">
          Bài viết nổi bật
        </h1>
      </div>
      {/* Featured posts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 md:grid-cols-2">
        {posts &&
          posts.map((post, index) => <PostCard post={post} key={index} />)}
      </div>
      <div className="flex justify-center mt-8 mb-20">
        <Pagination total={total} setPage={setPage} page={page} />
      </div>
    </main>
  );
};

export default Featured;
