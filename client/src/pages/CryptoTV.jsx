import { useState } from 'react';
import data from '../db/db.json';
import Slider from 'react-slick';
import { FaPlayCircle } from "react-icons/fa";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
};

const CryptoTV = () => {
  const [selectedVideo, setSelectedVideo] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVideoClick = (video) => {
    setIsModalOpen(true);
    setSelectedVideo(video);

  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo()
  };



  return (
    <div className='mt-4'>
      <HotVideos />
      {/* Trading */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-10 bg-[#e44243] rounded-full"></span>
          <h3 className="text-xl">Trading</h3>
        </div>
        <Slider {...settings}>
          {data.trading.map((video, index) => (
            <VideoCard
              key={index}
              title={video.title}
              thumbnail={video.thumbnailUrl}
              date={video.date}
              channel={video.channel}
              videoUrl={video.videoUrl}
              handleClick={() => handleVideoClick(video)}
            />
          ))}
        </Slider>
      </div>
      {/* Discussion */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-10 bg-[#e44243] rounded-full"></span>
          <h3 className="text-xl">Thảo luận</h3>
        </div>
        <Slider {...settings}>
          {data.discussion.map((video, index) => (
            <VideoCard
              key={index}
              title={video.title}
              thumbnail={video.thumbnailUrl}
              date={video.date}
              channel={video.channel}
              videoUrl={video.videoUrl}
              handleClick={() => handleVideoClick(video)}
            />
          ))}
        </Slider>
      </div>
      {/* Kiến thức crypto */}
      <div className="mt-4 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-10 bg-[#e44243] rounded-full"></span>
          <h3 className="text-xl">Kiến thức crypto</h3>
        </div>
        <Slider {...settings}>
          {data.crypto_knowledge.map((video, index) => (
            <VideoCard
              key={index}
              title={video.title}
              thumbnail={video.thumbnailUrl}
              date={video.date}
              channel={video.channel}
              videoUrl={video.videoUrl}
              handleClick={() => handleVideoClick(video)}
            />
          ))}
        </Slider>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleCloseModal}>
          <div className="relative w-4/5 bg-white rounded-lg md:w-2/3 lg:w-1/2">
            <button
              onClick={handleCloseModal}
              className="absolute text-2xl text-white top-2 right-2"
            >
              &times;
            </button>
            <iframe
              className="w-full h-[700px] rounded-lg"
              src={selectedVideo.videoUrl}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

const VideoCard = ({ title, thumbnail, date, channel, handleClick }) => (
  <div className="relative cursor-pointer group">
    <div className="overflow-hidden bg-white shadow-md rounded-xl">
      <div className="relative" onClick={handleClick}>
        <img className="w-full h-[200px] object-cover brightness-50" src={thumbnail} alt={title} />
        <p className="text-xs absolute bottom-2 left-2 px-2 py-1 bg-[#e44243] text-white">{channel}</p>
        <span className='absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
          <FaPlayCircle size={40} className='text-gray-200' />
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg cursor-pointer hover:text-[#e44243] transition-colors text-ellipsis overflow-hidden line-clamp-2" onClick={handleClick}>{title}</h3>
        <p className="mt-2 text-xs text-gray-400">{date}</p>
      </div>
    </div>
  </div>
);

const HotVideos = () => {
  const [selectedVideo, setSelectedVideo] = useState(data.videos[0]);
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };
  return (
    <div className='mb-10'>
      <div className="flex items-center gap-2 mb-4">
        <span className="h-2 w-10 bg-[#e44243] rounded-full"></span>
        <h3 className="text-xl">GEMM TV</h3>
      </div>
      <div className="flex space-x-4">
        {/* Left side: Video List */}
        <div className="w-1/3 overflow-y-auto h-[500px] bg-black">
          {data.videos.map((video, index) => (
            <div
              key={index}
              className={`cursor-pointer flex items-center gap-4 p-5 text-white hover:bg-[#e6423e] transition-colors ${selectedVideo === video ? 'bg-[#e6423e]' : 'bg-transparent'}`}
              onClick={() => handleVideoClick(video)}
            >
              <img src={video.thumbnailUrl} alt={video.title} className='object-cover w-1/3 aspect-video' />
              <div>
                <h3 className="font-semibold text-md">{video.title}</h3>
                <p className="text-sm text-gray-500">{video.date} | {video.channel}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right side: Video Player */}
        <div className="flex-1">
          <iframe
            className="w-full h-full mb-4"
            src={selectedVideo.videoUrl}
            title={selectedVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default CryptoTV;
