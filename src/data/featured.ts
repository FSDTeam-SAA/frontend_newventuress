export type FeatureCardType = {
  _id: string; // Added the id property
  images: string[];
  price: string;
  originalPrice: string;
  category: string;
  flowerType: string;
  stoke: string;
  storeId: string; // Unique identifier for the store.
  title: string; // Product title.
  shortDescription: string; // A short description of the product.
  description: string; // Detailed description of the product.
  productType: string; // Type/category of the product, e.g., "cbd".
  stockStatus: string; // Stock status, e.g., "in stock".
  cateogry: string; // Category ID of the product.
  subCateogry: string; // Subcategory ID of the product.
  purchasedPrice: number; // Purchased price of the product.
  selllingPrice: number; // Selling price of the product.
  regularPrice: number; // Discount price of the product.
  size: string; // Size/quantity descriptor, e.g., "30ml".
  quantity: string; // Number of items available.
  sku: string; // Stock Keeping Unit identifier.
  coa: boolean; // Certificate of Analysis availability.
  tags: string[]; // Array of tags associated with the product.
  review: string[]; // Array of review IDs.
  __v: number; // Internal version number or metadata.
};
