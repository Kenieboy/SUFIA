import React, { useEffect } from "react";

// shadcn component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

// react hook form component
import { useForm, Controller, set } from "react-hook-form";

// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";

// data fetching itemunit data for combobox purpose
import { getItemUnitData } from "@/query/itemRequest";

// redux
import { useDispatch } from "react-redux";
import { addItemVariation, updateItemVariationById } from "@/redux/itemSlice";

function ItemVariationForm({ selectedItem, mode, fnClose, action }) {
  // fetching item unit data
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["itemunit"],
    queryFn: getItemUnitData,
  });

  // form state
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ID: "",
      UNIT: "",
      ITEMUNITID: "",
    },
  });

  useEffect(() => {
    if (action === "edit" && selectedItem) {
      setValue("ID", selectedItem.ID);
      setValue("UNIT", selectedItem.UNIT);
      setValue("ITEMUNITID", selectedItem.ITEMUNITID);
    } else {
      reset({ ID: "", UNIT: "", UNITID: "" });
    }
  }, [action, selectedItem, setValue, reset]);

  // redux
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    const otherData = { ...data, isSelected: false };
    if (action === "edit") {
      dispatch(updateItemVariationById(otherData));
      fnClose();
    } else {
      dispatch(addItemVariation(otherData));
      fnClose();
    }
  };

  return (
    <Dialog open={mode}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Item Variation</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} className="relative">
            <div className="px-2 mt-6">
              <div>
                <div className="flex gap-2">
                  <div>
                    {/* =============== ITEMUNIT COMBOBOX ================ */}

                    <Controller
                      id="UNIT"
                      name="UNIT"
                      control={control}
                      defaultValue={selectedItem?.UNIT || ""}
                      rules={{ required: "Unit is required" }}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          onValueChange={(newValue) => {
                            onChange(newValue);
                            const { ID } = data.find(
                              (item) => item.DESCRIPTIONEN === newValue
                            );
                            setValue("ITEMUNITID", ID);
                            if (action !== "edit") {
                              setValue("ID", ID);
                            }
                          }}
                          value={value}
                        >
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Select a unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {data?.map(
                              (itemunit) =>
                                itemunit.DESCRIPTIONEN && (
                                  <SelectItem
                                    key={itemunit.ID}
                                    value={itemunit.DESCRIPTIONEN}
                                  >
                                    {itemunit.DESCRIPTIONEN}
                                  </SelectItem>
                                )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.UNIT && <span>{errors.UNIT.message}</span>}
                  </div>

                  {/* ============ */}

                  <Input
                    id="RATIO"
                    type="number"
                    placeholder="Ratio"
                    defaultValue={selectedItem?.RATIO || ""}
                    step="0.01"
                    {...register("RATIO", {
                      required: "Ratio is required",
                      valueAsNumber: true,
                      validate: (value) =>
                        value >= 0 || "Price must be a non-negative number",
                    })}
                    aria-invalid={errors.RATIO ? "true" : "false"}
                    onInput={(e) => {
                      const inputValue = e.target.valueAsNumber;
                      if (inputValue < 0) {
                        e.target.value = ""; // Set to empty string if negative value
                      }
                    }}
                  />
                  {errors.RATIO && <p>{errors.RATIO.message}</p>}
                </div>

                <div className="mt-2">
                  <Input
                    id="SPECIFICATIONS"
                    placeholder="SPECIFICATIONS"
                    defaultValue={selectedItem?.SPECIFICATIONS || ""}
                    aria-invalid={errors.SPECIFICATIONS ? "true" : "false"}
                    {...register("SPECIFICATIONS", {
                      required: true,
                      maxLength: 200,
                    })}
                  />
                </div>
                {/* ===================================== */}
                <div className="flex gap-2 mt-2">
                  <Input
                    id="NETWEIGHT"
                    type="number"
                    placeholder="GROSS WT"
                    defaultValue={selectedItem?.NETWEIGHT || ""}
                    step="0.01"
                    {...register("NETWEIGHT", {
                      required: "Cost is required",
                      valueAsNumber: true,
                      validate: (value) =>
                        value >= 0 || "Price must be a non-negative number",
                    })}
                    aria-invalid={errors.NETWEIGHT ? "true" : "false"}
                    onInput={(e) => {
                      const inputValue = e.target.valueAsNumber;
                      if (inputValue < 0) {
                        e.target.value = ""; // Set to empty string if negative value
                      }
                    }}
                  />
                  {errors.NETWEIGHT && <p>{errors.NETWEIGHT.message}</p>}
                  <Input
                    id="GROSSWEIGHT"
                    type="number"
                    placeholder="GROSS WT"
                    defaultValue={selectedItem?.GROSSWEIGHT || ""}
                    step="0.01"
                    {...register("GROSSWEIGHT", {
                      required: "Gross WT is required",
                      valueAsNumber: true,
                      validate: (value) =>
                        value >= 0 || "Gross WT must be a non-negative number",
                    })}
                    aria-invalid={errors.GROSSWEIGHT ? "true" : "false"}
                    onInput={(e) => {
                      const inputValue = e.target.valueAsNumber;
                      if (inputValue < 0) {
                        e.target.value = ""; // Set to empty string if negative value
                      }
                    }}
                  />
                  {errors.GROSSWEIGHT && <p>{errors.GROSSWEIGHT.message}</p>}
                  <Input
                    id="VOLUME"
                    type="number"
                    placeholder="VOLUME"
                    defaultValue={selectedItem?.VOLUME || ""}
                    step="0.01"
                    {...register("VOLUME", {
                      required: "Volume is required",
                      valueAsNumber: true,
                      validate: (value) =>
                        value >= 0 || "Volume must be a non-negative number",
                    })}
                    aria-invalid={errors.VOLUME ? "true" : "false"}
                    onInput={(e) => {
                      const inputValue = e.target.valueAsNumber;
                      if (inputValue < 0) {
                        e.target.value = ""; // Set to empty string if negative value
                      }
                    }}
                  />
                  {errors.VOLUME && <p>{errors.COST.message}</p>}
                </div>

                {/* ===================================== */}
                <div className="flex gap-2 mt-2">
                  <Input
                    id="COST"
                    type="number"
                    placeholder="Cost"
                    defaultValue={selectedItem?.COST || ""}
                    step="0.01"
                    {...register("COST", {
                      required: "Cost is required",
                      valueAsNumber: true,
                      validate: (value) =>
                        value >= 0 || "Price must be a non-negative number",
                    })}
                    aria-invalid={errors.COST ? "true" : "false"}
                    onInput={(e) => {
                      const inputValue = e.target.valueAsNumber;
                      if (inputValue < 0) {
                        e.target.value = ""; // Set to empty string if negative value
                      }
                    }}
                  />
                  {errors.COST && <p>{errors.COST.message}</p>}

                  <Input
                    id="PRICE"
                    type="number"
                    placeholder="Price"
                    defaultValue={selectedItem?.PRICE || ""}
                    step="0.01"
                    {...register("PRICE", {
                      required: "Price is required",
                      valueAsNumber: true,
                      validate: (value) =>
                        value >= 0 || "Price must be a non-negative number",
                    })}
                    aria-invalid={errors.PRICE ? "true" : "false"}
                    onInput={(e) => {
                      const inputValue = e.target.valueAsNumber;
                      if (inputValue < 0) {
                        e.target.value = ""; // Set to empty string if negative value
                      }
                    }}
                  />
                  {errors.PRICE && <p>{errors.PRICE.message}</p>}

                  {/* <Input
                    id="HALFOFPRICE"
                    type="number"
                    placeholder="1/2 Of Price"
                    defaultValue={selectedItem?.HALFOFPRICE || ""}
                    step="0.01"
                    {...register("HALFOFPRICE", {
                      valueAsNumber: true,
                      validate: (value) =>
                        value >= 0 || "Price must be a non-negative number",
                    })}
                    aria-invalid={errors.HALFOFPRICE ? "true" : "false"}
                    onInput={(e) => {
                      const inputValue = e.target.valueAsNumber;
                      if (inputValue < 0) {
                        e.target.value = ""; // Set to empty string if negative value
                      }
                    }}
                  />
                  {errors.HALFOFPRICE && <p>{errors.HALFOFPRICE.message}</p>} */}
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button type="submit">Submit</Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-400"
                  type="button"
                  onClick={() => {
                    fnClose();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ItemVariationForm;
