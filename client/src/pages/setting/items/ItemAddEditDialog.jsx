import React, { useState } from "react";

//shadcn component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// react hook form component
import { useForm, Controller } from "react-hook-form";

// icons
import { PlusCircleIcon } from "lucide-react";

// Item Variation Form
import ItemVariationForm from "./ItemVariationForm";

const countries = [
  { label: "Philippines", value: "PH" },
  { label: "Japan", value: "JP" },
];

// redux kbmemTable
import { useDispatch, useSelector } from "react-redux";

// redux item variation actions
import {
  removeSelectedVariations,
  resetItemVariations,
  toggleItemVariationSelection,
} from "@/redux/itemSlice";

// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";
import { getItemCategoryData, getItemClassData } from "@/query/itemRequest";
import { getFirmCustomer, getFirmSupplier } from "@/query/firmRequest";

function ItemAddEditDialog({
  mode = false,
  onClose,
  mutate,
  action,
  selectedItem = null,
}) {
  const [isOpen, setIsOpen] = useState(mode);
  const [isItemVariationFormOpen, setIsItemVariationFormOpen] = useState(false);

  // fetching item class & category data

  //Query for item class
  const {
    isPending: isItemClassDataPending,
    error: itemClassError,
    data: itemClassData,
    refetch: refetchItemClass,
  } = useQuery({
    queryKey: ["itemclass"],
    queryFn: getItemClassData,
    staleTime: Infinity,
  });

  // Query for item category
  const {
    isPending: isItemCategoryPending,
    error: itemCategoryError,
    data: itemCategoryData,
    refetch: refetchItemCategory,
  } = useQuery({
    queryKey: ["itemcategory"],
    queryFn: getItemCategoryData,
    staleTime: Infinity,
  });

  // Query for customer data
  const {
    isPending: isCustomerDataPending,
    error: customerDataError,
    data: customerData,
    refetch: refetchCustomerData,
  } = useQuery({
    queryKey: ["customer"],
    queryFn: getFirmCustomer,
    staleTime: Infinity,
  });

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

  // item state
  const item = useSelector((state) => state.item);

  // filter for selected variation
  const isSelectedValueLength = item?.itemVariation.filter(
    (item) => item.isSelected
  );
  // check if edit mode
  const isEditMode = isSelectedValueLength.length > 0;

  // form state
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  // redux dispatch
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    // mutate(data);
    // onClose();

    console.log(data);
  };

  const handleVariationForm = () => {
    setIsItemVariationFormOpen((prev) => !prev);
  };

  const hanldeClick = ({ UNITID, ...others }) => {
    dispatch(toggleItemVariationSelection(UNITID));
  };

  return (
    <>
      {isItemVariationFormOpen && (
        <ItemVariationForm
          selectedItem={isEditMode ? isSelectedValueLength[0] : undefined}
          mode={isItemVariationFormOpen}
          fnClose={handleVariationForm}
          action={isEditMode ? "edit" : undefined}
        />
      )}
      <Dialog open={isOpen}>
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {action === "edit" ? (
                <div className="flex px-2 items-center justify-between">
                  <p>Edit Item</p>
                  <p className="text-[10px] cursor-pointer bg-green-500 px-2 py-1 rounded-full text-white">
                    {selectedItem?.CODE || ""}
                  </p>
                </div>
              ) : (
                `New Item`
              )}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="relative">
            <div className="px-2 mt-6">
              <div>
                <div className="flex flex-col gap-2">
                  <Input
                    id="NAMEENG"
                    placeholder="Name English"
                    defaultValue={selectedItem?.NAMEENG || ""}
                    aria-invalid={errors.NAMEENG ? "true" : "false"}
                    {...register("NAMEENG", { required: true, maxLength: 200 })}
                  />
                  <Input
                    id="NAMEJP"
                    placeholder="Name Japanese"
                    defaultValue={selectedItem?.NAMEJP || ""}
                    aria-invalid={errors.NAMEJP ? "true" : "false"}
                    {...register("NAMEJP", { required: true, maxLength: 200 })}
                  />
                </div>

                <div className="mt-2 flex gap-2">
                  <div>
                    <Controller
                      id="ITEMCLASS"
                      name="ITEMCLASS"
                      control={control}
                      defaultValue={selectedItem?.ITEMCLASS || ""}
                      rules={{ required: "Class is required" }}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          onValueChange={(newValue) => {
                            onChange(newValue);
                          }}
                          value={value}
                        >
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                          <SelectContent>
                            {itemClassData?.map(
                              (iclass, index) =>
                                iclass.DESCRIPTION && (
                                  <SelectItem
                                    key={`class_${index}`}
                                    value={iclass.DESCRIPTION}
                                  >
                                    {iclass.DESCRIPTION}
                                  </SelectItem>
                                )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      id="ITEMCATEGORY"
                      name="ITEMCATEGORY"
                      control={control}
                      defaultValue={selectedItem?.ITEMCATEGORY || ""}
                      rules={{ required: "Category is required" }}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          onValueChange={(newValue) => {
                            onChange(newValue);
                          }}
                          value={value}
                        >
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {itemCategoryData?.map(
                              (icategory, index) =>
                                icategory.DESCRIPTION && (
                                  <SelectItem
                                    key={`category_${index}`}
                                    value={icategory.DESCRIPTION}
                                  >
                                    {icategory.DESCRIPTION}
                                  </SelectItem>
                                )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-2 ">
                  {/* =================== BUTTON AREA ===================== */}
                  <Button
                    onClick={handleVariationForm}
                    className=" text-xs flex gap-2 bg-green-500 hover:bg-green-400"
                  >
                    <PlusCircleIcon />
                    Add
                  </Button>
                  <Button
                    disabled={isSelectedValueLength.length <= 0}
                    className="text-xs"
                    onClick={handleVariationForm}
                  >
                    Edit
                  </Button>
                  <Button
                    disabled={isSelectedValueLength.length <= 0}
                    className="bg-red-500 hover:bg-red-400 text-xs"
                    onClick={() => {
                      dispatch(removeSelectedVariations());
                    }}
                  >
                    Delete
                  </Button>
                </div>

                {/* Item Variation Table */}
                <Table className="text-[11px]">
                  {/* <TableCaption className="text-[12px]">
                  A list of your item variation.
                </TableCaption> */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">UNIT</TableHead>
                      <TableHead>SPECS</TableHead>
                      <TableHead>RATIO</TableHead>
                      <TableHead className="text-right">COST</TableHead>
                      <TableHead className="text-right">PRICE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item?.itemVariation?.map((item) => (
                      <TableRow
                        className={`${
                          item.isSelected === true
                            ? `bg-gray-300 cursor-pointer`
                            : `cursor-pointer`
                        }`}
                        key={item.UNITID}
                        onClick={() => {
                          hanldeClick(item);
                        }}
                      >
                        <TableCell className="font-medium ">
                          <p className="bg-green-500 inline-block px-2 py-1 rounded-full">
                            {item.UNIT}
                          </p>
                        </TableCell>
                        <TableCell>{item.DESCRIPTION}</TableCell>
                        <TableCell>{item.RATIO}</TableCell>
                        <TableCell className="text-right">
                          Php {item.COST}
                        </TableCell>
                        <TableCell className="text-right">
                          Php {item.PRICE}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Item Variation Table End */}

                <div className="mt-2 flex flex-col gap-2">
                  <div>
                    <Controller
                      id="CUSTOMER"
                      name="CUSTOMER"
                      control={control}
                      defaultValue={selectedItem?.CUSTOMER || ""}
                      rules={{ required: "Customer is required" }}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          onValueChange={(newValue) => {
                            onChange(newValue);
                          }}
                          value={value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Default Customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {customerData?.map(
                              (c, index) =>
                                c.NAME && (
                                  <SelectItem key={c.ID} value={c.NAME}>
                                    {c.NAME}
                                  </SelectItem>
                                )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      id="SUPPLIER"
                      name="SUPPLIER"
                      control={control}
                      defaultValue={selectedItem?.SUPPLIER || ""}
                      rules={{ required: "Customer is required" }}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          onValueChange={(newValue) => {
                            onChange(newValue);
                          }}
                          value={value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Default Supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            {supplierData?.map(
                              (s, index) =>
                                s.NAME && (
                                  <SelectItem key={s.ID} value={s.NAME}>
                                    {s.NAME}
                                  </SelectItem>
                                )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <div className="flex flex-col gap-2">
                    <Controller
                      name="FORSO" // Ensure the name matches the default value in the useForm
                      control={control}
                      render={({ field }) => (
                        <Select>
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="For SO" />
                          </SelectTrigger>
                          <SelectContent></SelectContent>
                        </Select>
                      )}
                    />
                    <Controller
                      name="FORPO" // Ensure the name matches the default value in the useForm
                      control={control}
                      render={({ field }) => (
                        <Select>
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="For PO" />
                          </SelectTrigger>
                          <SelectContent></SelectContent>
                        </Select>
                      )}
                    />
                    <Controller
                      name="FORPL" // Ensure the name matches the default value in the useForm
                      control={control}
                      render={({ field }) => (
                        <Select>
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="For PL" />
                          </SelectTrigger>
                          <SelectContent></SelectContent>
                        </Select>
                      )}
                    />
                    <Controller
                      name="FORINVOICE" // Ensure the name matches the default value in the useForm
                      control={control}
                      render={({ field }) => (
                        <Select>
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="For Invoice" />
                          </SelectTrigger>
                          <SelectContent></SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Textarea
                      className="w-[475px] h-full"
                      id="REMARK"
                      placeholder="Notes"
                      defaultValue={selectedItem?.REMARK || ""}
                      aria-invalid={errors.REMARK ? "true" : "false"}
                      {...register("REMARK", {
                        required: true,
                        maxLength: 200,
                      })}
                    />
                  </div>
                </div>

                <div className="mt-2 mb-2">
                  <Separator />
                </div>

                <div className="mt-2">
                  {errors.CODE && errors.NAME.type === "required" && (
                    <span>This is required</span>
                  )}
                  {errors.CODE && errors.NAME.type === "maxLength" && (
                    <span>Max length exceeded</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <Button type="submit">Submit</Button>

                <Button
                  className="bg-orange-500 hover:bg-orange-400"
                  type="button"
                  onClick={() => {
                    onClose();
                    reset();
                    dispatch(resetItemVariations());
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ItemAddEditDialog;
