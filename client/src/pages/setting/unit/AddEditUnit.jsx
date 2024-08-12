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
import { useDispatch, useSelector } from "react-redux";
import { resetDataArr } from "@/redux/itemSlice";

function AddEditUnit({ modalState, fnClose, fnIUInsert }) {
  const { register, setValue, handleSubmit } = useForm();

  const handleUppercase = (event) => {
    const { name, value } = event.target;
    const uppercasedValue = value.toUpperCase();
    setValue(name, uppercasedValue, { shouldValidate: true });
  };

  const { data } = useSelector((state) => state.itemData);
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    fnIUInsert(data);
    fnClose();
    dispatch(resetDataArr());
  };

  return (
    <div>
      <Dialog open={modalState.isVisible}>
        <DialogContent className="w-96 overflow-hidden">
          <DialogHeader>
            <DialogTitle>UNIT</DialogTitle>
            <Separator className="" />
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="text-xs flex flex-col gap-1">
                <div className="flex flex-col gap-1">
                  <div>
                    <label htmlFor="CODE">Code:</label>
                  </div>
                  <input
                    id="ID"
                    name="ID"
                    type="hidden"
                    defaultValue={modalState.isEditMode ? data[0].ID : ""}
                    {...register("ID")}
                  />
                  <input
                    id="CODE"
                    name="CODE"
                    type="text"
                    defaultValue={modalState.isEditMode ? data[0].CODE : ""}
                    className="w-40 p-1 px-2 border border-gray-500 rounded-full uppercase"
                    {...register("CODE", {
                      required: true,
                      onChange: handleUppercase,
                    })}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div>
                    <label htmlFor="DESCRIPTIONEN">Discription:</label>
                  </div>
                  <input
                    id="DESCRIPTIONEN"
                    name="DESCRIPTIONEN"
                    type="text"
                    defaultValue={
                      modalState.isEditMode ? data[0].DESCRIPTIONEN : ""
                    }
                    className="w-full p-1 px-2 border border-gray-500 rounded-full uppercase"
                    {...register("DESCRIPTIONEN", {
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
                      onClick={() => {
                        fnClose();

                        modalState.isEditMode && dispatch(resetDataArr());
                      }}
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

export default AddEditUnit;
