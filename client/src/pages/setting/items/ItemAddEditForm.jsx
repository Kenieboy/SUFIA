import React, { useState, useEffect } from "react";

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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

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
import ItemVariationForm from "./ItemVariationForm";
import {
  deleteFromItemVariation,
  removeSelectedVariations,
  removeSelectedVariationsFromTable,
  resetItemVariation,
  toggleItemVariationSelection,
  toggleSelect,
} from "@/redux/itemSlice";

function ItemAddEditForm({
  fmMode,
  fnClose,
  selectedItem = null,
  mutate,
  setAction,
  setSelectedItem,
  action,
}) {
  const [isFormVariationOpen, setIsFormVariationOpen] = useState(false);

  const dispatch = useDispatch();

  const {
    itemClass,
    itemCategory,
    itemVariation,
    defaultCustomer,
    defaultSupplier,
  } = useSelector((state) => state.itemData);

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
      itemVariation: [...itemVariation],
    },
  });

  useEffect(() => {
    // Update form values with itemVariation from Redux store when component mounts
    setValue("itemVariation", itemVariation);
  }, [itemVariation, setValue]);

  const onSubmit = (data) => {
    if (itemVariation.length === 0) {
      alert("Please provide variation for this new item!");
    } else {
      mutate(data);
      fnClose();
      dispatch(resetItemVariation());
      navigate("/settings/items");
    }
  };

  const handleFormVariation = () => {
    setIsFormVariationOpen((prev) => !prev);
  };

  const initialItemClassDescription =
    itemClass.find((i) => i.ID === selectedItem?.ITEMCLASSID)?.DESCRIPTION ||
    "";

  const initialItemCategoryDescription =
    itemCategory.find((i) => i.ID === selectedItem?.ITEMCATEGORYID)
      ?.DESCRIPTION || "";

  const initialItemDefaultCustomer =
    defaultCustomer.find((i) => i.ID === selectedItem?.DEFAULTCUSTOMERID)
      ?.NAME || "";

  const initialItemDefaultSupplier =
    defaultSupplier.find((i) => i.ID === selectedItem?.DEFAULTSUPPLIERID)
      ?.NAME || "";

  const totalItemVariationSelected = itemVariation.filter(
    (iv) => iv.isSelected
  );

  const handleCheckboxChange = (itemId, propertyName) => {
    dispatch(toggleSelect({ itemId, propertyName }));
  };

  // Define isPropertyUnique function
  const isPropertyUnique = (property, itemId) => {
    return !itemVariation.some(
      (item) => item[property] === 1 && item.ID !== itemId
    );
  };

  const handleRemoveSelected = () => {
    const selectedVariations = itemVariation.filter(
      (variation) => variation.isSelected
    );
    selectedVariations.forEach((variation) =>
      dispatch(deleteFromItemVariation(variation))
    );
  };

  if (selectedItem) {
    setValue("ITEMCLASSID", selectedItem.ITEMCLASSID);
    setValue("ITEMCATEGORYID", selectedItem.ITEMCATEGORYID);
    setValue("DEFAULTCUSTOMERID", selectedItem.DEFAULTCUSTOMERID);
    setValue("DEFAULTSUPPLIERID", selectedItem.DEFAULTSUPPLIERID);
  }

  return (
    <div>
      {isFormVariationOpen && (
        <ItemVariationForm
          fnClose={handleFormVariation}
          fmMode={isFormVariationOpen}
          selectedItem={selectedItem}
        />
      )}
      <Dialog open={fmMode}>
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? (
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
            <DialogDescription></DialogDescription>
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

                <div className="flex gap-2 mt-2 ">
                  {/* =================== BUTTON AREA ===================== */}
                  <Button
                    type="button"
                    disabled={totalItemVariationSelected.length > 0}
                    onClick={handleFormVariation}
                    className=" text-xs flex gap-2 bg-green-500 hover:bg-green-400"
                  >
                    <PlusCircleIcon />
                    Add
                  </Button>
                  <Button
                    type="button"
                    disabled={
                      totalItemVariationSelected.length > 1 ||
                      totalItemVariationSelected.length <= 0
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    disabled={totalItemVariationSelected.length <= 0}
                    className="bg-red-500 hover:bg-red-400 text-xs"
                    onClick={() => {
                      if (selectedItem) {
                        handleRemoveSelected();
                      }
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
                      <TableHead>FOR SO</TableHead>
                      <TableHead>FOR PO</TableHead>
                      <TableHead>FOR PL</TableHead>
                      <TableHead>FOR INVOICE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemVariation &&
                      itemVariation?.map((item, i) => (
                        <TableRow
                          className={`${
                            item.isSelected
                              ? `bg-gray-300 cursor-pointer`
                              : `cursor-pointer`
                          }`}
                          key={i} // index key
                          onDoubleClick={() => {
                            dispatch(toggleItemVariationSelection(item));
                          }}
                        >
                          <TableCell className="font-medium">
                            <p className="bg-green-500 inline-block px-2 py-1 rounded-full">
                              {item.UNIT}
                            </p>
                          </TableCell>
                          <TableCell>{item.SPECIFICATIONS}</TableCell>
                          <TableCell>{item.RATIO}</TableCell>
                          <TableCell className="text-right">
                            Php {item.COST}
                          </TableCell>
                          <TableCell className="text-right">
                            Php {item.PRICE}
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              name="FORSO"
                              disabled={
                                selectedItem &&
                                item?.FORSO === 1 &&
                                !isPropertyUnique(
                                  itemVariation,
                                  "FORSO",
                                  item.ID
                                )
                              }
                              checked={item?.FORSO === 1}
                              onCheckedChange={() => {
                                handleCheckboxChange(item.ID, "FORSO");
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {/* <Checkbox
                              name="FORPO"
                              {...(selectedItem
                                ? {
                                    checked: item?.FORPO === 1,
                                  }
                                : {})}
                              onCheckedChange={() => {
                                handleCheckboxChange(item.ID, "FORPO");
                              }}
                            /> */}
                            <Checkbox
                              name="FORPO"
                              disabled={
                                selectedItem &&
                                item?.FORPO === 1 &&
                                !isPropertyUnique(
                                  itemVariation,
                                  "FORPO",
                                  item.ID
                                )
                              }
                              checked={item?.FORPO === 1}
                              onCheckedChange={() => {
                                handleCheckboxChange(item.ID, "FORPO");
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              name="FORPACKINGLIST"
                              disabled={
                                selectedItem &&
                                item?.FORPACKINGLIST === 1 &&
                                !isPropertyUnique(
                                  itemVariation,
                                  "FORPACKINGLIST",
                                  item.ID
                                )
                              }
                              checked={item?.FORPACKINGLIST === 1}
                              onCheckedChange={() => {
                                handleCheckboxChange(item.ID, "FORPACKINGLIST");
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              name="FORINVOICE"
                              disabled={
                                selectedItem &&
                                item?.FORINVOICE === 1 &&
                                !isPropertyUnique(
                                  itemVariation,
                                  "FORINVOICE",
                                  item.ID
                                )
                              }
                              checked={item?.FORINVOICE === 1}
                              onCheckedChange={() => {
                                handleCheckboxChange(item.ID, "FORINVOICE");
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                <div className="mt-2 flex gap-2">
                  <div>
                    <Controller
                      id="ITEMCLASS"
                      name="ITEMCLASS"
                      control={control}
                      defaultValue={initialItemClassDescription}
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
                      defaultValue={initialItemCategoryDescription}
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
                      defaultValue={initialItemDefaultCustomer}
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
                      defaultValue={initialItemDefaultSupplier}
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
                  {/* <div className="flex flex-col gap-2">
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
                  </div> */}
                  <div>
                    <Textarea
                      className="w-[730px] h-full"
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
                  onClick={() => {
                    if (action) {
                      setSelectedItem(null);
                      setAction();
                    }
                    dispatch(resetItemVariation());
                    fnClose();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ItemAddEditForm;
