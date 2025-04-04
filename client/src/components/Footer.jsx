import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const SOCIAL_MEDIAS = [
  {
    title: "Facebook",
    icon: FaFacebook
  },
  {
    title: "Instagram",
    icon: FaInstagram
  },
  {
    title: "Twitter",
    icon: FaTwitter
  },
  {
    title: "Youtube",
    icon: FaYoutube
  }
];

const Footer = () => {
  return (
    <div className="w-full lg:px-40 md:px-20 px-10 py-10 bg-[#212529]">
      <div className="flex flex-col justify-between gap-5 lg:flex-row">
        <h1 className="text-lg font-bold text-primaryText">Gemme Studio.</h1>
        <ul className="flex flex-col gap-5 text-sm font-medium text-slate-300 md:flex-row">
          <li>
            <Link>About Studio</Link>
          </li>
          <li>
            <Link>Archive</Link>
          </li>
          <li>
            <Link>Policies</Link>
          </li>
        </ul>
      </div>
      <div className="bg-[#E5E5E5] h-[1px] w-full mt-5 mb-20 text-slate-300">
        <div className="float-right mt-4">
          <h4 className="text-sm text-right">Contact us</h4>
          <ul className="flex items-center gap-4 mt-2 [&>li]:cursor-pointer">
            {SOCIAL_MEDIAS.map(item => {
              return (
                <li title={item.title} key={item.title} className="transition-colors hover:text-white">
                  <item.icon />
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="flex justify-between gap-2 text-sm font-medium text-slate-300">
        <p>Copyright © 2025 by Coin68.</p>
        <p>All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
