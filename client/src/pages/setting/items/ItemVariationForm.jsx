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
import { useQuery } from "@tanstack/react-query";
import { getItemUnitData } from "@/query/itemRequest";
import { useDispatch } from "react-redux";
import { addItemVariation } from "@/redux/itemSlice";

function ItemVariationForm({ fnClose, selectedItem, fmMode }) {
  // Query for item unit
  const {
    isPending,
    error,
    data,
    refetch: refetchItemUnit,
  } = useQuery({
    queryKey: ["itemunit"],
    queryFn: getItemUnitData,
    staleTime: Infinity,
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

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(addItemVariation(data));
    reset();
    fnClose();
  };
  return (
    <Dialog open={fmMode}>
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
                            const itemUnitId = data.find(
                              (item) => item.DESCRIPTIONEN === newValue
                            );
                            setValue("ITEMUNITID", itemUnitId.ID);
                            setValue("ID", itemUnitId.ID);
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
                    placeholder="NET WT"
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
