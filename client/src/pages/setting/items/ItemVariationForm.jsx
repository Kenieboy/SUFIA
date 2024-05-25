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
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";

// react hook form component
import { useForm, Controller, set } from "react-hook-form";

// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";

// data fetching itemunit data for combobox purpose
import { getItemUnitData } from "@/query/itemRequest";

function ItemVariationForm({ selectedItem, mode, fnClose }) {
  // fetching items data
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
      UNIT: "",
      UNITID: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    reset();
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
                      render={({ field: { onChange, value } }) => (
                        <Select
                          onValueChange={(newValue) => {
                            onChange(newValue);

                            const { ID } = data.find(
                              (item) => item.DESCRIPTIONEN === newValue
                            );

                            setValue("UNITID", ID);
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
                  </div>

                  {/* ============ */}

                  <Input
                    id="RATION"
                    type="number"
                    placeholder="Ration"
                    defaultValue={selectedItem?.RATION || ""}
                    aria-invalid={errors.RATION ? "true" : "false"}
                    {...register("RATION", {
                      required: true,
                      maxLength: 200,
                    })}
                    onInput={(e) => {
                      const inputValue = e.target.value;
                      // Check if the input value is negative
                      if (inputValue < 0) {
                        // Set the input value to an empty string or any default value
                        e.target.value = ""; // You can set any default value here if needed
                      }
                    }}
                  />
                </div>

                <div className="mt-2">
                  <Input
                    id="DESCRIPTION"
                    placeholder="Description"
                    defaultValue={selectedItem?.DESCRIPTION || ""}
                    aria-invalid={errors.DESCRIPTION ? "true" : "false"}
                    {...register("DESCRIPTION", {
                      required: true,
                      maxLength: 200,
                    })}
                  />
                </div>
                {/* ===================================== */}
                <div className="flex gap-2 mt-2">
                  <Input
                    id="NETWT"
                    placeholder="Net Wt."
                    defaultValue={selectedItem?.NETWT || ""}
                    aria-invalid={errors.NETWT ? "true" : "false"}
                    {...register("NETWT", { required: true, maxLength: 200 })}
                  />
                  <Input
                    id="GROSSWT"
                    placeholder="Gross Wt."
                    defaultValue={selectedItem?.GROSSWT || ""}
                    aria-invalid={errors.GROSSWT ? "true" : "false"}
                    {...register("GROSSWT", {
                      required: true,
                      maxLength: 200,
                    })}
                  />
                  <Input
                    id="VOLUME"
                    placeholder="Volume"
                    defaultValue={selectedItem?.VOLUME || ""}
                    aria-invalid={errors.VOLUME ? "true" : "false"}
                    {...register("VOLUME", { required: true, maxLength: 200 })}
                  />
                </div>

                {/* ===================================== */}
                <div className="flex gap-2 mt-2">
                  <Input
                    id="COST"
                    type="number"
                    placeholder="Cost"
                    defaultValue={selectedItem?.COST || ""}
                    aria-invalid={errors.COST ? "true" : "false"}
                    {...register("COST", {
                      required: true,
                      maxLength: 200,
                    })}
                    onInput={(e) => {
                      const inputValue = e.target.value;
                      // Check if the input value is negative
                      if (inputValue < 0) {
                        // Set the input value to an empty string or any default value
                        e.target.value = ""; // You can set any default value here if needed
                      }
                    }}
                  />

                  <Input
                    id="PRICE"
                    type="number"
                    placeholder="Price"
                    defaultValue={selectedItem?.PRICE || ""}
                    aria-invalid={errors.PRICE ? "true" : "false"}
                    {...register("PRICE", {
                      required: true,
                      maxLength: 200,
                    })}
                    onInput={(e) => {
                      const inputValue = e.target.value;
                      // Check if the input value is negative
                      if (inputValue < 0) {
                        // Set the input value to an empty string or any default value
                        e.target.value = ""; // You can set any default value here if needed
                      }
                    }}
                  />

                  <Input
                    id="HALFOFPRICE"
                    type="number"
                    placeholder="1/2 OF Price"
                    defaultValue={selectedItem?.HALFOFPRICE || ""}
                    aria-invalid={errors.HALFOFPRICE ? "true" : "false"}
                    {...register("HALFOFPRICE", {
                      required: true,
                      maxLength: 200,
                    })}
                    onInput={(e) => {
                      const inputValue = e.target.value;
                      // Check if the input value is negative
                      if (inputValue < 0) {
                        // Set the input value to an empty string or any default value
                        e.target.value = ""; // You can set any default value here if needed
                      }
                    }}
                  />
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
