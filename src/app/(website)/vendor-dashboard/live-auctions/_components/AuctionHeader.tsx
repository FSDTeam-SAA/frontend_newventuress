"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Bidsmodal } from "./Bidsmodal";

interface AuctionHeaderProps {
  showAddAuction: boolean;
  setShowAddAuction: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuctionHeader: React.FC<AuctionHeaderProps> = ({
  showAddAuction,
  setShowAddAuction
}) => {
  const [showBids, setShowBids] = React.useState(false);

  return (
    <div className="h-[80px] w-full bg-white p-[8px] rounded-[12px] flex items-center justify-between">
      <div className="px-[10px] text-[12px] leading-[14.4px]">
        <span className="font-medium dark:text-black">All  (20) |</span>
        <span className="text-gradient dark:text-gradient-pink"> Published (30) | </span>
        <span className="text-gradient dark:text-gradient-pink"> Draft (30) | </span>
        <span className="text-gradient dark:text-gradient-pink"> Pending (30) | </span>
        <span className="text-gradient dark:text-gradient-pink"> Archived (30) </span>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => setShowAddAuction((prev) => !prev)}>
          {showAddAuction ? "All Auctions" : "Add New Auction"}
        </Button>
      <Button onClick={() => setShowBids(true)}> 
            Bids Settings <Settings /> 
        </Button>
        
      </div>
      <Bidsmodal isOpen={showBids} onClose={() => setShowBids(false)} />
    </div>
  );
};

export default AuctionHeader;
