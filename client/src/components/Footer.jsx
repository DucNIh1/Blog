import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="w-full lg:px-40 md:px-20 px-10 py-10 bg-[#212529]">
      <div className="flex flex-col justify-between gap-5 lg:flex-row">
        <h1 className="text-lg font-bold text-primaryText">Gemme Studio.</h1>
        <ul className="flex flex-col gap-5 text-sm font-medium text-slate-300 md:flex-row">
          <li>
            <Link> About Studio</Link>
          </li>
          <li>
            <Link>Archive</Link>
          </li>
          <li>
            <Link>Contact Us</Link>
          </li>
        </ul>
      </div>
      <div className="bg-[#E5E5E5] h-[1px] w-full mt-5 mb-20"></div>

      <div className="flex justify-between gap-2 text-sm font-medium text-slate-300">
        <p>From Dong Anh, Ha Noi, VN</p>
        <p>© 2024, All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
