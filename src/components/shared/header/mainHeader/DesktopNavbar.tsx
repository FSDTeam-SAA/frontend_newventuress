// Packages
import { PopoverGroup } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";

// Local imports
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import HeaderIconMenu from "../headerIconMenu/headerIconMenu";
import AuctionList from "./AuctionList";
// import Dropdown, { AuctionMobileMenu } from "./demonav";
import PagesList from "./PagesList";

interface DesktopNavbarProps {
  pathName: string;
  loggedin: boolean;
}

const Navicons = [
  {
    href: "/notifications",
    src: "/assets/svg/bell.svg",
    alt: "bell-icon",
    count: 4,
    srOnlyText: "View notifications",
  },
  {
    href: "/wishlist",
    src: "/assets/svg/heart.svg",
    alt: "heart-icon",
    srOnlyText: "View wishlist",
  },
  {
    href: "/cart",
    src: "/assets/svg/cart-icon.svg",
    alt: "cart-icon",
    count: 2,
    srOnlyText: "View cart",
  },
  {
    href: "/account",
    src: "/assets/svg/user-circle.svg",
    alt: "user-icon",
    srOnlyText: "View account",
  },
];

function DesktopNavbar({ pathName, loggedin }: DesktopNavbarProps) {
  return (
    <nav
      aria-label="Global"
      className="mx-auto h-[74px] flex container items-center justify-between"
    >
      <div className="flex ">
        <Link href="/" className="">
          <span className="sr-only">Pacific Rim</span>
          <Image
            alt=""
            src="/assets/img/header-logo.png"
            width={92}
            height={50}
            className="h-[50px] w-[92px] lg:w-[100px]"
          />
        </Link>
      </div>
      <PopoverGroup className="hidden lg:flex lg:gap-x-[36px] ">
        <Link
          href="/"
          className={cn(
            "text-[20px] font-medium hover:text-primary-blue-main dark:hover:text-primary-pink-main",
            pathName === "/" ? "text-primary-blue-main dark:text-primary-pink-main" : "text-black font-normal"
          )}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={cn(
            "text-[20px] font-medium hover:text-primary-blue-main dark:hover:text-primary-pink-main",
            pathName === "/about" ? "text-primary-blue-main dark:text-primary-pink-main" : "text-black font-normal"
          )}
        >
          About
        </Link>
        <Link
          href=""
          className={cn(
            "text-[20px] font-medium hover:text-primary-blue-main dark:hover:text-primary-pink-main",
            pathName === "/products"
              ? "text-primary-blue-main dark:text-primary-pink-main"
              : "text-black font-normal"
          )}
        >
          <AuctionList />
        </Link>
        <Link
          href="/blogs"
          className={cn(
            "text-[20px] font-medium hover:text-primary-blue-main dark:hover:text-primary-pink-main",
            pathName === "/blogs" ? "text-primary-blue-main dark:text-primary-pink-main" : "text-black font-normal"
          )}
        >
          Blog
        </Link>
        <Link
          href=""
          className={cn(
            "text-[20px] font-medium hover:text-primary-blue-main dark:hover:text-primary-pink-main",
            pathName === "" ? "text-primary-blue-main dark:text-primary-pink-main" : "text-black font-normal"
          )}
        >
          <PagesList />
        </Link>
        <Link
          href="/contact"
          className={cn(
            "text-[20px] font-medium hover:text-primary-blue-main dark:hover:text-primary-pink-main",
            pathName === "/contact" ? "text-primary-blue-main dark:text-primary-pink-main" : "text-black font-normal"
          )}
        >
          Contact
        </Link>
      </PopoverGroup>
      <div>
        {!loggedin ? (
          <div className="hidden lg:flex lg:flex-1 gap-x-[20px] lg:justify-end">
            <Button variant="outline" asChild size="md">
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="md" asChild>
              <Link href="/registration">Sign up</Link>
            </Button>
          </div>
        ) : (
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <HeaderIconMenu icons={Navicons} />
          </div>
        )}
      </div>
    </nav>
  );
}

export default DesktopNavbar;
