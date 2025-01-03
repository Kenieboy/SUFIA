import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// data fetching tanstack component
import { useQuery } from "@tanstack/react-query";
import {
  getDailyConsumptionData,
  getMonthlyProductData,
  getMonthlyProductDetail,
  getProductDailyConsumptionById,
  getProductItem,
  getProductStandardConsumptionById,
  getStandardConsumptionData,
} from "@/query/productionRequest";
import { useDispatch, useSelector } from "react-redux";
import {
  addMonthlyProductEntry,
  setProductionData,
  setSelectedProduct,
  updateIsEditMode,
  updateSelectedProduct,
} from "@/redux/standardConsumptionSlice";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useEffect } from "react";

function Production() {
  const [modalState, setModalState] = useState(false);
  const [path, setPath] = useState(null);
  const [defaultTab, setDefaultTab] = useState(() => {
    const savedTab = localStorage.getItem("defaultTab");
    return savedTab ? savedTab : "standard-consumption";
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const applicationState = useSelector((state) => state.scData);

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

  const {
    isPending: isStandardConsumptionDataPending,
    error: standardConsumptionDataError,
    data: standardConsumptionData,
    refetch: refetchStandardConsumptionData,
  } = useQuery({
    queryKey: ["standardconsumption"],
    queryFn: getStandardConsumptionData,
  });

  const {
    isPending: isDailyConsumptionDataPending,
    error: dailyConsumptionDataError,
    data: dailyConsumptionData,
    refetch: refetchDailyConsumptionData,
  } = useQuery({
    queryKey: ["dailyconsumption"],
    queryFn: getDailyConsumptionData,
  });

  const {
    isPending: isMonthlyProductDataPending,
    error: monthlyProductDataError,
    data: monthlyProductData,
    refetch: refetchMonthlyProductData,
  } = useQuery({
    queryKey: ["monthlyproductdata"],
    queryFn: getMonthlyProductData,
  });

  useEffect(() => {
    refetchStandardConsumptionData;
  }, [navigate, applicationState, path, dispatch]);

  const handleModalStateAction = () => {
    setModalState((prev) => !prev);
  };

  const handleTabChange = (newTab) => {
    setDefaultTab(newTab);
    localStorage.setItem("defaultTab", newTab); // Save the selected tab to localStorage
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Production</h1>

        {/* <Link to="/newproduction">New PCS</Link>
        <Link to="/newdailyconsumption">New PCS</Link> */}
      </div>

      <Tabs defaultValue={defaultTab} className="">
        <TabsList>
          <TabsTrigger
            value="standard-consumption"
            onClick={() => handleTabChange("standard-consumption")}
          >
            Standard Consumption
          </TabsTrigger>
          <TabsTrigger
            value="daily-consumption"
            onClick={() => handleTabChange("daily-consumption")}
          >
            Daily Consumption
          </TabsTrigger>
          <TabsTrigger
            value="monthly-product-entry"
            onClick={() => handleTabChange("monthly-product-entry")}
          >
            Monthly Product Entry
          </TabsTrigger>
        </TabsList>
        <TabsContent value="standard-consumption">
          <div className="space-x-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-400"
              onClick={() => {
                handleModalStateAction();
                setPath("/newstandardconsumption");
              }}
            >
              Create Standard Consuption
            </button>
          </div>

          <div className="table-container mt-2">
            <table className="min-w-full table-fixed-header text-[12px]">
              <thead>
                <tr>
                  <th className="px-4 py-1 border border-gray-300 w-[100px]">
                    ID
                  </th>
                  <th className="px-4 py-1 border border-gray-300">REFNO</th>
                  <th className="px-4 py-1 border border-gray-300 w-[100px]">
                    PRODUCT
                  </th>
                  <th className="px-4 py-1 border border-gray-300 w-[100px]">
                    DATE
                  </th>
                  <th className="px-4 py-1 border border-gray-300 w-[100px]">
                    NOTE
                  </th>
                  <th className="px-4 py-1 border border-gray-300 w-[200px]">
                    INPUTBY
                  </th>
                  <th className="px-4 py-1 border border-gray-300 w-[150px]">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white text-[10px]">
                {standardConsumptionData &&
                  standardConsumptionData.map((item, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        index % 2 !== 0 ? "bg-gray-100" : ""
                      }`}
                      onClick={async () => {
                        console.log(item.PRODUCTITEMID);

                        const obj = await getProductStandardConsumptionById(
                          item.PRODUCTITEMID
                        );

                        dispatch(updateSelectedProduct(obj));
                        dispatch(updateIsEditMode(true));
                        navigate("/newstandardconsumption");
                      }}
                    >
                      <td className="px-4 py-1 border border-gray-300">
                        {item.ID}
                      </td>
                      <td className="px-4 py-1 border border-gray-300">
                        {item.REFNO}
                      </td>
                      <td className="px-4 py-1 border border-gray-300">
                        {item.NAMEENG}
                      </td>
                      <td className="px-4 py-1 border border-gray-300">
                        {item.DATE
                          ? new Date(item.DATE).toLocaleDateString("en-US")
                          : "N/A"}
                      </td>
                      <td className="px-4 py-1 border border-gray-300">
                        {item.NOTE}
                      </td>
                      <td className="px-4 py-1 border border-gray-300">
                        {item.INPUTBY}
                      </td>
                      <td className="px-4 py-1 border border-gray-300">
                        ACTION
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="daily-consumption">
          <div className="space-x-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-400"
              onClick={() => {
                handleModalStateAction();
                setPath("/newdailyconsumption");
              }}
            >
              Create Daily Consuption
            </button>
          </div>

          <div className="table-container mt-2">
            <table className="min-w-full table-fixed-header text-[12px]">
              <thead>
                <tr>
                  <th className="px-4 py-1 border border-gray-300 w-[100px]">
                    ID
                  </th>
                  <th className="px-4 py-1 border border-gray-300">REFNO</th>
                  <th className="px-4 py-1 border border-gray-300 w-[100px]">
                    PRODUCT
                  </th>
                  <th className="px-4 py-1 border border-gray-300 w-[100px]">
                    DATE
                  </th>
                  <th className="px-4 py-1 border border-gray-300 w-[100px]">
                    NOTE
                  </th>
                  <th className="px-4 py-1 border border-gray-300 w-[200px]">
                    INPUTBY
                  </th>
                  <th className="px-4 py-1 border border-gray-300 w-[150px]">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white text-[10px]">
                {dailyConsumptionData &&
                  dailyConsumptionData.map((item, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        index % 2 !== 0 ? "bg-gray-100" : ""
                      }`}
                      onClick={async () => {
                        console.log(item.PRODUCTITEMID, item.SECTIONID);

                        const obj = await getProductDailyConsumptionById(
                          item.PRODUCTITEMID,
                          item.SECTIONID
                        );
                        dispatch(updateSelectedProduct(obj));
                        dispatch(updateIsEditMode(true));
                        navigate("/editdailyconsumption");
                      }}
                    >
                      <td className="px-4 py-1 border border-gray-300">
                        {item.ID}
                      </td>
                      <td className="px-4 py-1 border border-gray-300">
                        {item.REFNO}
                      </td>
                      <td className="px-4 py-1 border border-gray-300">
                        {item.NAMEENG}
                      </td>
                      <td className="px-4 py-1 border border-gray-300">
                        {item.DATE
                          ? new Date(item.DATE).toLocaleDateString("en-US")
                          : "N/A"}
                      </td>
                      <td className="px-4 py-1 border border-gray-300">
                        {item.NOTE}
                      </td>
                      <td className="px-4 py-1 border border-gray-300">
                        {item.INPUTBY}
                      </td>
                      <td className="px-4 py-1 border border-gray-300">
                        ACTION
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="monthly-product-entry">
          <div className="space-x-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-400"
              onClick={() => {
                navigate("/monthly-product-entry");
              }}
            >
              New Entry
            </button>
          </div>

          <div className="table-container mt-2">
            <table className="min-w-full table-fixed-header text-[12px]">
              <thead>
                <tr>
                  <th className="px-4 py-1 border border-gray-300 w-[100px]">
                    ID
                  </th>
                  <th className="px-4 py-1 border border-gray-300">DATE</th>
                  <th className="px-4 py-1 border border-gray-300 w-[100px]">
                    USER
                  </th>

                  <th className="px-4 py-1 border border-gray-300 w-[150px]">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white text-[10px]">
                {monthlyProductData &&
                  monthlyProductData.map((item, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        index % 2 !== 0 ? "bg-gray-100" : ""
                      }`}
                      onClick={async () => {
                        try {
                          // Fetch data for the selected product
                          const data = await getMonthlyProductDetail(item.ID);

                          if (Array.isArray(data) && data.length > 0) {
                            // Loop through each item and dispatch it individually
                            data.forEach((product) => {
                              dispatch(addMonthlyProductEntry(product)); // Dispatch each item as an array
                            });

                            dispatch(setProductionData(item));
                            dispatch(updateIsEditMode(true));
                            navigate("/monthly-product-entry");
                          } else {
                            console.log("No data found for the product.");
                          }
                        } catch (error) {
                          console.error(
                            "Error fetching product details:",
                            error
                          );
                        }
                      }}
                    >
                      <td className="px-4 py-1 border border-gray-300">
                        {item.ID}
                      </td>
                      <td className="px-4 py-1 border border-gray-300">
                        {item.DATEPRODUCTION
                          ? new Date(item.DATEPRODUCTION).toLocaleDateString(
                              "en-US"
                            )
                          : "N/A"}
                      </td>
                      <td className="px-4 py-1 border border-gray-300">
                        {item.USER}
                      </td>
                      <td className="px-4 py-1 border border-gray-300">
                        ACTION
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

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
                      onClick={() => {
                        dispatch(
                          setSelectedProduct({
                            PRODUCTITEMID: pd.ID,
                            PRODUCTNAME: pd.NAMEENG,
                          })
                        );
                        navigate(path);
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
    </div>
  );
}

export default Production;
