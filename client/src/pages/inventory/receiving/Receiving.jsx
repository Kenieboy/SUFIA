import React, { useState } from "react";

// shadcn component
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ReceivingAddEditForm from "./ReceivingAddEditForm";
import { Plus } from "lucide-react";

// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getPurchaseDeliveryData,
  getPurchaseDeliveryDetailData,
  insertPurchaseDeliveryData,
  updatePurchaseDeliveryData,
} from "@/query/purchaseDeliveryRequest";

import { format } from "date-fns";

import { useDispatch, useSelector } from "react-redux";
import {
  addPDDItem,
  addPDDItemEditMode,
  addPurchaseDelivery,
} from "@/redux/purchaseDDSlice";
import { getPurchaseDeliveryDetail } from "@/query/itemRequest";

function Receiving() {
  const [modalState, setModalState] = useState({
    isVisible: false,
    isEditMode: false,
  });
  const [selectedItem, setSelectedItem] = useState(null);

  // Query for purchase delivery data
  const {
    isPending: isPurchaseDeliveryPending,
    error: purchaseDeliveryError,
    data: purchaseDeliveryData,
    refetch: refetchPurchaseDeliveryData,
  } = useQuery({
    queryKey: ["purchasedelivery"],
    queryFn: getPurchaseDeliveryData,
  });

  // insert purchasedelivery data
  const mutationInsertPurchaseDeliveryData = useMutation({
    mutationFn: insertPurchaseDeliveryData,
    onSuccess: () => {
      refetchPurchaseDeliveryData();
    },
  });

  // update purchasedelivery data
  const mutationUpdatePurchaseDeliveryData = useMutation({
    mutationFn: updatePurchaseDeliveryData,
    onSuccess: () => {
      refetchPurchaseDeliveryData();
    },
  });

  const dispatch = useDispatch();

  const formatNumberWithCommas = (number) => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div>
      <div className="mt-6">
        {modalState.isVisible && (
          <ReceivingAddEditForm
            modalState={modalState}
            isVisible={modalState.isVisible}
            fnClose={setModalState}
            fnPDInsert={
              modalState.isEditMode
                ? mutationUpdatePurchaseDeliveryData.mutate
                : mutationInsertPurchaseDeliveryData.mutate
            }
          />
        )}

        <div className="p-2">
          <Button
            className="bg-green-500 hover:bg-green-400 flex gap-1"
            type="button"
            onClick={() => {
              setModalState({ isVisible: true });
            }}
          >
            <Plus />
            New
          </Button>
        </div>

        <div className="table-container-receiving">
          <table className="min-w-full table-fixed-header text-[12px]">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300 w-[100px]">
                  PURCHASE NO.
                </th>
                <th className="px-4 py-2 border border-gray-300">SUPPLIER</th>
                <th className="px-4 py-2 border border-gray-300 w-[100px]">
                  DATE DELIVERED
                </th>
                <th className="px-4 py-2 border border-gray-300 w-[300px]">
                  NOTE
                </th>
                <th className="px-4 py-2 border border-gray-300 w-[100px]">
                  TOTAL
                </th>
                <th className="px-4 py-2 border border-gray-300 w-[150px]">
                  GRAND TOTAL
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-[10px]">
              {purchaseDeliveryData &&
                purchaseDeliveryData.map((pd, index) => (
                  <tr
                    onClick={async () => {
                      const { ID } = pd;
                      const formattedDate = format(
                        pd.DATEDELIVERED,
                        "yyyy-MM-dd"
                      );

                      const { purchaseDelivery, purchaseDeliveryDetail } =
                        await getPurchaseDeliveryDetailData(ID);

                      dispatch(
                        addPurchaseDelivery({
                          ...purchaseDelivery[0],
                          DATEDELIVERED: formattedDate,
                        })
                      );
                      dispatch(addPDDItemEditMode(purchaseDeliveryDetail));

                      setModalState({
                        isVisible: true,
                        isEditMode: true,
                      });
                    }}
                    key={index}
                    className={`hover:bg-gray-100 cursor-pointer ${
                      index % 2 !== 0 ? "bg-gray-50" : ""
                    }`}
                  >
                    <td className="px-4 py-2 border border-gray-300 text-center">
                      {pd.PURCHASEDELIVERYNO}
                    </td>
                    <td className="px-4 py-1 border border-gray-300 font-bold">
                      {pd.NAME}
                    </td>
                    <td className="px-4 py-1 border border-gray-300">
                      {format(pd.DATEDELIVERED, "MM-dd-yyyy")}
                    </td>
                    <td className="px-4 py-1 border border-gray-300 ">
                      {pd.NOTE}
                    </td>
                    <td className="px-4 py-1 border border-gray-300 ">
                      {pd.TOTALAMOUNT}
                    </td>
                    <td className="px-4 py-1 border border-gray-300 font-bold">
                      Php{" "}
                      {formatNumberWithCommas(parseFloat(pd.GRANDTOTALAMOUNT))}
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

export default Receiving;
