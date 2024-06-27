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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReceivingAddEditForm from "./ReceivingAddEditForm";
import { Plus } from "lucide-react";

// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getPurchaseDeliveryData,
  getPurchaseDeliveryDetailData,
  insertPurchaseDeliveryData,
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

  const dispatch = useDispatch();

  return (
    <div>
      <div className="mt-6">
        {modalState.isVisible && (
          <ReceivingAddEditForm
            modalState={modalState}
            isVisible={modalState.isVisible}
            fnClose={setModalState}
            fnPDInsert={mutationInsertPurchaseDeliveryData.mutate}
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

        <div className="mt-6 relative overflow-hidden">
          <div className="w-full text-xs">
            <div className="sticky top-0 bg-white z-10">
              <Table className="w-full text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">PurchaseNo.</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>DateDelivered</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Grand Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <div className="overflow-auto max-h-[500px]">
              <Table className="w-full text-xs">
                <TableBody>
                  {purchaseDeliveryData &&
                    purchaseDeliveryData.map((pd, index) => (
                      <TableRow
                        key={index}
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
                          setModalState({ isVisible: true, isEditMode: true });
                        }}
                        className="cursor-pointer"
                      >
                        <TableCell>{pd.PURCHASEDELIVERYNO}</TableCell>
                        <TableCell>{pd.NAME}</TableCell>
                        <TableCell>
                          {format(pd.DATEDELIVERED, "yyyy-MM-dd")}
                        </TableCell>
                        <TableCell>{pd.NOTE}</TableCell>
                        <TableCell>{pd.TOTALAMOUNT}</TableCell>
                        <TableCell>{pd.GRANDTOTALAMOUNT}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Receiving;
