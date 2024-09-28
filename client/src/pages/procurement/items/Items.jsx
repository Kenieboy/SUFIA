import React, { useEffect, useState } from "react";

// item add edit form component
import ItemAddEditForm from "./ItemAddEditForm";

// shadcn component
import { Button } from "@/components/ui/button";

// icon
import { CirclePlus, PlusCircle } from "lucide-react";

// fetching item data api request
import {
  getItemCategoryData,
  getItemClassData,
  getItemData,
  getItemUnitData,
  insertItemData,
  updateItemData,
} from "@/query/itemRequest";

// tanstack data query component
import { useMutation, useQuery } from "@tanstack/react-query";

// redux action
import { useDispatch, useSelector } from "react-redux";
import { getFirmCustomer, getFirmSupplier } from "@/query/firmRequest";
import { addItemAction, fetchItemVariationById } from "@/redux/itemSlice";

import { FixedSizeList as List } from "react-window";

//==================================================================

function Item() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [action, setAction] = useState(false);

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
    setIsFormModalOpen((prev) => !prev);
    dispatch(addItemAction(itemClassData, "itemClass"));
    dispatch(addItemAction(itemCategoryData, "itemCategory"));
    dispatch(addItemAction(customerData, "defaultCustomer"));
    dispatch(addItemAction(supplierData, "defaultSupplier"));
  };

  const handleCloseFormModal = () => {
    //dispatch(resetAllArray());
    setIsFormModalOpen((prev) => !prev);
  };

  // insert item data
  const mutationInsertData = useMutation({
    mutationFn: insertItemData,
    onSuccess: () => {
      refetchItem();
    },
  });

  // edit item data
  const mutationUpdateData = useMutation({
    mutationFn: updateItemData,
    onSuccess: () => {
      refetchItem();
    },
  });

  const handleSetAction = () => {
    setAction((prev) => !prev);
  };

  const Row = ({ index, style, data }) => (
    <div
      style={style}
      className={`grid grid-flow-col auto-cols-max text-xs gap-2 cursor-pointer hover:bg-gray-100 ${
        index % 2 !== 0 ? "bg-gray-50" : ""
      }`}
      onClick={() => {
        dispatch(fetchItemVariationById(data[index].ID));
        handleSetAction();
        setSelectedItemData(data[index]);
        handleFormModal();
      }}
    >
      <div className="w-[50px] text-center">{data[index].ID}</div>
      <div className="w-[80px]">{data[index].CODE}</div>
      <div className="w-[650px]">{data[index].NAMEENG}</div>
      <div className="">{data[index].CATEGORY}</div>
    </div>
  );

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
              mutate={
                selectedItemData
                  ? mutationUpdateData.mutate
                  : mutationInsertData.mutate
              }
              {...(action && {
                selectedItem: selectedItemData,
                setAction: handleSetAction,
                setSelectedItem: setSelectedItemData,
              })}
              action={action}
            />
          )}
        </div>
        <div className="flex gap-2">
          <div>
            <button
              className="bg-green-500 hover:bg-green-400 flex gap-1 items-center text-xs px-4 py-1 text-white rounded-full"
              type="button"
              onClick={() => {
                handleFormModal();
                handleSetAction();
              }}
            >
              {/* <Plus /> */}
              <CirclePlus width={20} height={20} />
              New
            </button>
          </div>
        </div>
      </div>
      {/* TABLE ITEM AREA */}

      <div>
        <div className="grid grid-flow-col auto-cols-max text-xs gap-2 bg-gray-200 py-1 font-semibold -mt-4 w-[1380px]">
          <div className="w-[50px]">
            <p className="ml-2">ID</p>
          </div>
          <div className="w-[80px]">
            <p className="">CODE</p>
          </div>
          <div>
            <p className="">MATERIAL</p>
          </div>
          <div>
            <p className="ml-[580px]">CATEGORY</p>
          </div>
        </div>
        {itemData && (
          <List
            height={620}
            itemCount={itemData.length}
            itemSize={20}
            width={1380}
            itemData={itemData}
          >
            {Row}
          </List>
        )}
      </div>

      {/* <div>
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
                      dispatch(fetchItemVariationById(item.ID));
                      handleSetAction();
                      setSelectedItemData(item);
                      handleFormModal();
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
      </div> */}
      {/* END TABLE ITEM AREA */}
    </div>
  );
}

export default Item;
