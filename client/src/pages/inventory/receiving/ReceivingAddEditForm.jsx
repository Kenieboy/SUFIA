import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useForm } from "react-hook-form";

import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";
import { getFirmSupplier } from "@/query/firmRequest";
import { ArrowDownToLine } from "lucide-react";
import ReceivingItemList from "./ReceivingItemList";

//redux

import { useDispatch, useSelector } from "react-redux";
import { resetPurchaseDetailData } from "@/redux/purchaseDDSlice";

function ReceivingAddEditForm({ isVisible, fnClose }) {
  const [date, setDate] = useState();
  const [itemListModalState, setItemListModalState] = useState(false);
  // form state
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      SUPPLIERID: "",
      DATEDELIVERED: "",
    },
  });

  const onSubmit = (data) => {
    console.log("submit", data);
    fnClose({ isVisible: false });
  };

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

  const purchaseDeliveryDetail = useSelector(
    (state) => state.pddData.purchaseDeliveryDetail
  );

  const dispatch = useDispatch();

  return (
    <>
      {itemListModalState && (
        <ReceivingItemList
          modalState={itemListModalState}
          fnRIClose={setItemListModalState}
        />
      )}
      <Dialog open={isVisible}>
        <DialogContent className="max-w-[1300px] h-[90%]">
          <div className="relative">
            <div>
              <h1 className="text-xl font-bold">
                Receiving {purchaseDeliveryDetail.length}
              </h1>
            </div>

            <div>
              {/* form area */}
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
                <Input
                  id="RECEIVINGNO"
                  placeholder="Receiving No."
                  className="w-[350px]"
                  {...register("RECEIVINGNO", {
                    required: true,
                    maxLength: 200,
                  })}
                />
                <div className="mt-2">
                  <Select
                    onValueChange={(newValue) => {
                      const { ID: supplierId } = supplierData.find(
                        (su) => su.NAME === newValue
                      );
                      setValue("SUPPLIERID", supplierId);
                    }}
                  >
                    <SelectTrigger className="max-w-[350px]">
                      <SelectValue placeholder="Select Supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem> */}
                      {supplierData?.map((supplier) => (
                        <SelectItem value={supplier.NAME} key={supplier.ID}>
                          {supplier.NAME}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, "yyyy-MM-dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          setDate(selectedDate);
                          setValue("DATEDELIVERED", selectedDate);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="mt-2 max-w-[600px]">
                  <Textarea
                    id="NOTE"
                    placeholder="Type your note here."
                    {...register("NOTE", { maxLength: 200 })}
                  />
                </div>

                <Separator className="mt-2" />

                <div className="mt-2">
                  <Table className="text-xs">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Unit</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* <TableRow>
                      <TableCell className="font-medium">INV001</TableCell>
                      <TableCell>Paid</TableCell>
                      <TableCell>Credit Card</TableCell>
                      <TableCell className="text-right">$250.00</TableCell>
                    </TableRow> */}
                      {purchaseDeliveryDetail.map((pdd, index) => (
                        <TableRow key={`${pdd.ITEMID}-${index}`}>
                          <TableCell>{pdd.ITEMCODE}</TableCell>
                          <TableCell>{pdd.NAMEENG}</TableCell>
                          <TableCell className="text-right">
                            {pdd.QTY}
                          </TableCell>
                          <TableCell className="text-right">
                            {pdd.CODE}
                          </TableCell>
                          <TableCell className="text-right">
                            {pdd.PRICE}
                          </TableCell>
                          <TableCell className="text-right">
                            Php {pdd.AMOUNT}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div>
                    <Button
                      type="button"
                      className="text-[10px] bg-gray-400 hover:bg-gray-300"
                      onClick={() => {
                        setItemListModalState(true);
                      }}
                    >
                      ...item
                      <ArrowDownToLine className="w-[15px]" />
                    </Button>
                  </div>
                </div>

                <div className="absolute bottom-0 right-2 flex gap-2">
                  <Button type="submit">Save</Button>
                  <Button
                    className="bg-red-500 hover:bg-red-400"
                    type="button"
                    onClick={() => {
                      fnClose({ isVisible: false });
                      dispatch(resetPurchaseDetailData());
                    }}
                  >
                    Close
                  </Button>
                </div>
              </form>
              {/* form area end */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ReceivingAddEditForm;
