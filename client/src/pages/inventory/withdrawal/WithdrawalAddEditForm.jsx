import React, { useEffect, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { getDepartmentAndSectionData } from "@/query/withdrawalRequest";

function WithdrawalAddEditForm({ modalState, fnClose, fnWDInsert }) {
  const [itemListModalState, setItemListModalState] = useState(false);
  const { purchaseDeliveryDetail } = useSelector((state) => state?.pddData);
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      DEPARTMENTID: null,
      SECTIONID: null,
      WITHDRAWALDETAIL: [],
    },
  });

  useEffect(() => {
    setValue(
      "WITHDRAWALDETAIL",
      purchaseDeliveryDetail.map(({ ITEMVARIATIONID, QTY }) => ({
        ITEMVARIATIONID,
        QTY,
      }))
    );
  }, [purchaseDeliveryDetail, setValue]);

  const onSubmit = (data) => {
    if (purchaseDeliveryDetail.length === 0) {
      alert("Material basket is empty!");
    } else {
      fnClose();
      fnWDInsert(data);
      dispatch(resetPurchaseDetailData());
    }
  };

  const handleInputQTY = (e, id, field) => {
    const { value } = e.target;
    dispatch(updateWithdrawalItem({ id, field, value: parseFloat(value) }));
  };

  const {
    isPending: isDepartmentDataPending,
    error: isDepartmentDataError,
    data: departmentAndSectionDataQuery,
  } = useQuery({
    queryKey: ["departmentandsection"],
    queryFn: getDepartmentAndSectionData,
  });

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
                          htmlFor="DEPARTMENTID"
                          className="block text-gray-700"
                        >
                          Department
                        </label>
                        {departmentAndSectionDataQuery && (
                          <select
                            id="DEPARTMENTID"
                            name="DEPARTMENTID"
                            className="w-full p-1 border border-gray-500 rounded-full"
                            {...register("DEPARTMENTID", {
                              required: true,
                              pattern: {
                                value: /^[0-9]*$/,
                                message:
                                  "Please enter a valid department ID (numeric).",
                              },
                              setValueAs: (value) => Number(value), // Ensure values are stored as numbers
                            })}
                            onChange={(e) => {
                              setValue("DEPARTMENTID", e.target.value); // Set value directly from event
                            }}
                          >
                            <option value="">Select Department</option>
                            {/* Map over departments and render options */}
                            {departmentAndSectionDataQuery.departments.map(
                              (item) => (
                                <option value={item.ID} key={item.ID}>
                                  {item.NAME}
                                </option>
                              )
                            )}
                          </select>
                        )}
                      </div>
                      <div className="mb-2">
                        <label
                          htmlFor="SECTIONID"
                          className="block text-gray-700"
                        >
                          Section
                        </label>
                        {departmentAndSectionDataQuery && (
                          <select
                            id="SECTIONID"
                            name="SECTIONID"
                            className="w-full p-1 border border-gray-500 rounded-full"
                            {...register("SECTIONID", {
                              required: true,
                              pattern: {
                                value: /^[0-9]*$/,
                                message:
                                  "Please enter a valid department ID (numeric).",
                              },
                              setValueAs: (value) => Number(value), // Ensure values are stored as numbers
                            })}
                            onChange={(e) => {
                              setValue("SECTIONID", e.target.value); // Set value directly from event
                            }}
                          >
                            <option value="">Select Department</option>
                            {/* Map over departments and render options */}
                            {departmentAndSectionDataQuery.sections.map(
                              (item) => (
                                <option value={item.ID} key={item.ID}>
                                  {item.NAME}
                                </option>
                              )
                            )}
                          </select>
                        )}
                      </div>
                      <div className="mb-2">
                        <label
                          htmlFor="RECEIVEBY"
                          className="block text-gray-700"
                        >
                          Received By
                        </label>
                        <input
                          type="text"
                          id="RECEIVEBY"
                          name="RECEIVEBY"
                          className="w-full p-1 border border-gray-500 rounded-full"
                          {...register("RECEIVEBY", { required: true })}
                        />
                      </div>
                    </div>

                    {/* right side */}

                    <div className="w-1/6 mr-4">
                      <div className="mb-2">
                        <label htmlFor="REFNO" className="block text-gray-700">
                          Ref No.
                        </label>
                        <input
                          type="text"
                          id="REFNO"
                          name="REFNO"
                          className="w-full p-1 border border-gray-500 rounded-full text-red-500 uppercase font-bold"
                          {...register("REFNO", { required: true })}
                        />
                      </div>
                      <div className="mb-2">
                        <label
                          htmlFor="DATEREQUEST"
                          className="block text-gray-700"
                        >
                          Date Request
                        </label>
                        <input
                          type="date"
                          id="DATEREQUEST"
                          name="DATEREQUEST"
                          defaultValue={new Date().toISOString().substr(0, 10)}
                          className="w-full p-1 border border-gray-500 rounded-full"
                          {...register("DATEREQUEST", { required: true })}
                        />
                      </div>
                      <div className="mb-2">
                        <label
                          htmlFor="PRODUCT"
                          className="block text-gray-700"
                        >
                          Project
                        </label>
                        <input
                          type="text"
                          id="PRODUCT"
                          name="PRODUCT"
                          className="w-full p-1 border border-gray-500 rounded-full"
                          {...register("PRODUCT", { required: true })}
                        />
                      </div>
                      <div className="mb-2">
                        <label
                          htmlFor="ISSUEDBY"
                          className="block text-gray-700"
                        >
                          Issued By
                        </label>
                        <input
                          type="text"
                          id="ISSUEDBY"
                          name="ISSUEDBY"
                          className="w-full p-1 border border-gray-500 rounded-full"
                          {...register("ISSUEDBY", { required: true })}
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
                            className={`hover:bg-gray-50 cursor-pointer ${
                              index % 2 !== 0 ? "bg-gray-100" : ""
                            }`}
                          >
                            <td className="px-4 py-0 border border-gray-300 text-center">
                              {item.ITEMCODE}
                            </td>
                            <td className="px-4 py-0 border border-gray-300 font-bold">
                              {item.NAMEENG}
                            </td>
                            <td className="px-4 py-0 border border-gray-300">
                              <input
                                type="number"
                                min={0}
                                defaultValue={item?.QTY}
                                className="w-full text-m font-bold p-2 rounded focus:outline-none bg-transparent"
                                onChange={(e) => {
                                  const value =
                                    e.target.value === "" ? 0 : e.target.value;
                                  handleInputQTY(
                                    { target: { value } },
                                    item.PURCHASEDELIVERYDETAILID,
                                    "QTY"
                                  );
                                }}
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
                          <HoverCard openDelay={100}>
                            <HoverCardTrigger>
                              <p
                                className="bg-gray-700 inline-block text-white px-2 rounded-full cursor-pointer"
                                onClick={() => {
                                  setItemListModalState(true);
                                }}
                              >
                                ...
                              </p>
                            </HoverCardTrigger>
                            <HoverCardContent className="ml-4">
                              Click here to add new item.
                            </HoverCardContent>
                          </HoverCard>
                        </td>
                        <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
                        <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
                        <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
                        <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
                        <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
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
