import React, { useEffect, useState } from "react";

// item add edit form component
import ItemAddEditForm from "./ItemAddEditForm";

// shadcn component
import { Button } from "@/components/ui/button";

// icon
import { PlusCircle } from "lucide-react";

// fetching item data api request
import {
  getItemCategoryData,
  getItemClassData,
  getItemData,
  getItemUnitData,
  insertItemData,
} from "@/query/itemRequest";

// tanstack data query component
import { useMutation, useQuery } from "@tanstack/react-query";

// redux action
import { useDispatch, useSelector } from "react-redux";
import { getFirmCustomer, getFirmSupplier } from "@/query/firmRequest";
import { addItemAction, resetAllArray } from "@/redux/itemSlice";

//==================================================================

function Item() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [seletedItemData, setSelectedItemData] = useState(null);

  console.log(seletedItemData);

  //======================== QUERY AREA DATA =======================
  // fetching items data
  const {
    isLoading: isItemLoading,
    isPending: isItemPending,
    error: itemError,
    data: itemData,
    refetch: refetchItem,
  } = useQuery({
    queryKey: ["items"],
    queryFn: getItemData,
  });

  // item table properties
  const properties = [
    "CODE",
    "NAMEENG",
    "NAMEJP",
    "NOTE",
    "POPRICE",
    "UPDATED",
  ];

  //===================== ITEM DATA & TABLE PROPERTIES ==================

  //Query for item class
  const {
    isPending: isItemClassDataPending,
    error: itemClassError,
    data: itemClassData,
    refetch: refetchItemClass,
  } = useQuery({
    queryKey: ["itemclass"],
    queryFn: getItemClassData,
    staleTime: Infinity,
  });

  // Query for item category
  const {
    isPending: isItemCategoryPending,
    error: itemCategoryError,
    data: itemCategoryData,
    refetch: refetchItemCategory,
  } = useQuery({
    queryKey: ["itemcategory"],
    queryFn: getItemCategoryData,
    staleTime: Infinity,
  });

  // Query for customer data
  const {
    isPending: isCustomerDataPending,
    error: customerDataError,
    data: customerData,
    refetch: refetchCustomerData,
  } = useQuery({
    queryKey: ["customer"],
    queryFn: getFirmCustomer,
    staleTime: Infinity,
  });

  // Query for supplier data
  const {
    isPending: isSupplierDataPending,
    error: supplierDataError,
    data: supplierData,
    refetch: refetchSupplierData,
  } = useQuery({
    queryKey: ["supplier"],
    queryFn: getFirmSupplier,
    staleTime: Infinity,
  });

  // ========================== END QUERY DATA AREA =========================

  const dispatch = useDispatch();

  const { itemClass, itemUnit, itemCategory, itemVariation } = useSelector(
    (state) => state.itemData
  );

  const handleFormModal = () => {
    dispatch(addItemAction(itemClassData, "itemClass"));
    dispatch(addItemAction(itemCategoryData, "itemCategory"));
    dispatch(addItemAction(customerData, "defaultCustomer"));
    dispatch(addItemAction(supplierData, "defaultSupplier"));

    setIsFormModalOpen((prev) => !prev);
  };

  const handleCloseFormModal = () => {
    //dispatch(resetAllArray());
    setIsFormModalOpen((prev) => !prev);
  };

  // insert customer data
  const mutationInsertData = useMutation({
    mutationFn: insertItemData,
    onSuccess: () => {
      refetchItem();
    },
  });

  return (
    <div>
      <div className="mb-6">
        {/* button crud operation here */}
        <div>
          {/* Add/Edit form here */}
          {isFormModalOpen && (
            <ItemAddEditForm
              fmMode={isFormModalOpen}
              fnClose={handleCloseFormModal}
              mutate={mutationInsertData.mutate}
            />
          )}
        </div>
        <div className="flex gap-2">
          <div>
            <Button
              className="flex gap-2 bg-green-500 hover:bg-green-400 px-8"
              onClick={handleFormModal}
            >
              <PlusCircle />
              Add
            </Button>
          </div>
        </div>
      </div>
      {/* TABLE ITEM AREA */}
      <div>
        {isItemLoading ? (
          <p>loading...</p>
        ) : (
          <div className=" border border-gray-300 overflow-x-auto max-h-[640px]">
            <table className="table-auto">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-300 text-black text-xs">
                  {properties.map((property) => (
                    <th
                      key={property}
                      className={`px-4 py-2 w-80 ${
                        property === "CODE" ? `w-60` : ``
                      }`}
                    >
                      {property}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {itemData.map((item, index) => (
                  <tr
                    key={item.ID}
                    onClick={() => {
                      setSelectedItemData(item);
                    }}
                  >
                    {properties.map((property) => (
                      <td className="p-4 cursor-pointer" key={property}>
                        {item[property]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* END TABLE ITEM AREA */}
    </div>
  );
}

export default Item;
