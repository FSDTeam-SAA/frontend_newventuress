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


  payMethod : string
  store : number
  time : string
};

export type MembershipResponse = {
  status: boolean;
  message: string;
  data: MembershipPlan[];
};

