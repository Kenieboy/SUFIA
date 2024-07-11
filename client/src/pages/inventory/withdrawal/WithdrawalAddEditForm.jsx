import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CircleX } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  removePurchaseDeliveryDetail,
  resetPurchaseDetailData,
  updateWithdrawalItem,
} from "@/redux/purchaseDDSlice";
import { format } from "date-fns";
import WithdrawalItemList from "./WithdrawalItemList";

function WithdrawalAddEditForm({ modalState, fnClose }) {
  const [itemListModalState, setItemListModalState] = useState(false);
  const { purchaseDeliveryDetail } = useSelector((state) => state?.pddData);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    fnClose();
    console.log(data);
  };

  const handleInputChange = (e, id, field) => {
    const { value } = e.target;
    dispatch(updateWithdrawalItem({ id, field, value: parseFloat(value) }));
  };

  return (
    <>
      {itemListModalState && (
        <WithdrawalItemList
          modalState={itemListModalState}
          fnWIClose={setItemListModalState}
        />
      )}
      <Dialog open={modalState}>
        <DialogContent className="max-w-[1300px] h-[80%] overflow-y-scroll">
          <div className="relative">
            <div>
              <h1 className="text-xl font-bold">WITHDRAWAL FORM</h1>
            </div>
            <Separator className="bg-gray-700" />
            <div>
              <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
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
                          {...register("department", { required: true })}
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
                          {...register("section", { required: true })}
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
                          {...register("receivedBy", { required: true })}
                        />
                      </div>
                    </div>

                    {/* right side */}

                    <div className="w-1/6 mr-4">
                      <div className="mb-2">
                        <label htmlFor="refNo" className="block text-gray-700">
                          Ref No.
                        </label>
                        <input
                          type="text"
                          id="refNo"
                          name="refNo"
                          className="w-full p-1 border border-gray-500 rounded-full text-red-500 uppercase font-bold"
                          {...register("refNo", { required: true })}
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
                          defaultValue={new Date().toISOString().substr(0, 10)}
                          className="w-full p-1 border border-gray-500 rounded-full"
                          {...register("dateRequest", { required: true })}
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
                          {...register("product", { required: true })}
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
                          {...register("issuedBy", { required: true })}
                        />
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
                      {purchaseDeliveryDetail &&
                        purchaseDeliveryDetail.map((item, index) => (
                          <tr
                            key={item.PURCHASEDELIVERYDETAILID}
                            className="hover:bg-gray-50 cursor-pointer"
                          >
                            <td className="px-4 py-0 border border-gray-300 text-center">
                              {item.ITEMCODE}
                            </td>
                            <td className="px-4 py-0 border border-gray-300 font-bold">
                              {item.NAMEENG}
                            </td>
                            <td className="px-4 py-0 border border-gray-300">
                              <input
                                type="hidden"
                                name={`withdrawalDetail[${index}].ITEMVARIATIONID`}
                                defaultValue={item?.ITEMVARIATIONID || 0}
                                {...register(
                                  `withdrawalDetail[${index}].ITEMVARIATIONID`
                                )}
                              />

                              <input
                                name={`withdrawalDetail[${index}].QTY`}
                                type="number"
                                min={0}
                                defaultValue={item?.QTY || 0}
                                className="w-full text-m font-bold p-2 rounded focus:outline-none bg-transparent"
                                onChange={(e) => {
                                  const value =
                                    e.target.value === "" ? 0 : e.target.value;
                                  handleInputChange(
                                    { target: { value } },
                                    item.PURCHASEDELIVERYDETAILID,
                                    "QTY"
                                  );
                                }}
                                {...register(`withdrawalDetail[${index}].QTY`)}
                              />
                            </td>
                            <td className="px-4 py-0 border border-gray-300">
                              {item.itemVariations && (
                                <HoverCard openDelay={100}>
                                  <HoverCardTrigger asChild>
                                    <p className="">
                                      {
                                        item.itemVariations[
                                          item.itemVariations.findIndex(
                                            (item) => item.FORPO === 1
                                          )
                                        ].ITEMUNITDESCRIPTION
                                      }
                                    </p>
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-80">
                                    <div className="flex justify-between space-x-4">
                                      <div className="space-y-0">
                                        <h4 className="text-sm font-semibold ">
                                          @item variation
                                        </h4>
                                        <p className="text-xs flex flex-col">
                                          <span>
                                            Specification:{" "}
                                            {
                                              item.itemVariations[
                                                item.itemVariations.findIndex(
                                                  (item) => item.FORPO === 1
                                                )
                                              ].SPECIFICATIONS
                                            }
                                          </span>
                                          <span>
                                            Ratio:{" "}
                                            {
                                              item.itemVariations[
                                                item.itemVariations.findIndex(
                                                  (item) => item.FORPO === 1
                                                )
                                              ].RATIO
                                            }
                                          </span>
                                        </p>
                                        <div className="flex items-center pt-2">
                                          <span className="text-xs text-muted-foreground">
                                            {format(new Date(), "MM-dd-yyyy")}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </HoverCardContent>
                                </HoverCard>
                              )}
                            </td>
                            <td className="px-4 py-0 border border-gray-300"></td>
                            <td className="px-4 py-0 border border-gray-300 ">
                              <CircleX
                                className="cursor-pointer m-auto"
                                height={20}
                                width={20}
                                color="#fb8500"
                                onClick={() => {
                                  dispatch(
                                    removePurchaseDeliveryDetail(
                                      item.PURCHASEDELIVERYDETAILID
                                    )
                                  );
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      <tr>
                        <td className="px-4 py-1 border border-gray-300 font-bold text-center">
                          <p
                            className="bg-gray-700 inline-block text-white px-2 rounded-full cursor-pointer"
                            onClick={() => {
                              setItemListModalState(true);
                            }}
                          >
                            ...
                          </p>
                        </td>
                        <td className="px-4 py-1 border border-gray-300"></td>
                        <td className="px-4 py-1 border border-gray-300"></td>
                        <td className="px-4 py-1 border border-gray-300"></td>
                        <td className="px-4 py-1 border border-gray-300"></td>
                        <td className="px-4 py-1 border border-gray-300"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
                      onClick={() => {
                        fnClose();
                        dispatch(resetPurchaseDetailData());
                      }}
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
