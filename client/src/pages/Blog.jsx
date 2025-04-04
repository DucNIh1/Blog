import { useEffect, useRef, useState } from "react";
import axiosConfig from "../axios/config";
import { Link, useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import moment from "moment";
import Slider from "react-slick";
import Pagination from "../components/Pagination";

const sliderSettings = {
  dots: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  cssEase: "linear",
  pauseOnHover: false,
};

const Blog = () => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const locationRef = useRef(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosConfig.get("/api/posts", {
          params: {
            cat: id,
            page: page,
            limit: 6,
            isFeatured: 0,
            status: "published",
          },
        });
        setTotal(res.data?.total);
        setPosts(res.data?.posts);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchFeatured = async () => {
      try {
        const res = await axiosConfig.get("/api/posts", {
          params: {
            cat: id,
            limit: 3,
            isFeatured: 1,
            status: "published",
          },
        });
        return res.data?.posts;
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
    fetchFeatured();
  }, [id, page]);

  useEffect(() => {
    setPage(1);
    const fetchFeatured = async () => {
      try {
        const res = await axiosConfig.get("/api/posts", {
          params: {
            cat: id,
            limit: 3,
            isFeatured: 1,
            status: "published",
          },
        });
        setFeaturedPosts(res.data?.posts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFeatured();
  }, [id]);

  useEffect(() => {
    if (locationRef.current) {
      locationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [page]);

  return (
    <div className="my-20">
      <div className="my-20">
        <div className="flex items-center gap-2 mb-8" ref={locationRef}>
          <span className="h-2 w-10 bg-[#e44243] rounded-full"></span>
          <h1 className="inline-block text-xl font-medium uppercase">
            Bài viết nổi bật
          </h1>
        </div>

        <div className="w-full slider-container">
          <Slider
            {...sliderSettings}
            {...{ infinite: featuredPosts?.length > 1 }}
          >
            {featuredPosts &&
              featuredPosts.map((f) => (
                <div
                  className={`flex mb-10 gap-10 flex-col lg:flex-row w-full`}
                  key={f.id}
                >
                  <img
                    src={f?.img}
                    alt={f?.title}
                    className={`object-cover h-full  lg:w-2/3 max-h-[400px]`}
                  />
                  <div className="flex flex-col h-full gap-5 p-4 lg:w-1/3">
                    <p className="text-sm text-[#e44242]">
                      {moment(f?.updated_at).format("MMM Do YY")}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold hover:text-[#e44242] transition-colors">
                      <Link to={`/post/${f?.id}`}>{f?.title}</Link>
                    </h2>
                    <p className="flex-1 mt-2 text-sm font-light text-gray-700 teaser">
                      {f?.teaser}
                    </p>
                    <button className="text-lg bg-[#e44242] w-[200px] px-4 py-2 text-white hover:bg-opacity-70">
                      <Link to={`/post/${f?.id}`}> Xem thêm</Link>
                    </button>
                  </div>
                </div>
              ))}
          </Slider>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8" ref={locationRef}>
        <span className="h-2 w-10 bg-[#e44243] rounded-full"></span>
        <h1 className="inline-block text-xl font-medium uppercase">
          Tất cả bài viết
        </h1>
      </div>
      <div
        className="grid grid-cols-1 gap-20 mb-10 md:grid-cols-2 lg:grid-cols-3"
        ref={locationRef}
      >
        {posts &&
          posts.map((post, index) => <PostCard post={post} key={index} />)}
      </div>
      {posts?.length > 0 ? (
        <Pagination page={page} setPage={setPage} total={total} />
      ) : (
        <img src="https://res.cloudinary.com/dnjz0meqo/image/upload/v1731905318/zdpduoe3wi13rebwfg7y.png" />
      )}
    </div>
  );
};

export default Blog;
