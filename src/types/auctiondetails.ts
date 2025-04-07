export type AuctionData = {
  _id: string;
  category: string;
  createdAt: string; // ISO date string
  endingDateAndTime: string; // ISO date string
  highestBid: number;
  images: string[];
  shortDescription: string;
  sku: string;
  startingPrice: number;
  startingDateAndTime: string; // ISO date string
  stockQuantity: number;
  tags: string[]; // Assuming it's an array of strings
  title: string;
  updatedAt: string; // ISO date string
    vendorID: string;
    length: number;
    description: string;
    storeName: string;
  storeLogo: string;
  __v: number;
};

export type AuctionResponse = {
  status: boolean;
  message: string;
  data: AuctionData;
};