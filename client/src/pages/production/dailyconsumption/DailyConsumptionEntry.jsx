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
import { loadDailyConsumptionData } from "@/redux/standardConsumptionSlice";

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
    </div>
  );
}
export default DailyConsumptionEntry;
