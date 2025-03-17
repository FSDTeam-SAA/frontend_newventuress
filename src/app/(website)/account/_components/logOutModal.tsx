// Package imports
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";

// Local imports
import Modal from "@/components/shared/modal/modal";

interface Props {
  onModalClose: VoidFunction;
}

const LogOutModal = ({ onModalClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  const onLogout = async () => {
    setLoading(true);
    setTheme("light");

    // Clear cache & storage
    localStorage.clear();
    sessionStorage.clear();
    
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  return (
    <Modal>
      <div className="mt-6 max-h-[556px] max-w-[551px]">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/assets/img/logo.png"
            width={205}
            height={205}
            alt="Pacific Rim Fusion Logo"
          />
          <div className="mt-2 text-[37px] text-[#333] font-bold pb-2">
            PACIFIC RIM FUSION
          </div>
          <div className="leading-[38px] font-semibold text-[32px] text-gradient dark:text-gradient-pink">
            Are You Sure To Log Out?
          </div>
          <div className="font-normal text-[22px] text-[#102011] pb-3 pt-2 mb-5">
            Keep shopping with Rim Fusion.
          </div>

          <div className="w-[396px]">
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full relative dark:bg-white dark:text-[#6841A5] dark:border-[#B0B0B0]"
              disabled={loading}
            >
              Yes
              {loading && <Loader2 className="animate-spin absolute right-5" />}
            </Button>

            <div className="mt-4">
              <Button onClick={onModalClose} className="w-full">
                No
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LogOutModal;
