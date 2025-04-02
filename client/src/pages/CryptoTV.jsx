import { useState } from 'react';

const cryptoVideos = [
  {
    title: "Bitcoin “Đổ Đèo” về 78K! Cơ hội cuối để gom hàng...",
    description: "Phân tích về 'Ngày Giải Phóng' và ảnh hưởng của nó đối với các nhà đầu tư tiền điện tử.",
    videoUrl: "https://www.youtube.com/embed/m6ochBtTAhs",
    thumbnailUrl: "https://img.youtube.com/vi/m6ochBtTAhs/0.jpg",
    channel: "Crypto World",
    date: "Hôm nay",
  },
  {
    title: "Bitcoin giảm sâu: Cơ hội để DCA hay là lời cảnh báo cuối cùng?",
    description: "Bitcoin đang giảm sâu, nhưng có phải đây là cơ hội DCA?",
    videoUrl: "https://www.youtube.com/embed/9emA9L8QyYk",
    thumbnailUrl: "https://img.youtube.com/vi/9emA9L8QyYk/0.jpg",
    channel: "Crypto World",
    date: "5 ngày trước",
  },
  {
    title: "One Crypto Trader's Strategy DESTROYED The Rest Of Ours!",
    description: "Phân tích về chiến lược giao dịch của một nhà đầu tư tiền điện tử và ảnh hưởng của nó đến thị trường.",
    videoUrl: "https://www.youtube.com/embed/x9Fh8hoN0UU",
    thumbnailUrl: "https://img.youtube.com/vi/x9Fh8hoN0UU/0.jpg",
    channel: "Crypto World",
    date: "1 tuần trước",
  },
  {
    title: "BTC Tariff Shock Incoming, Hyperliquid Madness & More",
    description: "Phân tích về những tác động của thuế BTC và các tin tức mới nhất trong thị trường tiền điện tử.",
    videoUrl: "https://www.youtube.com/embed/IJ0EUwvfwEI",
    thumbnailUrl: "https://img.youtube.com/vi/IJ0EUwvfwEI/0.jpg",
    channel: "Crypto World",
    date: "2 tuần trước",
  },
  {
    title: "CARDANO & ETHEREUM Are Showing Us the PATH FOR ALTCOINS",
    description: "Những phân tích về Cardano và Ethereum và ảnh hưởng của chúng đến các đồng altcoin.",
    videoUrl: "https://www.youtube.com/embed/x9Fh8hoN0UU",
    thumbnailUrl: "https://img.youtube.com/vi/x9Fh8hoN0UU/0.jpg",
    channel: "Crypto World",
    date: "3 tuần trước",
  },
];

const CryptoTV = () => {
  const [selectedVideo, setSelectedVideo] = useState(cryptoVideos[0]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  return (
    <div className='mt-4'>
        <div className='mb-10'>
            <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-10 bg-[#e44243] rounded-full"></span>
                <h3 className="text-xl">GEMM TV</h3>
            </div>
            <div className="flex space-x-4">
              {/* Left side: Video List */}
              <div className="w-1/3 overflow-y-auto h-[500px] bg-black">
                {cryptoVideos.map((video, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer flex items-center gap-4 p-5 text-white hover:bg-[#e6423e] transition-colors ${selectedVideo === video ? 'bg-[#e6423e]' : 'bg-transparent'}`}
                    onClick={() => handleVideoClick(video)}
                  >
                    <img src={video.thumbnailUrl} alt={video.title} className='w-1/3 aspect-video object-cover'/>
                    <div>
                        <h3 className="text-md font-semibold">{video.title}</h3>
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
    </div>
  );
};

export default CryptoTV;
