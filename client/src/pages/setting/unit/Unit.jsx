import { CirclePlus } from "lucide-react";

import React, { useState } from "react";

// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";

import { useDispatch } from "react-redux";
import { addData } from "@/redux/itemSlice";
import {
  getItemUnitData,
  getItemUnitId,
  insertItemUnitData,
  updateItemUnitData,
} from "@/query/settingsRequest";
import AddEditUnit from "./AddEditUnit";

function Unit() {
  const [modalState, setModalState] = useState({
    isVisible: false,
    isEditMode: false,
  });

  const fnClose = () => {
    setModalState({ isVisible: false });
  };

  const {
    isPending: isItemUnitPending,
    error: itemUnitError,
    data: itemUnitData,
    refetch: refetchItemUnitData,
  } = useQuery({
    queryKey: ["itemunit"],
    queryFn: getItemUnitData,
  });

  // insert item unit data
  const mutationInsertItemUnitData = useMutation({
    mutationFn: insertItemUnitData,
    onSuccess: () => {
      refetchItemUnitData();
    },
  });

  // update item unit data
  const mutationUpdateItemUnitData = useMutation({
    mutationFn: updateItemUnitData,
    onSuccess: () => {
      refetchItemUnitData();
    },
  });

  const handleOpenModal = (visible, edit) => {
    setModalState((prevState) => ({
      ...prevState,
      isVisible: visible,
      isEditMode: edit,
    }));
  };

  const dispatch = useDispatch();

  return (
    <div>
      {/* form area */}
      {modalState.isVisible && (
        <AddEditUnit
          modalState={modalState}
          fnClose={fnClose}
          fnIUInsert={
            modalState.isEditMode
              ? mutationUpdateItemUnitData.mutate
              : mutationInsertItemUnitData.mutate
          }
        />
      )}
      {/* form are end */}

      <div className="mt-2">
        <button
          className="bg-green-500 hover:bg-green-400 flex gap-1 items-center text-xs px-4 py-1 text-white rounded-full"
          type="button"
          onClick={() => {
            handleOpenModal(true, false);
          }}
        >
          {/* <Plus /> */}
          <CirclePlus width={20} height={20} />
          New
        </button>
      </div>

      {/* table  'TABLE COMPONENT'*/}
      <div className="table-container-department mt-2 w-1/3">
        <table className="min-w-full table-fixed-header text-[12px]">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300 w-[100px]">
                CODE
              </th>
              <th className="px-4 py-2 border border-gray-300 w-[50px]">
                DEPARTMENT
              </th>
            </tr>
          </thead>
          <tbody className="bg-white text-[10px]">
            {itemUnitData &&
              itemUnitData.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-100 cursor-pointer ${
                    index % 2 !== 0 ? "bg-gray-50" : ""
                  }`}
                  onDoubleClick={async () => {
                    const [first] = await getItemUnitId(item.ID);
                    dispatch(addData(first));
                    handleOpenModal(true, true);
                  }}
                >
                  <td className="px-4 py-2 border border-gray-300 text-left">
                    {item.CODE}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-left">
                    {item.DESCRIPTIONEN}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* table end */}
    </div>
  );
}

export default Unit;
