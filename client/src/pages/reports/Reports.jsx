import React from "react";

import { useQuery } from "@tanstack/react-query";
import { getPurchaseDeliveryDetailReport } from "@/query/reportRequest";
import { format } from "date-fns";

function Reports() {
  const {
    isPending: isPurchaseDeliveryPending,
    error: purchaseDeliveryError,
    data: purchaseDeliveryData,
    refetch: refetchPurchaseDeliveryData,
  } = useQuery({
    queryKey: ["purchasedeliverydetailreport"],
    queryFn: getPurchaseDeliveryDetailReport,
  });

  const formatNumberWithCommas = (number) => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div>
      <div className="mb-6 ">
        <h1 className="text-xl font-bold">Reports</h1>
      </div>

      <div className="table-container-report">
        <table className="min-w-full table-fixed-header text-[12px]">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300 w-[100px]">
                DATE DELIVERED
              </th>
              <th className="px-4 py-2 border border-gray-300 w-[50px]">
                PURCHASEDELIVERY NO.
              </th>
              <th className="px-4 py-2 border border-gray-300 w-[50px]">
                ITEM CODE
              </th>
              <th className="px-4 py-2 border border-gray-300 w-[300px]">
                MATERIAL NAME
              </th>
              <th className="px-4 py-2 border border-gray-300 w-[100px]">
                QUANTITY
              </th>
              <th className="px-4 py-2 border border-gray-300 w-[100px]">
                UNIT
              </th>
            </tr>
          </thead>
          <tbody className="bg-white text-[10px]">
            {purchaseDeliveryData &&
              purchaseDeliveryData.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-100 cursor-pointer ${
                    index % 2 !== 0 ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    {format(item.DATEDELIVERED, "MM-dd-yyyy")}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 ">
                    {item.PURCHASEDELIVERYNO}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 text-center">
                    {item.ITEMCODE}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 font-bold">
                    {item.MATERIALNAME}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 text-center font-bold ">
                    <p> {formatNumberWithCommas(parseFloat(item.QTY))}</p>
                  </td>
                  <td className="px-4 py-1 border border-gray-300  text-center">
                    {item.UNIT}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
