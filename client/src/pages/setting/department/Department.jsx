import { CirclePlus } from "lucide-react";

import React, { useState } from "react";

import AddEditDept from "./AddEditDept";

// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getDepartmentData,
  getDepartmentId,
  insertDepartmentData,
  updateDepartmentData,
} from "@/query/settingsRequest";
import { useDispatch } from "react-redux";
import { addData } from "@/redux/itemSlice";

function Department() {
  const [modalState, setModalState] = useState({
    isVisible: false,
    isEditMode: false,
  });

  const fnClose = () => {
    setModalState({ isVisible: false });
  };

  const {
    isPending: isDepartmentPending,
    error: departmentError,
    data: departmentData,
    refetch: refetchDepartmentData,
  } = useQuery({
    queryKey: ["department"],
    queryFn: getDepartmentData,
  });

  // insert department data
  const mutationInsertDepartmentData = useMutation({
    mutationFn: insertDepartmentData,
    onSuccess: () => {
      refetchDepartmentData();
    },
  });

  // update department data
  const mutationUpdateDepartmentData = useMutation({
    mutationFn: updateDepartmentData,
    onSuccess: () => {
      refetchDepartmentData();
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
        <AddEditDept
          modalState={modalState}
          fnClose={fnClose}
          fnDPInsert={
            modalState.isEditMode
              ? mutationUpdateDepartmentData.mutate
              : mutationInsertDepartmentData.mutate
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
            {departmentData &&
              departmentData.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-100 cursor-pointer ${
                    index % 2 !== 0 ? "bg-gray-50" : ""
                  }`}
                  onDoubleClick={async () => {
                    const [first] = await getDepartmentId(item.ID);
                    dispatch(addData(first));
                    handleOpenModal(true, true);
                  }}
                >
                  <td className="px-4 py-2 border border-gray-300 text-left">
                    {item.CODE}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-left">
                    {item.DESCRIPTION}
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

export default Department;
