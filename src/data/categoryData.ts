export type categoryStatement = {
  title: string;
  description: string;
  _id: string;
};
export interface categoryDataType {
  _id: string;
  categoryName: string;
  image: string;
  slug: string;
  subCategory: number;
  shortDescription: string;
  __v: number;
  categoryStatement: categoryStatement[];
}

export interface categoryDataResponse {
  success: boolean;
  message: string;
  data: categoryDataType[];
  pagination: {
    totalPages: number;
  };
}
