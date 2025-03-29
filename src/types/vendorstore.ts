// Vendor Information Type
export type VendorInfo = {
  _id: string;
  fullName: string;
  email: string;
};

// General Store Settings Type
export type GeneralSetting = {
  storeName: string;
  storeLogo: string;
  storeEmail: string;
  storeShortDescription: string;
  facebookURL: string;
};

// Social Media Settings Type
export type SocialMediaSetting = {
  _id: string;
  facebookTitle: string;
  facebookURL: string;
  instaTitle: string;
  instaURL: string;
};

// Store Policies and Support Information Type
export type PolicyAndSupport = {
  _id: string;
  policyTabLabel: string;
  shippingPolicy: string;
  returnPolicy: string;
  cancellationPolicy: string;
};

// Customer Support Details Type
export type CustomerSupport = {
  _id: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  province: string;
};

// Address Type (Used for Billing and Shipping)
type Address = {
  _id: string;
  name: string;
  address: string;
  country: string;
  province: string;
};

// Store Data Type (Main Object Connecting All Entities)
export type StoreData = {
    _id:string
   generalSetting: GeneralSetting[];
  billingAddress: Address[];
  shippingAddress: Address[];
  customerSupport: CustomerSupport[];
  rating: number;
};

// API Response Type
export type vedorestoreDataResponse = {
    status:boolean
  data: StoreData[];
};

export type Product = {
  photos: string[];
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  images: string[];
  productType: string;
  stockStatus: 'in stock' | 'out of stock'  // You can extend stock status if needed
  category: string;
  subCategory: string;
  selllingPrice: number;
  regularPrice: number;
  size: string;
  quantity: string; // You may want to consider changing this to a number if it's always numeric
  sku: string;
  coa: boolean;
  tags: string[];
  review: string[];
  __v: number;
  purchases: number;
  storeID: string;
  country?: string;
  thc?: string;
  cbd?: string;
  state?: string;
  soldMark?: boolean;
  productPolicy?: string;
};

export type VendorAuctionListingResponse = {
  success: boolean;
  message: string;
  data: Product[],
  meta: {
    totalProducts: number;
    totalPages: number;
    currentPage: number
  }
}

