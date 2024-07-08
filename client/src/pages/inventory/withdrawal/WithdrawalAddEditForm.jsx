import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";

function WithdrawalAddEditForm({ modalState, fnClose }) {
  return (
    <>
      {/* {itemListModalState && (
        <ReceivingItemList
          modalState={itemListModalState}
          fnRIClose={setItemListModalState}
        />
      )} */}
      <Dialog open={modalState}>
        <DialogContent className="max-w-[1300px] h-[80%]">
          <div className="relative">
            <div>
              <h1 className="text-xl font-bold">WITHDRAWAL FORM</h1>
            </div>
            <Separator className="bg-gray-700" />
            <div>
              <form className="mt-6">
                <div>
                  <div className="text-xs">
                    <div className="flex gap-4">
                      {/* left side */}
                      <div className="w-1/6 ml-4">
                        <div className="mb-2 mt-[51px]">
                          <label
                            htmlFor="department"
                            className="block text-gray-700"
                          >
                            Department
                          </label>
                          <select
                            id="department"
                            name="department"
                            className="w-full p-1 border border-gray-500 rounded-full"
                          >
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                            <option value="IT">IT</option>
                            <option value="Marketing">Marketing</option>
                          </select>
                        </div>
                        <div className="mb-2">
                          <label
                            htmlFor="section"
                            className="block text-gray-700"
                          >
                            Section
                          </label>
                          <select
                            id="section"
                            name="section"
                            className="w-full p-1 border border-gray-500 rounded-full"
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                          </select>
                        </div>
                        <div className="mb-2">
                          <label
                            htmlFor="receivedBy"
                            className="block text-gray-700"
                          >
                            Received By
                          </label>
                          <input
                            type="text"
                            id="receivedBy"
                            name="receivedBy"
                            className="w-full p-1 border border-gray-500 rounded-full"
                          />
                        </div>
                      </div>

                      {/* right side */}

                      <div className="w-1/6 mr-4">
                        <div className="mb-2">
                          <label
                            htmlFor="refNo"
                            className="block text-gray-700"
                          >
                            Ref No.
                          </label>
                          <input
                            type="text"
                            id="refNo"
                            name="refNo"
                            className="w-full p-1 border border-gray-500 rounded-full text-red-500 uppercase font-bold"
                          />
                        </div>
                        <div className="mb-2">
                          <label
                            htmlFor="dateRequest"
                            className="block text-gray-700"
                          >
                            Date Request
                          </label>
                          <input
                            type="date"
                            id="dateRequest"
                            name="dateRequest"
                            className="w-full p-1 border border-gray-500 rounded-full"
                          />
                        </div>
                        <div className="mb-2">
                          <label
                            htmlFor="product"
                            className="block text-gray-700"
                          >
                            Project
                          </label>
                          <input
                            type="text"
                            id="product"
                            name="product"
                            className="w-full p-1 border border-gray-500 rounded-full"
                          />
                        </div>
                        <div className="mb-2">
                          <label
                            htmlFor="issuedBy"
                            className="block text-gray-700"
                          >
                            Issued By
                          </label>
                          <input
                            type="text"
                            id="issuedBy"
                            name="issuedBy"
                            className="w-full p-1 border border-gray-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="mt-4 bg-gray-700" />

                {/* TABLE */}

                <div className="table-container">
                  <table className="min-w-full table-fixed-header text-[12px]">
                    <thead>
                      <tr>
                        <th className="px-4 py-1 border border-gray-300 w-[100px]">
                          CODE
                        </th>
                        <th className="px-4 py-1 border border-gray-300">
                          MATERIAL
                        </th>
                        <th className="px-4 py-1 border border-gray-300 w-[100px]">
                          QTY
                        </th>
                        <th className="px-4 py-1 border border-gray-300 w-[100px]">
                          UNIT
                        </th>
                        <th className="px-4 py-1 border border-gray-300 w-[200px]">
                          LOT NO.
                        </th>
                        <th className="px-4 py-1 border border-gray-300 w-[150px]">
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-[10px]">
                      <tr className=" hover:bg-gray-50 cursor-pointer">
                        <td className="px-4 py-0 border border-gray-300 text-center">
                          001
                        </td>
                        <td className="px-4 py-0 border border-gray-300 font-bold">
                          Steel Material
                        </td>
                        <td className="px-4 py-0 border border-gray-300">
                          <input
                            type="number"
                            min={0}
                            defaultValue={0}
                            className="w-full text-m font-bold p-2 rounded focus:outline-none bg-transparent"
                          />
                        </td>
                        <td className="px-4 py-0 border border-gray-300">
                          <HoverCard openDelay={100}>
                            <HoverCardTrigger asChild>
                              <p className="">kg</p>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="flex justify-between space-x-4">
                                <div className="space-y-0">
                                  <h4 className="text-sm font-semibold ">
                                    @item variation
                                  </h4>
                                  <p className="text-xs flex flex-col">
                                    <span>Specification: steel item</span>
                                    <span>Ratio: x1</span>
                                  </p>
                                  <div className="flex items-center pt-2">
                                    <span className="text-xs text-muted-foreground">
                                      July 8, 2024
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </td>
                        <td className="px-4 py-0 border border-gray-300">
                          A12345
                        </td>
                        <td className="px-4 py-0 border border-gray-300 ">
                          <CircleX
                            className="cursor-pointer m-auto"
                            height={20}
                            width={20}
                            color="#fb8500"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-1 border border-gray-300 font-bold text-center">
                          <p
                            className="bg-gray-700 inline-block text-white px-2  rounded-full cursor-pointer"
                            onClick={() => {
                              console.log("add item...");
                            }}
                          >
                            ...
                          </p>
                        </td>
                        <td className="px-4 py-1 border border-gray-300"></td>
                        <td className="px-4 py-1 border border-gray-300"></td>
                        <td className="px-4 py-1 border border-gray-300"></td>
                        <td className="px-4 py-1 border border-gray-300"></td>
                        <td className="px-4 py-1 border border-gray-300 "></td>
                      </tr>

                      {/* <tr class="bg-gray-50">
                        <td class="px-4 py-2 border border-gray-300">002</td>
                        <td class="px-4 py-2 border border-gray-300">Copper</td>
                        <td class="px-4 py-2 border border-gray-300">30</td>
                        <td class="px-4 py-2 border border-gray-300">kg</td>
                        <td class="px-4 py-2 border border-gray-300">B67890</td>
                      </tr> */}
                    </tbody>
                  </table>
                </div>

                <div className="text-xs"></div>
                {/* TABLE END */}

                {/* BUTTON */}
                <div className="text-xs flex gap-1 mt-6 font-semibold">
                  <div>
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-400 text-white px-4 py-1 rounded-full"
                    >
                      Save
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded-full"
                      onClick={fnClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
                {/* BUTTON END */}
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default WithdrawalAddEditForm;
