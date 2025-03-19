export interface OurAuctionProduct {
    _id: string;
    storeId: string;
    title: string;
    shortDescription: string;
    description: string;
    images: string[];
    productType: string;
    stockStatus: string;
    cateogry: string;
    subCateogry: string;
    purchasedPrice: number;
    selllingPrice: number;
    regularPrice: number;
    size: string;
    quantity: string;
    sku: string;
    coa: boolean;
    startingPrice: number;
    endingTime: string;
    startingTime: string;
    tags: string[];
    review: string[];
    __v: number;
    purchases: number;
    isLoading: boolean
  }

  export interface OurAuctionProductResponse {
    status: boolean;
    data?: OurAuctionProduct[],
    message?: string
  }