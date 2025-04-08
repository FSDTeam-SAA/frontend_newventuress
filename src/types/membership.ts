export type MembershipPlan = {

  _id: string;
  planType: string;
  description: string;
  price: number;
  numberOfAuction: number;
  numberOfListing: number;
  numberOfBids: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  
  sponsoredListingPlanID?: {
    planTitle: string;
  };

  membershipPlanID?: {
    planType: string;
  };
  
  payMethod?: string;
  paymentMethod : string
  store : number
  time : string
  status: string; // Added property
};

export type MembershipResponse = {
  status: boolean;
  message: string;
  data: MembershipPlan[];
};

