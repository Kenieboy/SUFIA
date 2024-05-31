import React from "react";

// shadcn component
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// redux
import { useDispatch, useSelector } from "react-redux";

// react hook form component
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { PlusCircleIcon } from "lucide-react";

import { useNavigate } from "react-router-dom";

function ItemAddEditForm({ fmMode, fnClose, selectedItem = null, mutate }) {
  const { itemClass, itemCategory, defaultCustomer, defaultSupplier } =
    useSelector((state) => state.itemData);

  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ITEMCLASSID: "",
      ITEMCATEGORYID: "",
      DEFAULTCUSTOMERID: "",
      DEFAULTSUPPLIERID: "",
      item: { itemVariation: [] },
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    mutate(data);
    fnClose();
    navigate("/settings/items");
  };

  return (
    <Dialog open={fmMode}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>New Item</DialogTitle>
          <DialogDescription></DialogDescription>
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

              <div className="flex gap-2 mt-2 ">
                {/* =================== BUTTON AREA ===================== */}
                <Button className=" text-xs flex gap-2 bg-green-500 hover:bg-green-400">
                  <PlusCircleIcon />
                  Add
                </Button>
                <Button>Edit</Button>
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
                <TableBody></TableBody>
              </Table>
              {/* Item Variation Table End */}

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
                          const itemClassId = itemClass.find(
                            (iC) => iC.DESCRIPTION === newValue
                          );

                          setValue("ITEMCLASSID", itemClassId.ID);
                        }}
                        value={value}
                      >
                        <SelectTrigger className="w-[250px]">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemClass &&
                            itemClass.map((iClass) => (
                              <SelectItem
                                key={iClass.ID}
                                value={iClass.DESCRIPTION}
                              >
                                {iClass.DESCRIPTION}
                              </SelectItem>
                            ))}
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
                          const itemCategoryId = itemCategory.find(
                            (iCat) => iCat.DESCRIPTION === newValue
                          );

                          setValue("ITEMCATEGORYID", itemCategoryId.ID);
                        }}
                        value={value}
                      >
                        <SelectTrigger className="w-[250px]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemCategory &&
                            itemCategory.map((iCat) => (
                              <SelectItem
                                key={iCat.ID}
                                value={iCat.DESCRIPTION}
                              >
                                {iCat.DESCRIPTION}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="mt-2 flex flex-col gap-2">
                <div>
                  <Controller
                    id="DEFAULTCUSTOMER"
                    name="DEFAULTCUSTOMER"
                    control={control}
                    defaultValue={selectedItem?.DEFAULTCUSTOMER || ""}
                    rules={{ required: "Customer is required" }}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        onValueChange={(newValue) => {
                          onChange(newValue);
                          const customerId = defaultCustomer.find(
                            (cus) => cus.NAME === newValue
                          );

                          setValue("DEFAULTCUSTOMERID", customerId.ID);
                        }}
                        value={value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Default Customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {defaultCustomer &&
                            defaultCustomer.map((defCustomer) => (
                              <SelectItem
                                key={defCustomer.ID}
                                value={defCustomer.NAME}
                              >
                                {defCustomer.NAME}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    id="DEFAULTSUPPLIER"
                    name="DEFAULTSUPPLIER"
                    control={control}
                    defaultValue={selectedItem?.DEFAULTSUPPLIER || ""}
                    rules={{ required: "Supplier is required" }}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        onValueChange={(newValue) => {
                          onChange(newValue);
                          const supplierId = defaultSupplier.find(
                            (sup) => sup.NAME === newValue
                          );

                          setValue("DEFAULTSUPPLIERID", supplierId.ID);
                        }}
                        value={value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Default Supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {defaultSupplier &&
                            defaultSupplier.map((defSupplier) => (
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
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <div className="flex flex-col gap-2">
                  <Input
                    id="FORSO"
                    type="number"
                    placeholder="For SO"
                    defaultValue={selectedItem?.FORSO || ""}
                    aria-invalid={errors.FORSO ? "true" : "false"}
                    {...register("FORSO", { required: true, maxLength: 200 })}
                  />
                  <Input
                    id="FORPO"
                    type="number"
                    placeholder="For PO"
                    defaultValue={selectedItem?.FORPO || ""}
                    aria-invalid={errors.FORPO ? "true" : "false"}
                    {...register("FORPO", { required: true, maxLength: 200 })}
                  />
                  <Input
                    id="FORPL"
                    type="number"
                    placeholder="FOR PL"
                    defaultValue={selectedItem?.FORPL || ""}
                    aria-invalid={errors.FORPL ? "true" : "false"}
                    {...register("FORPL", { required: true, maxLength: 200 })}
                  />
                  <Input
                    id="FORINVOICE"
                    type="number"
                    placeholder="FOR Invoice"
                    defaultValue={selectedItem?.FORINVOICE || ""}
                    aria-invalid={errors.FORINVOICE ? "true" : "false"}
                    {...register("FORINVOICE", {
                      required: true,
                      maxLength: 200,
                    })}
                  />
                </div>
                <div>
                  <Textarea
                    className="w-[475px] h-full"
                    id="NOTE"
                    placeholder="Notes"
                    defaultValue={selectedItem?.NOTE || ""}
                    aria-invalid={errors.NOTE ? "true" : "false"}
                    {...register("NOTE", {
                      required: true,
                      maxLength: 200,
                    })}
                  />
                </div>
              </div>

              <div className="mt-2 mb-2">
                <Separator />
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <Button type="submit">Submit</Button>

              <Button
                className="bg-orange-500 hover:bg-orange-400"
                type="button"
                onClick={fnClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ItemAddEditForm;
