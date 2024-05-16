import React, { act, useState } from "react";
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
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";

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
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    mutate(data);
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            {action === "edit" ? `Edit Customer` : `New Customer`}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="relative">
          <div>
            {selectedItem === null ? (
              ``
            ) : (
              <Input
                className="hidden"
                defaultValue={`${selectedItem.ID}`}
                {...register("ID", {
                  valueAsNumber: true,
                })}
                type="number"
              />
            )}
            <Input
              id="CODE"
              defaultValue={`${selectedItem === null ? `` : selectedItem.CODE}`}
              aria-invalid={errors.CODE ? "true" : "false"}
              {...register("CODE", { required: true, maxLength: 10 })}
            />
            <Input
              id="NAME"
              defaultValue={`${selectedItem === null ? `` : selectedItem.NAME}`}
              aria-invalid={errors.NAME ? "true" : "false"}
              {...register("NAME", { required: true, maxLength: 200 })}
            />
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
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerAddEditDialog;
