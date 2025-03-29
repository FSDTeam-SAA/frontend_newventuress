export type AuctionDataTypeResponse = {
    status: boolean;
    message: string;
    data: AuctionDataType[];
    pagination: PaginationDataType;
};

export type AuctionDataType = {
    _id: string;
    vendorID?: string | null;
    title: string;
    shortDescription?: string;
    productType?: string;
    category?: CategoryDataType | null;
    openingPrice: number;
    startingDateAndTime: string;
    endingDateAndTime?: string;
    sku: string;
    stockQuantity: number;
    tags: string[];
    images: string[];
    createdAt: string;
    updatedAt: string;
    description?: string;
    industry?: string;
    subCategory?: string;
    reservePrice?: number;
    buyNowPrice?: number;
    quantity?: number;
    thc?: string;
    cbd?: string;
    country?: string;
    state?: string;
    makeAnOfferCheck?: boolean;
    makeAnOfferValue?: string;
    hasCOA?: boolean;
    coaImage?: string;
    auctionType?: string;
    productCondition?: string;
    bidIncrement?: string;
    productPolicy?: string;

    __v: number;
};

export type CategoryDataType = {
    _id: string;
    categoryName: string;
    image: string;
    slug: string;
    subCategory: string;
    __v: number;
    industry: string;
};

export type PaginationDataType = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
