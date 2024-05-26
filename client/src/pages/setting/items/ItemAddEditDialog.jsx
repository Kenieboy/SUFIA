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
import { removeItemVariation } from "@/redux/itemSlice";

function ItemAddEditDialog({
  mode = false,
  onClose,
  mutate,
  action,
  selectedItem = null,
}) {
  const [isOpen, setIsOpen] = useState(mode);
  const [isItemVariationFormOpen, setIsItemVariationFormOpen] = useState(false);

  // item state
  const item = useSelector((state) => state.item);

  // form state
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      LANGUAGES: selectedItem?.LANGUAGES || "JAPANESE",
      COUNTRY: selectedItem?.COUNTRY || "",
    },
  });

  // redux dispatch
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    mutate(data);
    onClose();
    console.log(data);
  };

  const handleVariationForm = () => {
    setIsItemVariationFormOpen((prev) => !prev);
  };

  return (
    <>
      {isItemVariationFormOpen && (
        <ItemVariationForm
          mode={isItemVariationFormOpen}
          fnClose={handleVariationForm}
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
                {selectedItem === null ? (
                  ``
                ) : (
                  <Input
                    id="ID"
                    type="hidden"
                    defaultValue={selectedItem?.ID || ""}
                    {...register("ID", { valueAsNumber: true })}
                  />
                )}
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
                      name="COUNTRY" // Ensure the name matches the default value in the useForm
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Select item class" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      name="COUNTRY" // Ensure the name matches the default value in the useForm
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Select item category" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                {country.label}
                              </SelectItem>
                            ))}
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
                  <Button className="text-xs">Edit</Button>
                  <Button className="bg-red-500 hover:bg-red-400 text-xs">
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
                      <TableRow className="">
                        <TableCell className="font-medium">
                          {item.UNIT}
                        </TableCell>
                        <TableCell>{item.DESCRIPTION}</TableCell>
                        <TableCell>{item.RATIO}</TableCell>
                        <TableCell className="text-right">
                          ${item.COST}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.PRICE}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Item Variation Table End */}

                <div className="mt-2 flex flex-col gap-2">
                  <div>
                    <Controller
                      name="COUNTRY" // Ensure the name matches the default value in the useForm
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Default customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      name="COUNTRY" // Ensure the name matches the default value in the useForm
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Default supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <div className="flex flex-col gap-2">
                    <Controller
                      name="COUNTRY" // Ensure the name matches the default value in the useForm
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="For SO" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Controller
                      name="COUNTRY" // Ensure the name matches the default value in the useForm
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="For PO" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Controller
                      name="COUNTRY" // Ensure the name matches the default value in the useForm
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="For PL" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Controller
                      name="COUNTRY" // Ensure the name matches the default value in the useForm
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="For INVOICE" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
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
                    dispatch(removeItemVariation());
                    onClose();
                    reset();
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
