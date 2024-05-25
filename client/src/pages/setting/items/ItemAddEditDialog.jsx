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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// react hook form component
import { useForm, Controller } from "react-hook-form";
import { Plus, PlusCircleIcon } from "lucide-react";

const countries = [
  { label: "Philippines", value: "PH" },
  { label: "Japan", value: "JP" },
];

function ItemAddEditDialog({
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
          {/* <DialogTitle>
            {action === "edit" ? (
              <div className="flex px-6 items-center justify-between">
                <p>Edit Customer</p>
                <p className="text-[10px] cursor-pointer bg-green-500 px-2 py-1 rounded-full text-white">
                  {selectedItem?.CODE || ""}
                </p>
              </div>
            ) : (
              `New Item`
            )}
          </DialogTitle> */}
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
                <Button
                  onClick={() => {
                    alert("Trigger...");
                  }}
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
                  <TableRow className="">
                    <TableCell className="font-medium">set(s)</TableCell>
                    <TableCell></TableCell>
                    <TableCell>1</TableCell>
                    <TableCell className="text-right">$1,878.00</TableCell>
                    <TableCell className="text-right">$20,658.00</TableCell>
                  </TableRow>
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
                    {...register("REMARK", { required: true, maxLength: 200 })}
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

export default ItemAddEditDialog;