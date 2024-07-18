import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPurchaseDeliveryDetailReport } from "@/query/reportRequest";
import { format } from "date-fns";

function ReceivingReport() {
  const [startDate, setStartDate] = useState("2024-06-01");
  const [endDate, setEndDate] = useState("2024-06-30");

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

  const filterByDateDelivered = (array, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return array.filter((item) => {
      const dateDelivered = new Date(item.DATEDELIVERED);
      return dateDelivered >= start && dateDelivered <= end;
    });
  };

  const filteredData =
    purchaseDeliveryData &&
    filterByDateDelivered(purchaseDeliveryData, startDate, endDate);

  return (
    <div>
      {/* <div className="mb-6">
        <h1 className="text-xl font-bold">ReceivingReport</h1>
      </div> */}

      <div className="flex gap-4 mt-6">
        <label>
          Start Date:
          <input
            className="w-full p-1 border border-gray-500 rounded-full mt-2"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            className="w-full p-1 border border-gray-500 rounded-full mt-2"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      <div className="table-container-report mt-4">
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
            {filteredData &&
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-100 cursor-pointer ${
                    index % 2 !== 0 ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    {format(new Date(item.DATEDELIVERED), "MM-dd-yyyy")}
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

export default ReceivingReport;
