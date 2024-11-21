import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Separator } from "@/components/ui/separator";

// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getProductSection,
  getProductStandardConsumptionDetail,
} from "@/query/productionRequest";

function DailyConsumptionEntry() {
  const selectedProduct = useSelector((state) => state.scData.selectedProduct);

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
    data: consumptionDetailData,
    isLoading: isConsumptionLoading,
    refetch: refetchConsumptionDetail,
  } = useQuery({
    queryKey: ["standardConsumptionDetail", selectedSection],
    queryFn: () =>
      getProductStandardConsumptionDetail({
        productItemId: selectedProduct.PRODUCTITEMID,
        sectionId: selectedSection?.sectionId,
      }),
    enabled: false, // Disabled by default
  });

  console.log(consumptionDetailData);

  const handleSectionChange = async (e) => {
    const selectedSectionId = Number(e.target.value);

    // Update selected section state
    const section = {
      productItemId: selectedProduct.PRODUCTITEMID,
      sectionId: selectedSectionId,
    };
    setSelectedSection(section);

    // Trigger the query manually
    await refetchConsumptionDetail();
  };

  console.log(sectionData);
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
        <label for="section">Choose a section:</label>

        <select name="section" id="section" onChange={handleSectionChange}>
          {sectionData &&
            sectionData.map((section) => (
              <option value={section.ID} key={section.ID}>
                {section.DESCRIPTION}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
export default DailyConsumptionEntry;
