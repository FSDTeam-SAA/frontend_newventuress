export type AllProductStatement = {
  title: string;
  description: string;
  _id: string;
};
export interface AllProductDataType {
   _id: string;
  storeId: string; 
  title: string;
  shortDescription: string;
  description: string;
  images: string[];
  productType: string;
  stockStatus: "in stock" | "out of stock";
  category: string; 
  subCategory: string;
  purchasedPrice: number;
  sellingPrice: number;
  regularPrice: number;
  size: string;
  quantity: string;
  sku: string; 
  coa: boolean; 
  tags: string[]; 
  review: string[]; 
  __v: number; 
  AllProductStatement: AllProductStatement[];
}

export interface AllProductDataResponse {
  success: boolean;
  message: string;
  data: AllProductDataType[];
  pagination: {
    totalPages: number;
  };
}
