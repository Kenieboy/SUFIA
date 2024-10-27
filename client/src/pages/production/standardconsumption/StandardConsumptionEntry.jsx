import {
  clearSelectedProduct,
  setSelectedSection,
} from "@/redux/standardConsumptionSlice";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getProductSection,
  insertProductSection,
} from "@/query/productionRequest";
import { Plus } from "lucide-react";

function StandardConsumptionEntry() {
  const [modalState, setModalState] = useState({
    isVisible: false,
    isEditMode: false,
  });

  const [frmSection, setFrmSection] = useState(false);

  const selectedProduct = useSelector((state) => state.scData.selectedProduct);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { register, setValue, handleSubmit, reset } = useForm({});

  const handleUppercase = (event) => {
    const { name, value } = event.target;
    const uppercasedValue = value.toUpperCase();
    setValue(name, uppercasedValue, { shouldValidate: true });
  };
  const handleFrmSectionModal = () => {
    setFrmSection((prev) => !prev);
  };

  const {
    isPending: isSectionPending,
    error: SectionError,
    data: sectionData,
    refetch: refetchSectionData,
  } = useQuery({
    queryKey: ["productionsection"],
    queryFn: getProductSection,
  });

  const fileredSectionData = sectionData?.filter(
    (section) => section.DEPARTMENT === "PRODUCTION"
  );

  return (
    <div>
      <h1 className="text-xl font-bold">New Standard Consumption Product</h1>
      <div className="mt-6">
        <h2 className="text-xl">Selected Product:</h2>
        {selectedProduct.ID ? (
          <div className="mt-2 flex space-x-2 text-xs">
            <p>
              ID:{" "}
              <span className="bg-orange-400 px-4 py-1 rounded-full text-white">
                {selectedProduct.ID}
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

      {/* tab section area */}
      <div className="mt-4">
        <Tabs defaultValue="supplier" className="max-w-full">
          <TabsList>
            {selectedProduct.sections ? (
              <>
                {selectedProduct.sections.map((section) => (
                  <TabsTrigger
                    className="text-xs"
                    key={section.ID}
                    value={`${section.DESCRIPTION}`}
                  >
                    {section.DESCRIPTION}
                  </TabsTrigger>
                ))}
                <div
                  className="px-4 cursor-pointer underline"
                  onClick={handleFrmSectionModal}
                >
                  <span className="flex">
                    <Plus className="w-4 h-4" /> Add Section
                  </span>
                </div>
              </>
            ) : (
              <div
                className="px-4 cursor-pointer underline"
                onClick={handleFrmSectionModal}
              >
                <span className="flex">
                  <Plus className="w-4 h-4" /> Add Section
                </span>
              </div>
            )}
          </TabsList>
          {selectedProduct.sections.map((content) => (
            <TabsContent value={content.DESCRIPTION}>
              {content.DESCRIPTION}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* dialog section */}
      <div>
        <Dialog open={frmSection}>
          <DialogContent className="w-96 overflow-hidden">
            <DialogHeader>
              <DialogTitle className="font-normal flex  items-center justify-between">
                <span>Section for product:</span>

                <span className="bg-green-400 px-4 py-1 rounded-full text-white text-sm">
                  {selectedProduct.PRODUCTNAME}
                </span>
              </DialogTitle>

              <DialogDescription></DialogDescription>
            </DialogHeader>

            <div className="table-container-receiving">
              <table className="min-w-full table-fixed-header text-[12px]">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border border-gray-300 w-[80px]">
                      ID
                    </th>
                    <th className="px-4 py-2 border border-gray-300 w-[150px]">
                      CODE
                    </th>

                    <th className="px-4 py-2 border border-gray-300 w-[150px]">
                      DESCRIPTION
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white text-[10px]">
                  {fileredSectionData &&
                    fileredSectionData.map((pd, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-100 cursor-pointer ${
                          index % 2 !== 0 ? "bg-gray-50" : ""
                        }`}
                        onClick={() => {
                          console.log(
                            `Section selected:${pd.ID} ${pd.DESCRIPTION}`
                          );
                          dispatch(
                            setSelectedSection({
                              ID: pd.ID,
                              DESCRIPTION: pd.DESCRIPTION,
                              ITEMS: [],
                            })
                          );
                        }}
                      >
                        <td className="px-4 py-2 border border-gray-300 text-center">
                          {pd.ID}
                        </td>
                        <td className="px-4 py-1 border border-gray-300 font-bold">
                          {pd.CODE}
                        </td>

                        <td className="px-4 py-1 border border-gray-300 ">
                          {pd.DESCRIPTION}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div>
              {/* BUTTON */}
              <div className="text-xs flex gap-1 mt-6 font-semibold">
                <div>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded-full"
                    onClick={handleFrmSectionModal}
                  >
                    Close
                  </button>
                </div>
              </div>
              {/* BUTTON END */}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* action button  */}
      <div>
        {/* BUTTON */}
        <div className="text-xs flex gap-1 mt-6 font-semibold">
          <div>
            <button
              type="button"
              className="bg-green-500 hover:bg-green-400 text-white px-4 py-1 rounded-full"
            >
              Save
            </button>
          </div>
          <div>
            <button
              type="button"
              className="bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded-full"
              onClick={() => {
                dispatch(clearSelectedProduct());
                navigate("/production");
              }}
            >
              Close
            </button>
          </div>
        </div>
        {/* BUTTON END */}
      </div>
    </div>
  );
}

export default StandardConsumptionEntry;
