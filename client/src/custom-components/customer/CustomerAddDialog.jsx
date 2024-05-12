import React, { useState } from "react";

// shadcn components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { PlusCircle } from "lucide-react";

import { useForm } from "react-hook-form";

function CustomerAddDialog({ mutate }) {
  // dialog state
  const [isOpen, setIsOpen] = useState(false);

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
    reset();
  };

  // trigger open dialog
  const handlOpenDialog = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen}>
        <DialogTrigger asChild>
          <Button className="flex gap-2" onClick={handlOpenDialog}>
            <PlusCircle />
            Add
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[900px] h-4/5">
          <DialogHeader>
            <DialogTitle>New Customer</DialogTitle>
            <DialogDescription>
              {/* Make changes to your profile here. Click save when you're done. */}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* register your input into the hook by invoking the "register" function */}
            <input defaultValue="" {...register("CODE")} />
            <input defaultValue="" {...register("NAME")} />
            <input
              className="hidden"
              defaultValue={1}
              {...register("FIRMCLASSID", {
                valueAsNumber: true, // Treat input value as a number
              })}
              type="number"
            />

            {errors.exampleRequired && <span>This field is required</span>}

            <input type="submit" />
          </form>
          {/* <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstname" className="text-right">
                First Name
              </Label>
              <Input className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastname" className="text-right">
                Last Name
              </Label>
              <Input className="col-span-3" />
            </div>
          </div> */}
          <DialogFooter className="absolute bottom-4 right-4">
            <Button
              type="submit"
              onClick={() => {
                mutate({
                  CODE: "42341",
                  NAME: "REFETCH ACTION",
                  FIRMCLASSID: 1,
                });

                setIsOpen(!isOpen);
              }}
            >
              Save changes
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-400"
              type="submit"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CustomerAddDialog;
