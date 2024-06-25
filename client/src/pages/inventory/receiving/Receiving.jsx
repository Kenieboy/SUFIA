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
  insertPurchaseDeliveryData,
} from "@/query/purchaseDeliveryRequest";

function Receiving() {
  const [modalState, setModalState] = useState({
    isVisible: false,
    isEditMode: false,
  });

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

  return (
    <div>
      <div className="mt-6">
        {modalState.isVisible && (
          <ReceivingAddEditForm
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

        <div className="mt-6">
          <Table className="w-full text-xs">
            <TableCaption>A list of your recent invoices.</TableCaption>
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
            <TableBody>
              {purchaseDeliveryData &&
                purchaseDeliveryData.map((pd, index) => (
                  <TableRow key={index}>
                    <TableCell>{pd.PURCHASEDELIVERYNO}</TableCell>
                    <TableCell>{pd.NAME}</TableCell>
                    <TableCell>{pd.DATEDELIVERED}</TableCell>
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
  );
}

export default Receiving;
