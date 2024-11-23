import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Separator } from "@/components/ui/separator";

// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getProductSection,
  getProductStandardConsumptionDetail,
} from "@/query/productionRequest";
import { CircleX } from "lucide-react";
import {
  loadDailyConsumptionData,
  updateDialyConsumptionItemQty,
} from "@/redux/standardConsumptionSlice";

function DailyConsumptionEntry() {
  const { selectedProduct, dailyConsumption } = useSelector(
    (state) => state.scData
  );
  const dispatch = useDispatch();

  const [selectedSection, setSelectedSection] = useState(null);

  const {
    isPending: isSectionPending,
    error: SectionError,
    data: sectionData,
    refetch: refetchSectionData,
  } = useQuery({
    queryKey: ["productionsection"],
    queryFn: getProductSection,
  });

  const {
    data: anotherDetailData,
    isLoading: isAnotherDetailLoading,
    refetch: refetchAnotherDetail,
  } = useQuery({
    queryKey: ["anotherDetail", selectedSection],
    queryFn: () =>
      getProductStandardConsumptionDetail({
        productItemId: selectedProduct.PRODUCTITEMID,
        sectionId: selectedSection?.sectionId,
      }),
    enabled: false,
  });

  useEffect(() => {
    if (selectedSection && selectedSection.sectionId) {
      refetchAnotherDetail();
    }
  }, [selectedSection]);

  useEffect(() => {
    if (
      anotherDetailData && // Ensure data exists
      Array.isArray(anotherDetailData)
    ) {
      // Dispatch the action to update Redux state
      dispatch(loadDailyConsumptionData(anotherDetailData));
    }
  }, [anotherDetailData, dispatch]);

  const handleSectionChange = (e) => {
    const selectedSectionId = Number(e.target.value);

    setSelectedSection({ sectionId: selectedSectionId });

    setTimeout(() => {
      refetchAnotherDetail();
    }, 0);
  };

  const formatNumberWithCommas = (number) => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  console.log(anotherDetailData);

  return (
    <div>
      <h1 className="text-xl font-bold">Daily Product Consumption</h1>
      <div className="mt-6">
        <h2 className="text-xl">Selected Product:</h2>
        {selectedProduct.PRODUCTITEMID ? (
          <div className="mt-2 flex space-x-2 text-xs">
            <p>
              ID:{" "}
              <span className="bg-orange-400 px-4 py-1 rounded-full text-white">
                {selectedProduct.PRODUCTITEMID}
              </span>
            </p>
            <p>
              Product Name:{" "}
              <span className="bg-green-400 px-4 py-1 rounded-full text-white">
                {selectedProduct.PRODUCTNAME}
              </span>
            </p>
          </div>
        ) : (
          <p>No product selected</p>
        )}
      </div>
      <Separator className="mt-4" />

      <div className="mt-2">
        <label htmlFor="section">Choose a section:</label>

        <select name="section" id="section" onChange={handleSectionChange}>
          {sectionData &&
            sectionData.map((section) => (
              <option value={section.ID} key={section.ID}>
                {section.DESCRIPTION}
              </option>
            ))}
        </select>
      </div>

      <div className="table-container mt-2">
        <table className="min-w-full table-fixed-header text-[12px]">
          <thead>
            <tr>
              <th className="px-4 py-1 border border-gray-300 w-[100px]">
                CODE
              </th>
              <th className="px-4 py-1 border border-gray-300">MATERIAL</th>
              <th className="px-4 py-1 border border-gray-300 w-[100px]">
                QTY
              </th>
              <th className="px-4 py-1 border border-gray-300 w-[100px]">
                UNIT
              </th>
              <th className="px-4 py-1 border border-gray-300 w-[200px]">
                LOT NO.
              </th>
              <th className="px-4 py-1 border border-gray-300 w-[150px]">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody className="bg-white text-[10px]">
            {dailyConsumption.length === 0 ? (
              <tr>
                <td className="px-4 py-1 border border-gray-300 font-bold text-center">
                  <p className="bg-gray-700 inline-block text-white px-2 rounded-full cursor-pointer">
                    ...
                  </p>
                </td>
                <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
                <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
                <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
                <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
                <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
              </tr>
            ) : (
              dailyConsumption?.map((daily, index) => (
                <tr
                  key={`${index}`}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    index % 2 !== 0 ? "bg-gray-100" : ""
                  }`}
                >
                  <td className="px-4 py-1 border border-gray-300">
                    {daily.CODE}
                  </td>
                  <td className="px-4 py-1 border border-gray-300">
                    {daily.NAMEENG}
                  </td>
                  <td className="px-4 py-1 border border-gray-300">
                    <input
                      type="number"
                      min={0}
                      value={daily.QTY || 0}
                      className="w-full text-m font-bold p-2 rounded focus:outline-none bg-transparent"
                      onChange={(e) => {
                        const newQty =
                          e.target.value === ""
                            ? 0
                            : parseFloat(e.target.value);
                        dispatch(
                          updateDialyConsumptionItemQty({
                            currentSection: daily.SECTIONID,
                            items: { itemId: daily.ID, value: newQty },
                          })
                        );
                      }}
                    />
                  </td>
                  <td className="px-4 py-1 border border-gray-300">
                    {daily.UNITDESCRIPTION}
                  </td>
                  <td className="px-4 py-1 border border-gray-300"></td>
                  <td className="px-4 py-1 border border-gray-300">
                    <CircleX
                      className="cursor-pointer m-auto"
                      height={20}
                      width={20}
                      color="#fb8500"
                      onClick={() => {
                        dispatch(
                          removeItemSection({
                            currentSection,
                            selectedId: item.ID,
                          })
                        );
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default DailyConsumptionEntry;
