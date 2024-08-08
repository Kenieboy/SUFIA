import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { useForm } from "react-hook-form";

function AddEditDept({ modalState, fnClose }) {
  const { register, setValue, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    fnClose();
  };

  const handleUppercase = (event) => {
    const { name, value } = event.target;
    const uppercasedValue = value.toUpperCase();
    setValue(name, uppercasedValue, { shouldValidate: true });
  };

  return (
    <div>
      <Dialog open={modalState}>
        <DialogContent className="w-96 overflow-hidden">
          <DialogHeader>
            <DialogTitle>DEPARTMENT</DialogTitle>
            <Separator className="" />
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="text-xs flex flex-col gap-1">
                <div className="flex flex-col gap-1">
                  <div>
                    <label htmlFor="code">Code:</label>
                  </div>
                  <input
                    id="CODE"
                    name="CODE"
                    type="text"
                    className="w-40 p-1 px-2 border border-gray-500 rounded-full uppercase"
                    {...register("CODE", {
                      required: true,
                      onChange: handleUppercase,
                    })}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div>
                    <label htmlFor="department">Department:</label>
                  </div>
                  <input
                    id="DEPARTMENT"
                    name="DEPARTMENT"
                    type="text"
                    className="w-full p-1 px-2 border border-gray-500 rounded-full uppercase"
                    {...register("DEPARTMENT", {
                      required: true,
                      onChange: handleUppercase,
                    })}
                  />
                </div>
              </div>

              <div className="text-xs mt-4">
                <div className="flex gap-1">
                  <div>
                    <button
                      type="submit"
                      className=" border-2 border-green-500 text-green-500 px-4 py-1 rounded-full"
                    >
                      Save
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      className=" border-2 border-red-400 text-red-500 px-4 py-1 rounded-full"
                      onClick={fnClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddEditDept;
