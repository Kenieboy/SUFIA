import React, { useState } from "react";

//shadcn component
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// react hook form component
import { useForm, Controller } from "react-hook-form";

const countries = [
  { label: "Philippines", value: "PH" },
  { label: "Japan", value: "JP" },
];

function CustomerAddEditDialog({
  mode = false,
  onClose,
  mutate,
  action,
  selectedItem = null,
}) {
  const [isOpen, setIsOpen] = useState(mode);

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

  const onSubmit = (data) => {
    mutate(data);
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {action === "edit" ? `Edit Customer` : `New Customer`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="relative">
          <div className="px-6 mt-6">
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

              <Input
                id="NAME"
                placeholder="Customer Name"
                defaultValue={selectedItem?.NAME || ""}
                aria-invalid={errors.NAME ? "true" : "false"}
                {...register("NAME", { required: true, maxLength: 200 })}
              />

              <div className="mt-4 flex gap-2 ">
                <Input
                  id="CONTACTPERSON"
                  placeholder="In-Charge"
                  defaultValue={selectedItem?.CONTACTPERSON || ""}
                  aria-invalid={errors.CONTACTPERSON ? "true" : "false"}
                  {...register("CONTACTPERSON", {
                    required: true,
                    maxLength: 200,
                  })}
                />
                <Input
                  id="DEPARTMENT"
                  placeholder="Department"
                  defaultValue={selectedItem?.DEPARTMENT || ""}
                  aria-invalid={errors.DEPARTMENT ? "true" : "false"}
                  {...register("DEPARTMENT", {
                    required: true,
                    maxLength: 200,
                  })}
                />
              </div>

              <div className="mt-4 ">
                <Textarea
                  id="ADDRESS1"
                  placeholder="Address 1"
                  defaultValue={selectedItem?.ADDRESS1 || ""}
                  aria-invalid={errors.ADDRESS1 ? "true" : "false"}
                  {...register("ADDRESS1", { required: true, maxLength: 200 })}
                />
              </div>

              <div className="mt-4 flex gap-2 ">
                <Input
                  id="ADDRESS2"
                  placeholder="Address 2"
                  defaultValue={selectedItem?.ADDRESS2 || ""}
                  aria-invalid={errors.ADDRESS2 ? "true" : "false"}
                  {...register("ADDRESS2", { required: true, maxLength: 200 })}
                />
                {/* <Input
                  id="COUNTRY"
                  placeholder="Country"
                  defaultValue={selectedItem?.COUNTRY || ""}
                  aria-invalid={errors.COUNTRY ? "true" : "false"}
                  {...register("COUNTRY", { required: true, maxLength: 200 })}
                /> */}

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
                          <SelectValue placeholder="Select a country" />
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

              <div className="mt-4 flex gap-2 ">
                <Input
                  id="ZIP"
                  placeholder="Zip code"
                  defaultValue={selectedItem?.ZIP || ""}
                  aria-invalid={errors.ZIP ? "true" : "false"}
                  {...register("ZIP", { required: true, maxLength: 200 })}
                />
                <Input
                  id="TELNO"
                  placeholder="Phone #"
                  defaultValue={selectedItem?.TELNO || ""}
                  aria-invalid={errors.TELNO ? "true" : "false"}
                  {...register("TELNO", { required: true, maxLength: 200 })}
                />
              </div>

              <div className="mt-4 flex gap-2 ">
                <Input
                  id="FAXNO"
                  placeholder="Fax"
                  defaultValue={selectedItem?.FAXNO || ""}
                  aria-invalid={errors.FAXNO ? "true" : "false"}
                  {...register("FAXNO", { required: true, maxLength: 200 })}
                />
                <Input
                  id="EMAIL"
                  placeholder="Email"
                  defaultValue={selectedItem?.EMAIL || ""}
                  aria-invalid={errors.EMAIL ? "true" : "false"}
                  {...register("EMAIL", { required: true, maxLength: 200 })}
                />
              </div>

              <div className="mt-4 ">
                <Textarea
                  id="REMARK"
                  placeholder="Notes"
                  defaultValue={selectedItem?.REMARK || ""}
                  aria-invalid={errors.REMARK ? "true" : "false"}
                  {...register("REMARK", { required: true, maxLength: 200 })}
                />
              </div>

              <div className="mt-4 flex gap-2 ">
                <Input
                  id="COMPANYTIN"
                  placeholder="Company TIN"
                  defaultValue={selectedItem?.COMPANYTIN || ""}
                  aria-invalid={errors.COMPANYTIN ? "true" : "false"}
                  {...register("COMPANYTIN", {
                    required: true,
                    maxLength: 200,
                  })}
                />
              </div>

              <div className="mt-6 mb-6">
                <Separator />
              </div>

              {/* Radio group */}
              <div className="flex gap-4 mt-4 mb-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Languages...</Label>
                  <Controller
                    control={control}
                    name="LANGUAGES"
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        className="flex items-center"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="JAPANESE" id="JAPANESE" />
                          <Label htmlFor="JAPANESE">Japanese</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ENGLISH" id="ENGLISH" />
                          <Label htmlFor="ENGLISH">English</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.LANGUAGES && <p>{errors.LANGUAGES.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">yen or usd...</Label>
                  <Controller
                    control={control}
                    name="CURRENCY"
                    defaultValue="YEN"
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        className="flex items-center"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="YEN" id="YEN" />
                          <Label htmlFor="YEN">YEN</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="USD" id="USD" />
                          <Label htmlFor="USD">USD</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs">Taxes...</Label>
                <Controller
                  control={control}
                  name="TAXES"
                  defaultValue="TAXINCLUDED"
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      className="flex items-center"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="TAXINCLUDED" id="TAXINCLUDED" />
                        <Label htmlFor="TAXINCLUDED">tax included</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="TAXEXCUDED" id="TAXEXCUDED" />
                        <Label htmlFor="TAXEXCUDED">tax excluded</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="NOTAX" id="NOTAX" />
                        <Label htmlFor="NOTAX">no tax</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              <div className="mt-6 mb-6">
                <Separator />
              </div>

              {/* Radio group end */}

              <Input
                className="hidden"
                defaultValue={1}
                {...register("FIRMCLASSID", {
                  valueAsNumber: true,
                })}
                type="number"
              />

              <div className="mt-6">
                {errors.CODE && errors.NAME.type === "required" && (
                  <span>This is required</span>
                )}
                {errors.CODE && errors.NAME.type === "maxLength" && (
                  <span>Max length exceeded</span>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button type="submit">Submit</Button>
              <Button
                className="bg-red-500 hover:bg-red-400"
                type="button"
                onClick={() => {
                  onClose();
                  reset();
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerAddEditDialog;
