import React, { useState, useEffect } from "react";

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

import { useForm, Controller } from "react-hook-form";

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
import { ArrowDownToLine, X } from "lucide-react";
import ReceivingItemList from "./ReceivingItemList";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  removePurchaseDeliveryDetail,
  resetPurchaseDetailData,
  updatePDDItem,
  updatePDDItemvariationIdPrice,
} from "@/redux/purchaseDDSlice";
import { deletePurchaseDeliveryData } from "@/query/purchaseDeliveryRequest";

function ReceivingAddEditForm({ modalState, isVisible, fnClose, fnPDInsert }) {
  // const purchaseDeliveryDetail = useSelector(
  //   (state) => state.pddData.purchaseDeliveryDetail
  // );

  // const purchaseDelivery = useSelector(
  //   (state) => state.pddData.purchaseDelivery
  // );

  const { purchaseDeliveryDetail, purchaseDelivery } = useSelector(
    (state) => state.pddData
  );

  const [date, setDate] = useState(
    modalState.isEditMode ? purchaseDelivery[0].DATEDELIVERED : ""
  );
  const [itemListModalState, setItemListModalState] = useState(false);

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

  const dispatch = useDispatch();

  const handleInputChange = (e, itemId, field) => {
    const { value } = e.target;
    dispatch(updatePDDItem({ itemId, field, value: parseFloat(value) }));
  };

  // form state
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      SUPPLIERID: "",
      DATEDELIVERED: "",
      PURCHASEDELIVERYDETAIL: "",
    },
  });

  useEffect(() => {
    setValue(
      "PURCHASEDELIVERYDETAIL",
      purchaseDeliveryDetail.map(
        ({
          PURCHASEDELIVERYDETAILID,
          ITEMVARIATIONID,
          QTY,
          PRICE,
          AMOUNT,
        }) => ({
          PURCHASEDELIVERYDETAILID,
          ITEMVARIATIONID,
          QTY,
          PRICE,
          AMOUNT,
        })
      )
    );
  }, [purchaseDeliveryDetail, setValue]);

  const onSubmit = (data) => {
    if (purchaseDeliveryDetail.length === 0) {
      alert("Please provide item for receiving instance!");
      return;
    }

    fnPDInsert(data);
    dispatch(resetPurchaseDetailData());
    fnClose({ isVisible: false });
  };

  if (modalState.isEditMode) {
    setValue("DATEDELIVERED", purchaseDelivery[0].DATEDELIVERED);
    setValue("SUPPLIERID", purchaseDelivery[0].SUPPLIERID);
  }

  const initialItemDefaultSupplier =
    supplierData?.find((i) => i.ID === purchaseDelivery[0]?.SUPPLIERID)?.NAME ||
    "";

  const handleDelete = async (purchaseDeliveryDetailId) => {
    try {
      const message = await deletePurchaseDeliveryData(
        purchaseDeliveryDetailId
      );
      console.log("Deletion successful:", message);
    } catch (error) {
      console.error("Error deleting purchase delivery detail:", error);
    }
  };

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
                {purchaseDelivery.length === 0 ? (
                  ``
                ) : (
                  <Input
                    id="PURCHASEDELIVERYID"
                    type="hidden"
                    defaultValue={purchaseDelivery[0]?.PURCHASEDELIVERYID || ""}
                    {...register("PURCHASEDELIVERYID", { valueAsNumber: true })}
                  />
                )}

                <Input
                  id="PURCHASEDELIVERYNO"
                  placeholder="Receiving No."
                  defaultValue={
                    modalState.isEditMode
                      ? purchaseDelivery[0].PURCHASEDELIVERYNO
                      : ""
                  }
                  className="w-[350px]"
                  {...register("PURCHASEDELIVERYNO", {
                    required: true,
                    maxLength: 200,
                  })}
                />
                <div className="mt-2">
                  {supplierData && (
                    <Controller
                      id="DEFAULTSUPPLIER"
                      name="DEFAULTSUPPLIER"
                      control={control}
                      defaultValue={initialItemDefaultSupplier}
                      rules={{ required: "Supplier is required" }}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          onValueChange={(newValue) => {
                            onChange(newValue);
                            const supplierId = supplierData?.find(
                              (sup) => sup.NAME === newValue
                            );

                            setValue("SUPPLIERID", supplierId.ID);
                          }}
                          value={value}
                        >
                          <SelectTrigger className="max-w-[350px]">
                            <SelectValue placeholder="Select Supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            {supplierData &&
                              supplierData.map((defSupplier) => (
                                <SelectItem
                                  key={defSupplier.ID}
                                  value={defSupplier.NAME}
                                >
                                  {defSupplier.NAME}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
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

                          setValue(
                            "DATEDELIVERED",
                            format(selectedDate, "yyyy-MM-dd")
                          );
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="mt-2 max-w-[600px]">
                  <Textarea
                    defaultValue={
                      modalState.isEditMode ? purchaseDelivery[0].NOTE : ""
                    }
                    name="NOTE"
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
                        <TableHead className="text-right">Action</TableHead>
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
                        <TableRow key={pdd.PURCHASEDELIVERYDETAILID}>
                          <TableCell>{pdd.ITEMCODE}</TableCell>
                          <TableCell>{pdd.NAMEENG}</TableCell>
                          <TableCell className="flex justify-end">
                            <Input
                              name="ITEMVARIATIONID"
                              type="number"
                              id={`ITEMVARIATIONID-${index}`}
                              value={pdd.ITEMVARIATIONID}
                              className="w-[100px]"
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  pdd.ITEMID,
                                  "ITEMVARIATIONID"
                                )
                              }
                            />
                            <Input
                              name="QTY"
                              type="number"
                              id={`QTY-${index}`}
                              value={pdd.QTY || 0}
                              onChange={(e) => {
                                const value =
                                  e.target.value === "" ? 0 : e.target.value;
                                handleInputChange(
                                  { target: { value } },
                                  pdd.ITEMID,
                                  "QTY"
                                );
                              }}
                              onBlur={(e) => {
                                if (e.target.value === "") {
                                  handleInputChange(
                                    { target: { value: 0 } },
                                    pdd.ITEMID,
                                    "QTY"
                                  );
                                }
                              }}
                              className="w-[100px]"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            {pdd.CODE}
                            <Select
                              defaultValue={pdd.CODE}
                              onValueChange={(value) => {
                                const itemId = pdd.ITEMID;
                                const { ID, COST, ITEMUNITDESCRIPTION } =
                                  pdd.itemVariations.find(
                                    (iu) => iu.ITEMUNITDESCRIPTION === value
                                  );

                                dispatch(
                                  updatePDDItemvariationIdPrice({
                                    itemId,
                                    ID,
                                    COST,
                                    ITEMUNITDESCRIPTION,
                                  })
                                );
                              }}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {pdd.itemVariations.map((iu) => (
                                  <SelectItem
                                    value={`${iu.ITEMUNITDESCRIPTION}`}
                                    key={iu.ID}
                                  >
                                    {`${iu.ITEMUNITDESCRIPTION}, ${iu.COST}, ${iu.ID}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="flex justify-end">
                            <Input
                              name="PRICE"
                              type="number"
                              id={`PRICE-${index}`}
                              value={pdd.PRICE || 0}
                              onChange={(e) => {
                                const value =
                                  e.target.value === "" ? 0 : e.target.value;
                                handleInputChange(
                                  { target: { value } },
                                  pdd.ITEMID,
                                  "PRICE"
                                );
                              }}
                              onBlur={(e) => {
                                if (e.target.value === "") {
                                  handleInputChange(
                                    { target: { value: 0 } },
                                    pdd.ITEMID,
                                    "PRICE"
                                  );
                                }
                              }}
                              className="w-[150px]"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            Php {pdd.AMOUNT}
                          </TableCell>
                          <TableCell className="flex items-center justify-center">
                            <X
                              className="cursor-pointer"
                              onClick={async () => {
                                if (
                                  modalState.isEditMode &&
                                  pdd.PURCHASEDELIVERYDETAILID > 0
                                ) {
                                  handleDelete(pdd.PURCHASEDELIVERYDETAILID);
                                }
                                dispatch(
                                  removePurchaseDeliveryDetail(
                                    pdd.PURCHASEDELIVERYDETAILID
                                  )
                                );
                              }}
                            />
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
