import { CirclePlus } from "lucide-react";
import React, { useState } from "react";
import AddEditDept from "./AddEditDept";

function Department() {
  const [modalState, setModalState] = useState({
    isVisible: false,
    isEditMode: false,
  });

  const fnClose = () => {
    setModalState({ isVisible: false });
  };

  return (
    <div>
      {/* form area */}
      {modalState.isVisible && (
        <AddEditDept modalState={modalState.isVisible} fnClose={fnClose} />
      )}

      {/* form are end */}

      <div className="mt-2">
        <button
          className="bg-green-500 hover:bg-green-400 flex gap-1 items-center text-xs px-4 py-1 text-white rounded-full"
          type="button"
          onClick={() => {
            setModalState({ isVisible: true });
          }}
        >
          {/* <Plus /> */}
          <CirclePlus width={20} height={20} />
          New
        </button>
      </div>

      {/* table */}
      <div className="table-container-department mt-2">
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
            {/* {filteredData &&
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-100 cursor-pointer ${
                    index % 2 !== 0 ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    {format(new Date(item.DATEDELIVERED), "MM-dd-yyyy")}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 ">
                    {item.PURCHASEDELIVERYNO}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 text-center">
                    {item.ITEMCODE}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 font-bold">
                    {item.MATERIALNAME}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 text-center font-bold ">
                    <p> {formatNumberWithCommas(parseFloat(item.QTY))}</p>
                  </td>
                  <td className="px-4 py-1 border border-gray-300  text-center">
                    {item.UNIT}
                  </td>
                </tr>
              ))} */}
            <tr>
              <td className="px-4 py-2 border border-gray-300 text-center">
                FCPC
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                FIRST COMMERCIAL PRODUCTION DEPT.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* table end */}
    </div>
  );
}

export default Department;
