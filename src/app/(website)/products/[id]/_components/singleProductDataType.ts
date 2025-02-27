export type SingleProductStatement = {
  title: string;
  description: string;
  _id: string;
};
export interface SingleProductDataType {
    data: {
      title: string;
        _id: string;
  storeId: string;
  shortDescription: string;
  description: string;
  images: string[];
  productType: string;
  stockStatus: string;
  cateogry: string; 
  subCateogry: string; 
  purchasedPrice: number;
  selllingPrice: number; 
  discountPrice: number;
  size: string;
  quantity: string | number; 
  sku: string;
  coa: boolean;
  tags: string[];
  review: string[];
  __v: number; 
    };

  SingleProductStatement: SingleProductStatement[];
}

export interface SingleProductDataResponse {
  success: boolean;
  message: string;
  data: SingleProductDataType[];
  pagination: {
    totalPages: number;
  };
}
