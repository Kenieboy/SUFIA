import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductConsumptionReport } from "@/query/reportRequest";

function ProductConsumptionReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    isPending: isProductionConsumptionPending,
    error: productionConsumptionError,
    data: productionConsumptionData,
    refetch: refetchProductionConsumptionData,
  } = useQuery({
    queryKey: ["productionconsumption", startDate, endDate],
    queryFn: () => getProductConsumptionReport(startDate, endDate),
    enabled: false,
  });

  const handleFetchData = () => {
    if (startDate && endDate) {
      refetchProductionConsumptionData();
    }
  };

  // Function to group data by ITEMCATEGORYDESCRIPTION
  const groupData = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.ITEMCATEGORYDESCRIPTION]) {
        acc[item.ITEMCATEGORYDESCRIPTION] = {};
      }
      if (!acc[item.ITEMCATEGORYDESCRIPTION][item.PRODUCTID]) {
        acc[item.ITEMCATEGORYDESCRIPTION][item.PRODUCTID] = {
          PRODUCTNAME: item.PRODUCTNAME,
          materials: [],
        };
      }
      acc[item.ITEMCATEGORYDESCRIPTION][item.PRODUCTID].materials.push(item);
      return acc;
    }, {});
  };

  const groupedData = productionConsumptionData
    ? groupData(productionConsumptionData)
    : {};

  // Calculate the Overall Total Cost
  const overallTotalCost = productionConsumptionData
    ? productionConsumptionData.reduce(
        (sum, item) => sum + parseFloat(item.TOTALCOST || 0),
        0
      )
    : 0;

  const formattedTotalCost = overallTotalCost.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div>
      {/* Date Inputs */}
      <div className="flex items-center gap-4 mt-6">
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
        <div>
          <button
            onClick={handleFetchData}
            className="px-4 py-2 bg-green-500 text-white rounded-full"
          >
            Fetch Report
          </button>
        </div>
      </div>

      {/* Loading and Error Handling */}
      {/* {isProductionConsumptionPending && <p>Loading...</p>}
      {productionConsumptionError && (
        <p>Error: {productionConsumptionError.message}</p>
      )} */}

      {/* Render Report */}
      {productionConsumptionData && (
        <div>
          <h2 className="text-xl font-bold mt-6">
            Material Consumption Report
          </h2>
          <p>
            From {startDate} to {endDate}
          </p>

          {Object.entries(groupedData).map(([category, products]) => (
            <div key={category} className="mt-4">
              <h3 className="text-lg font-semibold bg-gray-200 p-2">
                {category.toUpperCase()}
              </h3>
              <table className="w-full border mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-3 py-1">Product ID</th>
                    <th className="border px-3 py-1">Product Name</th>
                    <th className="border px-3 py-1">Item Name</th>
                    <th className="border px-3 py-1">Qty</th>
                    <th className="border px-3 py-1">Unit</th>
                    <th className="border px-3 py-1">Unit Cost</th>
                    <th className="border px-3 py-1">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(products).map(
                    ([productId, { PRODUCTNAME, materials }]) => (
                      <React.Fragment key={productId}>
                        {materials.map((material, index) => (
                          <tr key={material.MATERIALNAME} className="border-b">
                            {index === 0 && (
                              <>
                                <td
                                  rowSpan={materials.length}
                                  className="border px-3 py-1 text-center"
                                >
                                  {productId}
                                </td>
                                <td
                                  rowSpan={materials.length}
                                  className="border px-3 py-1"
                                >
                                  {PRODUCTNAME}
                                </td>
                              </>
                            )}
                            <td className="border px-3 py-1">
                              {material.MATERIALNAME}
                            </td>
                            <td className="border px-3 py-1 text-center">
                              {material.QTY}
                            </td>
                            <td className="border px-3 py-1">
                              {material.UNIT}
                            </td>
                            <td className="border px-3 py-1 text-right">
                              {parseFloat(material.UNITCOST).toFixed(2)}
                            </td>
                            <td className="border px-3 py-1 text-right">
                              {parseFloat(material.TOTALCOST).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ))}

          {/* Overall Total Cost Row */}
          <div className="mt-4">
            <table className="w-full border">
              <tfoot>
                <tr className="bg-gray-300 font-semibold">
                  <td colSpan="6" className="text-right px-3 py-2">
                    Overall Total Cost:
                  </td>
                  <td className="px-3 py-2 text-right">{formattedTotalCost}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductConsumptionReport;
