import axiosConfig from "../axios/config";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const Menu = ({ cat_id, post_id }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const res = await axiosConfig.get("/api/posts/releated", {
          params: {
            cat: cat_id,
            post_id,
          },
        });
        setRelatedPosts(res.data?.posts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRelatedPosts();
  }, [cat_id, post_id]);

  return (
    <div className="w-full p-10 mx-auto mb-20 ml-5 rounded-xl md:px-10 bg-red-50">
      <h1 className="flex items-center gap-2 mb-10 text-2xl font-semibold">
        <span className="inline-block w-8 h-2 bg-red-600 rounded-xl"></span><span>Tin tức liên quan</span>
      </h1>
      <div className="flex flex-col gap-5">
        {relatedPosts?.length > 0 &&
          relatedPosts.map((post, index) => (
            <div key={index} className="flex gap-5">
              <img
                src={post.img}
                alt=""
                className="object-cover max-w-[160px] min-w-[160px]  md:w-[200px] md:min-w-[200px] h-32"
              />
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-gray-600 hover:text-red-600">
                  <Link to={`/post/${post?.id}`}>{post.title}</Link>
                </p>
                <div className="">
                  <span
                    className={`px-2 py-1 text-xs text-gray-700  bg-slate-100`}
                  >
                    {post?.category_name || "Technology"}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Menu;
