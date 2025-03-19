// import Hideon from "@/provider/Hideon";
import { Instagram, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Define routes where the footer should be hidden
// const HIDE_ROUTES = [
//   "/age-alert",
//   "/vendor-dashboard",
//   "/login",
//   "/registration",
//   "/forgot-password",
// ];

// Define an array of links for the footer
const footerLinks = [
  {
    title: "Information",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms and Conditions", href: "/term-and-conditions" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  // {
  //   title: "Discover",
  //   links: [
  //     { label: "Live Auction", href: "/live-auctions" },
  //     { label: "Features", href: "/features" },
  //     { label: "Ending Soon", href: "/ending-soon" },
  //     { label: "Features Auction", href: "/features-auction" },
  //   ],
  // },
];

const Footer = () => {
  return (
    // <Hideon routes={HIDE_ROUTES}>
      <footer className="bg-[#101218] text-white pt-12 lg:pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Footer Content Layout */}
          <div className="grid grid-cols-4 gap-6 lg:gap-x-24">
            {/* Logo Column */}
            <div className="flex flex-col items-center col-span-4 lg:col-span-1">
              <Link href="/" aria-label="Go to homepage">
                <Image
                  src="/assets/logo.png"
                  alt="Pacific Rim Fusion Logo"
                  width={91}
                  height={91}
                  className="mb-4"
                />
              </Link>
              <h2 className="text-[18px] font-semibold mb-1 text-[#ffffff]">
                PACIFIC RIM FUSION
              </h2>
              {/* <p className="text-[#E6EEF6] text-[16px]">Share The Balance</p> */}
            </div>

            {/* Information & Discover Columns */}
            <div className="col-span-4 lg:col-span-2">
              <div className="grid grid-cols-2 gap-10 lg:gap-24">
                {footerLinks.map(({ title, links }) => (
                  <div key={title}>
                    <h3 className="text-[16px] font-medium mb-4 border-[#E6EEF6] border-b-[1px] pb-[10px]">
                      {title}
                    </h3>
                    <ul className="space-y-2">
                      {links.map(({ label,href }) => (
                        <li key={label}>
                          <Link
                            href={href}
                            className="text-[#E6EEF6] text-[14px] font-normal hover:text-white transition-colors "
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div >
                    <h3 className="text-[16px] font-medium mb-4 border-[#E6EEF6] border-b-[1px] pb-[10px]">
                      Our Social
                    </h3>
                    <ul className="gap-x-5 flex items-center ">
                      <a href="https://www.instagram.com/pacific_rim_fusion/" target="_blank"><Instagram className="hover:text-primary-pink-hover" /></a>
                      <a href="https://x.com/PacificRmFusion" target="_blank"><Twitter className="hover:text-primary-pink-hover" /></a>
                      <a href="https://www.youtube.com/@PacificRimFusion" target="_blank"><Youtube className="hover:text-primary-pink-hover" /></a>
                    </ul>
                  </div>

            {/* Locate Us Section */}
            {/* <div className="col-span-3 lg:col-span-1">
              <h3 className="text-[16px] font-medium mb-4 border-[#E6EEF6] border-b-[1px] pb-[10px] w-[160px] lg:w-[200px]">
                Locate Us
              </h3>
              <p className="text-[#E6EEF6] text-[14px]">
                2 Star Circle Star Way,
                <br />
                San Carlos, CA 94070
              </p>
            </div> */}

            {/* Footer Bottom Text */}
            <div className="lg:col-end-5 lg:col-span-3 col-span-4 text-[#D9D9D9] text-[10px] lg:text-[14px] text-center lg:text-start mt-2 lg:mt-8">
              <p>
                Copyright 2025 Pacific Rim Fusion © - All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    // </Hideon>
  );
};

export default Footer;
