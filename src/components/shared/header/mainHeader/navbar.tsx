"use client";
// Packages
import { usePathname } from "next/navigation";

// Local imports
import { cn } from "@/lib/utils";
import DesktopNavbar from "./DesktopNavbar";

interface Props {
  loggedin: boolean;
}

function Navbar({ loggedin }: Props) {
  const pathName = usePathname();

  // Hide navbar on /registration and its subroutes, and /vendor-dashboard and its subroutes
  const shouldHideNavbar =
    pathName.startsWith("/registration") || pathName.startsWith("/vendor-dashboard") || pathName === "/login";

  return (
    
    <header className={cn("bg-white", pathName !== "/" && "")}>
      <div className="lg:hidden">
        {/* Mobile & Tablet Navbar can be added here if needed */}
      </div>
      <div className="hidden lg:block">
        {!shouldHideNavbar && <DesktopNavbar pathName={pathName} loggedin={loggedin} />}
      </div>
    </header>
  );
}

export default Navbar;
