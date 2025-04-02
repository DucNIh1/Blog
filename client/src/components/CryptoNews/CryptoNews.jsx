import './style.css';

const articles = [
  {
    title: "Những khái niệm cần biết cho người chập chững tìm hiểu về tiền điện tử",
    description: "Bài viết cung cấp những khái niệm cơ bản về tiền điện tử, bao gồm sự ra đời của Bitcoin và vai trò của công nghệ blockchain.",
    imageUrl: "https://images.unsplash.com/photo-1641802914005-2a9b0f3165b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3J5cHRvY3VycmVuY3l8ZW58MHwxfDB8fHww",
    link: "https://dantri.com.vn/cong-nghe/nhung-khai-niem-can-biet-cho-nguoi-chap-chung-tim-hieu-ve-tien-dien-tu-20250228162359113.htm"
  },
  {
    title: "Tiền điện tử là gì? Quy định mới về tiền điện tử từ 01/7/2024 theo Nghị định 52/2024/NĐ-CP",
    description: "Tìm hiểu về tiền điện tử và các quy định pháp luật mới nhất liên quan đến loại hình tài sản này tại Việt Nam.",
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y3J5cHRvY3VycmVuY3l8ZW58MHwxfDB8fHww",
    link: "https://thuvienphapluat.vn/phap-luat/ho-tro-phap-luat/tien-dien-tu-la-gi-quy-dinh-moi-ve-tien-dien-tu-tu-0172024-theo-nghi-dinh-522024ndcp-the-nao-154660.html"
  },
  {
    title: "Tiền điện tử đã dạy cho chúng ta những bài học đắt giá gì trong năm 2022?",
    description: "Những bài học rút ra từ thị trường tiền điện tử trong năm 2022, giúp nhà đầu tư có cái nhìn thực tế hơn.",
    imageUrl: "https://plus.unsplash.com/premium_photo-1663931932735-8694976211ed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y3J5cHRvY3VycmVuY3l8ZW58MHwxfDB8fHww",
    link: "https://markettimes.vn/tien-dien-tu-da-day-cho-chung-ta-nhung-bai-hoc-dat-gia-gi-trong-nam-2022-12590.html"
  },
  {
    title: "Tiền điện tử là gì và bạn sử dụng chúng như thế nào?",
    description: "Giải thích về tiền điện tử và cách thức hoạt động của chúng trong nền kinh tế số hiện đại.",
    imageUrl: "https://images.unsplash.com/photo-1621761119692-595bf443cbc2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNyeXB0b2N1cnJlbmN5fGVufDB8MXwwfHx8MA%3D%3D",
    link: "https://dnrtv.org.vn/tin-tuc-n76984/tien-dien-tu-la-gi-va-ban-su-dung-chung-nhu-the-nao.html"
  },
  {
    title: "Những điều cần biết về tiền điện tử",
    description: "Tổng hợp những thông tin cơ bản và quan trọng về tiền điện tử mà người dùng cần nắm bắt.",
    imageUrl: "https://images.unsplash.com/photo-1621264448270-9ef00e88a935?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNyeXB0b2N1cnJlbmN5fGVufDB8MXwwfHx8MA%3D%3D",
    link: "https://www.binance.com/vi/blog/markets/nh%E1%BB%AFng-%C4%91i%E1%BB%81u-c%E1%BA%A7n-bi%E1%BA%BFt-v%E1%bb%81-ti%E1%BB%81n-%C4%91i%E1%BB%87n-t%E1%BB%AD-421499824684902837"
  }
  // Thêm các bài viết khác tại đây
];

const CryptoNews = () => {
  return (
    <div className="App">
        <div className="section-title">
            <h2>E-magazine</h2>
            <p>Latest Crypto News</p>
        </div>
        <div className='grid grid-cols-5 gap-4'>
            {articles.map((article, index) => (
                <div key={index} className="slide-item">
                <a href={article.link} target="_blank" rel="noopener noreferrer">
                    <div className="article-card">
                        <img src={article.imageUrl} alt={article.title} />
                        <div className="article-content">
                            <h3>{article.title}</h3>
                            <p>{article.description}</p>
                        </div>
                    </div>
                </a>
                </div>
            ))}
        </div>
    </div>
  );
}

export default CryptoNews;
