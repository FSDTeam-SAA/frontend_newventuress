"use client";
// local import
import OurAuction from "@/app/(website)/_components/our_auction";
import OurFeatureSection from "@/app/(website)/_components/our_feature_section";
import FindFavourite from "../../app/(website)/_components/FindFavourite";
import PopularCategoriesCard from "../shared/cards/PopularCategoriesCard";

interface Props {
  loggedin: boolean;
  token: string | null
}

const PopularCategories = ({ loggedin, token }: Props) => {
  return (
    <div className=" pt-[54px]  pb-[40px] md:pb-[100px] section rounded-[16px]  lg:rounded-[52px] bg-[#E6EEF6] dark:bg-[#482D721A]">
     

      {/*================= cardd ========================= */}
        <PopularCategoriesCard token={token}/>
     

      {/*///////////// find favourite if user not found then show it ///////////////////// */}
      {!loggedin && (
        <div className="container ">
          <FindFavourite />
        </div>
      )}

      {loggedin && (
        <>
          <OurFeatureSection token={token} />
          <OurAuction token={token} />
        </>
      )}
    </div>
  );
};

export default PopularCategories;
