"use client";
// package import 
// import Link from "next/link";

// local import 
import { ButtonArrow } from "../shared/button/ButtonArrow";
import SmButtonArrow from "../shared/button/SmButtonArrow";

// interface Product {
//   id: number;
//   status: string;
//   price: number;
//   quantity: number;
//   date: string;
// }

// const products: Product[] = [
//   {
//     id: 187,
//     status: "On the way",
//     price: 7000.0,
//     quantity: 6,
//     date: "8 Sep, 2020",
//   },
//   {
//     id: 22,
//     status: "Completed",
//     price: 7000.0,
//     quantity: 3,
//     date: "8 Sep, 2020",
//   },
//   {
//     id: 3344,
//     status: "On the way",
//     price: 7000.0,
//     quantity: 9,
//     date: "8 Sep, 2020",
//   },
//   {
//     id: 343,
//     status: "Processing",
//     price: 7000.0,
//     quantity: 9,
//     date: "8 Sep, 2020",
//   },
//   {
//     id: 9343,
//     status: "On the way",
//     price: 7000.0,
//     quantity: 9,
//     date: "8 Sep, 2020",
//   },
//   {
//     id: 3343,
//     status: "Processing",
//     price: 7000.0,
//     quantity: 9,
//     date: "8 Sep, 2020",
//   },
// ];
const OrderHistory = () => {
  return (
    <div>
      <div className="  ">
        {/* Table for medium and larger screens */}
        <div className="w-full hidden lg:block overflow-hidden rounded-lg  border-[#C5C5C5] border-[1px]">
          <div className="flex justify-between items-center p-3">
            <h1 className="text-[32px] font-semibold my-5 text-gradient dark:text-gradient-pink">
              Recent Order History
            </h1>

            <ButtonArrow text=" Explore More" href="/"/>
          </div>
          <table className="w-full ">
            <thead className="bg-gray-100  dark:bg-[#482D721A]">
              <tr className="">
                <th className="px-6 py-4 text-left text-[16px] font-medium text-[#444444]">
                  Order Id{" "}
                </th>
                <th className="px-6 py-4 text-left text-[16px] font-medium text-[#444444]">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-[16px] font-medium text-[#444444]">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-[16px] font-medium text-[#444444]">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-[16px] font-medium text-[#444444]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 ">
              {/* <p className="text-2xl font-semibold text-center w-full py-10">No order found! </p> */}
              {/* {products.map((product) => (
                <tr className="hover:bg-[#E6EEF6] dark:hover:bg-[#482D721A] text-[#444444] text-[16px] font-normal" key={product.id}>
                  <td className="px-6 py-4 ">
                    <p className="">#{product.id}</p>
                  </td>
                  <td className="px-6 py-4 ">
                    {product.date}
                  </td>
                  <td className="px-6 py-4">
                    {product.price} ({product.quantity} products)
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {product.status}
                  </td>
                  <td className="px-6 py-4 text-gradient font-medium dark:text-gradient-pink">
                    <Link href="#"> view Details </Link>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
            <h3 className="text-[20px] leading-[24px] text-center w-full font-semibold py-3 text-gradient border-b">
           No Order Found!
          </h3>
        </div>

        {/* Card layout for small screens */}
        <div className="lg:hidden border border-[#C5C5C5] rounded-lg">
          {/* <span className="text-[20px] leading-[24px] text-center font-semibold py-3 text-gradient border-b">
            Recent Order History
          </span> */}
          {/* <span className="text-[20px] leading-[24px] text-center font-semibold py-3 text-gradient border-b dark:text-black">
            No Order Found!
          </span> */}
          {/* {products.map((product) => (
            <div
              key={product.id}
              className=" w-full  border-b border-[#C5C5C5] p-3  hover:bg-[#E6EEF6] dark:hover:bg-[#482D721A] "
            >
              <div className="flex justify-between gap-4 mb-4">
                <p className="text-[16px] font-normal text-[#444444]">
                  Order Id:{" "}
                </p>
                <span className="text-[16px] font-normal text-gray-900">
                  #{product.id}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[16px] font-normal text-[#444444]">
                    Date:
                  </span>
                  <span className="text-[16px] font-normal text-[#444444]">
                    {" "}
                    {product.date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[16px] font-normal text-[#444444]">
                    Total:
                  </span>
                  <span className="text-[16px] font-normal text-[#444444]">
                    {" "}
                    {product.price} ({product.quantity} products)
                  </span>
                </div>
                <div className="flex justify-between pt-2 ">
                  <span className="text-[16px] font-normal text-[#444444]">
                    Status:
                  </span>
                  <span className="text-[16px] font-normal text-[#444444]">
                    {product.status}
                  </span>
                </div>
                <div className="text-[16px] p-2 text-sm text-center text-gradient ">
                  <Link href="#"> View Details </Link>
                </div>
              </div>
            </div>
          ))} */}
             <h3 className="text-[20px] leading-[24px] text-center w-full font-semibold py-3 text-gradient border-b">
            No Order Found!
          </h3>
          <div className="mx-auto flex py-5">
            <SmButtonArrow text={"Explore More"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
