import {
  clearSelectedProduct,
  setSelectedProductSections,
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

  // insert section data
  const mutationInsertSectionData = useMutation({
    mutationFn: insertProductSection,
    onSuccess: () => {
      refetchSectionData();
      reset();
      handleFrmSectionModal();
    },
    onError: (error) => {
      alert(error.message); // Alert the error message correctly
    },
  });

  const onSubmitSection = (data) => {
    console.log("Submitting Data:", data);
    mutationInsertSectionData.mutate(data); // Trigger the mutation
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

  useEffect(() => {
    if (sectionData) {
      // Transform the sectionData into the desired format
      const transformedSections = sectionData.map((section) => ({
        id: section.ID, // Use the ID field from the data
        description: section.DESCRIPTION, // Use the DESCRIPTION field
        items: [], // Initialize items as an empty array
      }));

      // Dispatch the action with the transformed section data
      dispatch(setSelectedProductSections(transformedSections));
    }
  }, [sectionData, dispatch]);

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
          {sectionData?.length > 0 ? (
            <>
              <TabsList>
                {sectionData.map((sec) => (
                  <TabsTrigger
                    key={sec.ID}
                    value={sec.DESCRIPTION}
                    className="text-xs"
                    onClick={() => {
                      console.log(sec.ID);
                    }}
                  >
                    {sec.DESCRIPTION}
                  </TabsTrigger>
                ))}
                <div
                  className="px-4 cursor-pointer underline"
                  onClick={handleFrmSectionModal}
                >
                  <span className="">Add New Section</span>
                </div>
              </TabsList>
              {sectionData.map((sec) => (
                <TabsContent key={sec.ID} value={sec.DESCRIPTION}>
                  <h2>{sec.DESCRIPTION}</h2>
                  {/* Additional content specific to each section can go here */}
                </TabsContent>
              ))}
            </>
          ) : (
            <TabsList>
              <div
                className="px-4 cursor-pointer underline"
                onClick={handleFrmSectionModal}
              >
                <span className="">Add New Section</span>
              </div>
            </TabsList>
          )}
        </Tabs>
      </div>

      {/* dialog section */}
      <div>
        <Dialog open={frmSection}>
          <DialogContent className="w-96 overflow-hidden">
            <DialogHeader>
              <DialogTitle>SECTION</DialogTitle>
              <Separator className="" />
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
              <form onSubmit={handleSubmit(onSubmitSection)}>
                <div className="text-xs flex flex-col gap-1">
                  <div className="flex flex-col gap-1">
                    <div>
                      <label htmlFor="CODE">Code:</label>
                    </div>
                    <input
                      id="CODE"
                      name="CODE"
                      type="text"
                      className="w-40 p-1 px-2 border border-gray-500 rounded-full uppercase"
                      {...register("CODE", {
                        onChange: handleUppercase,
                      })}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div>
                      <label htmlFor="DESCRIPTION">Discription:</label>
                    </div>
                    <input
                      id="DESCRIPTION"
                      name="DESCRIPTION"
                      type="text"
                      className="w-full p-1 px-2 border border-gray-500 rounded-full uppercase"
                      {...register("DESCRIPTION", {
                        required: true,
                        onChange: handleUppercase,
                      })}
                    />
                  </div>
                </div>

                <div className="text-xs mt-4">
                  <div className="flex gap-1">
                    <div>
                      <button
                        type="submit"
                        className=" border-2 border-green-500 text-green-500 px-4 py-1 rounded-full"
                      >
                        Save
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        className=" border-2 border-red-400 text-red-500 px-4 py-1 rounded-full"
                        onClick={handleFrmSectionModal}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </form>
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
