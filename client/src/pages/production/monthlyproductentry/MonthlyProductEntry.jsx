import React, { useState, useEffect } from "react";

import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDispatch, useSelector } from "react-redux";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getItemDetail,
  getProductItem,
  insertMonthlyProductEntry,
  updateProductionDetail,
} from "@/query/productionRequest";
import {
  addMonthlyProductEntry,
  clearMonthlyProductEntryData,
  clearProductionData,
  updateIsEditMode,
  updateQtyForMonthlyProductEntry,
} from "@/redux/standardConsumptionSlice";

function MonthlyProductEntry() {
  const [date, setDate] = useState("");
  const [modalState, setModalState] = useState(false);
  const productMemTable = useSelector(
    (state) => state.scData.monthlyProductEntry
  );
  const applicationState = useSelector((state) => state.scData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Query for product item data
  const {
    isPending: isProductItemDataPending,
    error: productItemDataError,
    data: productItemData,
    refetch: refetchProductItemData,
  } = useQuery({
    queryKey: ["product"],
    queryFn: getProductItem,
  });

  // Handle date changes
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleModalStateAction = () => {
    setModalState((prev) => !prev);
  };

  const formatNumberWithCommas = (number) => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    if (applicationState.isEditMode) {
      setDate(applicationState.productionData.DATEPRODUCTION);
    }
  }, [applicationState.isEditMode]);

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold">New Monthly Product Entry</h1>
        <h2>
          Edit mode:{" "}
          {applicationState.isEditMode ? "edit mode" : "off edit mode"}
        </h2>
        <Separator />

        <div className="flex items-center gap-2 mt-2">
          <label htmlFor="date-entry">Date:</label>
          <input
            type="date"
            id="date-entry"
            name="date-entry"
            value={date}
            onChange={handleDateChange}
          />
        </div>
      </div>
      {/* Table Area */}
      <div className="table-container mt-2">
        <table className="min-w-full table-fixed-header text-[12px]">
          <thead>
            <tr>
              <th className="px-4 py-1 border border-gray-300 w-[100px]">
                LineNo.
              </th>
              <th className="px-4 py-1 border border-gray-300 w-[100px]">
                SO No.
              </th>
              <th className="px-4 py-1 border border-gray-300">PRODUCT NAME</th>
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
            {productMemTable &&
              productMemTable.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-1 border border-gray-300 bg-gray-100 text-center">
                    {index}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
                  <td className="px-4 py-1 border border-gray-300 bg-gray-100">
                    {item.NAMEENG}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 bg-gray-100">
                    <input
                      type="number"
                      min={0}
                      defaultValue={formatNumberWithCommas(
                        parseFloat(item?.QTY)
                      )}
                      className="w-full text-m font-bold p-2 rounded focus:outline-none bg-transparent"
                      onChange={(e) => {
                        const newQty =
                          e.target.value === ""
                            ? 0
                            : parseFloat(e.target.value);

                        dispatch(
                          updateQtyForMonthlyProductEntry({
                            ID: item.ID,
                            QTY: newQty,
                          })
                        );
                      }}
                    />
                  </td>
                  <td className="px-4 py-1 border border-gray-300 bg-gray-100">
                    {item.ITEMUNITCODE}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
                  <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
                </tr>
              ))}
            <tr>
              <td className="px-4 py-1 border border-gray-300 font-bold text-center">
                <p
                  className="bg-gray-700 inline-block text-white px-2 rounded-full cursor-pointer"
                  onClick={() => {
                    handleModalStateAction();
                  }}
                >
                  ...
                </p>
              </td>
              <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
              <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
              <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
              <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
              <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
              <td className="px-4 py-1 border border-gray-300 bg-gray-100"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* BUTTON START */}

      <div className="text-xs flex gap-1 mt-4 font-semibold">
        <div>
          <button
            type="button"
            className="bg-green-500 hover:bg-green-400 text-white px-4 py-1 rounded-full"
            onClick={() => {
              if (date === "") {
                alert("Please provide date!");
              } else {
                if (applicationState.isEditMode) {
                  const productionID = applicationState.productionData?.ID;
                  if (productionID) {
                    updateProductionDetail({
                      productionID,
                      date,
                      productMemTable,
                    })
                      .then(() => {
                        dispatch(clearMonthlyProductEntryData());
                        dispatch(clearProductionData());
                        navigate("/production");
                      })
                      .catch((error) => {
                        console.error(
                          "Error:",
                          error.response?.data || error.message
                        );
                      });
                  } else {
                    console.error("Production data is missing or invalid!");
                  }
                } else {
                  // Trigger insert function
                  insertMonthlyProductEntry({
                    date,
                    productMemTable,
                  })
                    .then(() => {
                      dispatch(clearMonthlyProductEntryData());
                      navigate("/production");
                    })
                    .catch((error) => {
                      console.error(
                        "Error:",
                        error.response?.data || error.message
                      );
                    });
                }
              }
            }}
          >
            Save
          </button>
        </div>
        <div>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded-full"
            onClick={() => {
              navigate("/production");
              dispatch(clearMonthlyProductEntryData());
              dispatch(clearProductionData());
              dispatch(updateIsEditMode(false));
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* BUTTON END */}

      {/* POP-UP PRODUCT LIST */}

      <Dialog open={modalState}>
        {/* max-w-[800px] h-[70%] overflow-y-scroll */}
        <DialogContent className="">
          <div>
            <h1 className="text-xl font-bold">PRODUCT LIST</h1>
          </div>

          <div className="table-container-receiving">
            <table className="min-w-full table-fixed-header text-[12px]">
              <thead>
                <tr>
                  <th className="px-4 py-2 border border-gray-300 w-[150px]">
                    ID
                  </th>
                  <th className="px-4 py-2 border border-gray-300 w-[150px]">
                    CODE
                  </th>

                  <th className="px-4 py-2 border border-gray-300 w-[150px]">
                    PRODUCT NAME
                  </th>
                  <th className="px-4 py-2 border border-gray-300 w-[300px]">
                    NOTE
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white text-[10px]">
                {productItemData &&
                  productItemData.map((pd, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-100 cursor-pointer ${
                        index % 2 !== 0 ? "bg-gray-50" : ""
                      }`}
                      onClick={async () => {
                        const data = await getItemDetail(pd.ID);
                        dispatch(addMonthlyProductEntry(data));
                        handleModalStateAction;
                      }}
                    >
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        {pd.ID}
                      </td>
                      <td className="px-4 py-1 border border-gray-300 font-bold">
                        {pd.CODE}
                      </td>

                      <td className="px-4 py-1 border border-gray-300 ">
                        {pd.NAMEENG}
                      </td>
                      <td className="px-4 py-1 border border-gray-300 ">
                        {pd.NOTE}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div>
            {/* BUTTON */}
            <div className="text-xs flex gap-1 mt-6 font-semibold">
              <div>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded-full"
                  onClick={handleModalStateAction}
                >
                  Close
                </button>
              </div>
            </div>
            {/* BUTTON END */}
          </div>
        </DialogContent>
      </Dialog>

      {/* POP-UP PRODUCT LIST END */}
    </div>
  );
}

export default MonthlyProductEntry;
