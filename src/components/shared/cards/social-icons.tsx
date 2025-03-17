// package import
import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import { GrInstagram } from "react-icons/gr";
import { ImYoutube } from "react-icons/im";
// import { TfiFacebook, TfiLinkedin } from "react-icons/tfi";

export default function SocialIcons() {
  return (
    <div className="flex items-center gap-x-[20px] text-[#102f4d]">
      <Link
        href="https://www.instagram.com/pacific_rim_fusion/"
        className="border rounded-full border-[#0057A8] hover:bg-primary dark:hover:hover:bg-pinkGradient dark:border-[#6841A5] hover:text-white w-[40px] lg:w-[44px] h-[40px] lg:h-[44px] flex justify-center items-center"
      >
        <GrInstagram className="w-[20px] h-[30px]  hover:text-white " />
      </Link>
      {/* <Link
        href="/"
        className="border rounded-full border-[#0057A8] hover:bg-primary dark:hover:hover:bg-pinkGradient dark:border-[#6841A5] hover:text-white  w-[40px] lg:w-[44px] h-[40px] lg:h-[44px] flex justify-center items-center"
      >
        <TfiFacebook className="w-[20px] h-[30px]" />
      </Link> */}
      {/* <Link
        href="/"
        className="border rounded-full border-[#0057A8] hover:bg-primary dark:hover:hover:bg-pinkGradient dark:border-[#6841A5] hover:text-white  w-[40px] lg:w-[44px] h-[40px] lg:h-[44px] flex justify-center items-center"
      >
        <TfiLinkedin className="w-[20px] h-[30px]" />
      </Link> */}
      <Link
        href="https://www.youtube.com/@PacificRimFusion"
        className="border rounded-full border-[#0057A8] hover:bg-primary dark:hover:hover:bg-pinkGradient dark:border-[#6841A5] hover:text-white  w-[40px] lg:w-[44px] h-[40px] lg:h-[44px] flex justify-center items-center"
      >
        <ImYoutube className="w-[20px] h-[30px]" />
      </Link>
      <Link
        href="https://x.com/PacificRimFusion"
        className="border rounded-full border-[#0057A8] hover:bg-primary dark:hover:hover:bg-pinkGradient dark:border-[#6841A5] hover:text-white  w-[40px] lg:w-[44px] h-[40px] lg:h-[44px] flex justify-center items-center"
      >
        <BsTwitterX className="w-[20px] h-[30px]" />
      </Link>
    </div>
  );
}
