import { Button } from "@/components/ui/button";
import { CirclePlus, Plus } from "lucide-react";
import React, { useState } from "react";
import WithdrawalAddEditForm from "./WithdrawalAddEditForm";

// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getSingleWithdrawalData,
  getWithdrawalData,
  insertWithdrawalData,
  updateWithdrawalData,
} from "@/query/withdrawalRequest";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import {
  addPDDItemEditMode,
  addSingleWithdrawalData,
} from "@/redux/purchaseDDSlice";

function Withdrawal() {
  const [modalState, setModalState] = useState({
    isVisible: false,
    isEditMode: false,
  });

  const {
    isPending: isWithdrawalPending,
    error: withdrawalError,
    data: withdrawalData,
    refetch: refetchWithdrawalData,
  } = useQuery({
    queryKey: ["withdrawal"],
    queryFn: getWithdrawalData,
  });

  // insert withdrawal data
  const mutationInsertWithdrawalData = useMutation({
    mutationFn: insertWithdrawalData,
    onSuccess: () => {
      refetchWithdrawalData();
    },
  });

  // update withdrawal data
  const mutationUpdateWithdrawalData = useMutation({
    mutationFn: updateWithdrawalData,
    onSuccess: () => {
      refetchWithdrawalData();
    },
  });

  const handleModalStateAction = () => {
    setModalState((prev) => !prev);
  };

  const dispatch = useDispatch();

  return (
    <div>
      <div className="mt-6">
        {modalState.isVisible && (
          <WithdrawalAddEditForm
            modalState={modalState}
            fnClose={handleModalStateAction}
            fnWDInsert={
              modalState.isEditMode
                ? mutationUpdateWithdrawalData.mutate
                : mutationInsertWithdrawalData.mutate
            }
          />
        )}

        <div className="mb-4">
          <Button
            className="bg-green-500 hover:bg-green-400 flex gap-1 text-xs"
            type="button"
            onClick={() => {
              setModalState({ isVisible: true });
            }}
          >
            <CirclePlus />
            {/* <Plus /> */}
            New
          </Button>
        </div>

        <div className="table-container-withdrawal">
          <table className="min-w-full table-fixed-header text-[12px]">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300 w-[100px]">
                  REF NO.
                </th>
                <th className="px-4 py-2 border border-gray-300 w-[100px]">
                  DATA REQUEST
                </th>
                <th className="px-4 py-2 border border-gray-300 w-[100px]">
                  PRODCUT
                </th>
                <th className="px-4 py-2 border border-gray-300 w-[100px]">
                  NOTE
                </th>
                <th className="px-4 py-2 border border-gray-300 w-[100px]">
                  RECEIVED BY
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-[10px]">
              {withdrawalData &&
                withdrawalData.map((item, index) => (
                  <tr
                    onDoubleClick={async () => {
                      // const { DATEREQUEST, ...others } =
                      //   await getSingleWithdrawalData(item.ID);
                      // const convertedDate = format(DATEREQUEST, "yyyy-MM-d");
                      // // console.log({ ...others, DATEREQUEST: convertedDate });
                      // dispatch(
                      //   addSingleWithdrawalData({
                      //     ...others,
                      //     DATEREQUEST: convertedDate,
                      //   })
                      // );
                      // setModalState({ isVisible: true, isEditMode: true });

                      const { withdrawal, withdrawalDetail } =
                        await getSingleWithdrawalData(item.ID);

                      dispatch(addSingleWithdrawalData(withdrawal));
                      dispatch(addPDDItemEditMode(withdrawalDetail));

                      setModalState({ isVisible: true, isEditMode: true });
                    }}
                    key={index}
                    className={`hover:bg-gray-100 cursor-pointer ${
                      index % 2 !== 0 ? "bg-gray-50" : ""
                    }`}
                  >
                    <td className="px-4 py-2 border border-gray-300 font-bold">
                      {item.REFNO}
                    </td>

                    <td className="px-4 py-1 border border-gray-300 text-center">
                      {format(item.DATEREQUEST, "MM-dd-yyyy")}
                    </td>
                    <td className="px-4 py-1 border border-gray-300 ">
                      {item.PRODUCT}
                    </td>
                    <td className="px-4 py-1 border border-gray-300 ">
                      {item.NOTE}
                    </td>
                    <td className="px-4 py-1 border border-gray-300 ">
                      {item.RECEIVEDBY}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Withdrawal;
