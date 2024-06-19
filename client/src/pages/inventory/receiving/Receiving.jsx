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

function Receiving() {
  const [modalState, setModalState] = useState({
    isVisible: false,
    isEditMode: false,
  });

  return (
    <div>
      <div className="mt-6">
        {modalState.isVisible && (
          <ReceivingAddEditForm
            isVisible={modalState.isVisible}
            fnClose={setModalState}
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
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Receiving;
