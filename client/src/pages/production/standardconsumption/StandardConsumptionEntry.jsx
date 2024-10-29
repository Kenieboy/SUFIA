import {
  addItemToSection,
  clearSelectedProduct,
  removeItemSection,
  setSelectedSection,
  updateItemQty,
} from "@/redux/standardConsumptionSlice";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getProductSection,
  insertProductSection,
} from "@/query/productionRequest";
import { CircleX, FastForward, Plus } from "lucide-react";
import { getItemData, getPurchaseDeliveryDetail } from "@/query/itemRequest";
import { FixedSizeList as List } from "react-window";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ShoppingBasket } from "lucide-react";

function StandardConsumptionEntry() {
  const [modalState, setModalState] = useState({
    isVisible: false,
    isEditMode: false,
  });

  const [frmSection, setFrmSection] = useState(false);
  const [frmItem, setFrmItem] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSection, setCurrentSection] = useState(0);

  const selectedProduct = useSelector((state) => state.scData.selectedProduct);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { register, setValue, handleSubmit, reset } = useForm({});

  const handleUppercase = (event) => {
    const { name, value } = event.target;
    const uppercasedValue = value.toUpperCase();
    setValue(name, uppercasedValue, { shouldValidate: true });
  };
  const handleFrmSectionModal = () => {
    setFrmSection((prev) => !prev);
  };

  const {
    isPending: isSectionPending,
    error: SectionError,
    data: sectionData,
    refetch: refetchSectionData,
  } = useQuery({
    queryKey: ["productionsection"],
    queryFn: getProductSection,
  });

  const fileredSectionData = sectionData?.filter(
    (section) => section.DEPARTMENT === "PRODUCTION"
  );

  const {
    isPending: isItemDataPending,
    error: isItemDataError,
    data: itemDataQuery,
  } = useQuery({
    queryKey: ["item"],
    queryFn: getItemData,
  });

  const Row = ({ index, style, data }) => (
    <div
      style={style}
      className={`grid grid-flow-col auto-cols-max text-xs gap-2 cursor-pointer hover:bg-gray-100 ${
        index % 2 !== 0 ? "bg-gray-50" : ""
      }`}
      onClick={async () => {
        const {
          ITEMID: ID,
          PRICE,
          itemVariations,
          ...others
        } = await getPurchaseDeliveryDetail(data[index].ID);

        if (itemVariations.length === 0) {
          alert(`Please select variation unit for "${others.NAMEENG}" item. `);
        } else {
          dispatch(
            addItemToSection({
              sectionActive: currentSection,
              item: { ID, ...others },
            })
          );
        }
      }}
    >
      <div className="w-[50px] text-center">{data[index].ID}</div>
      <div className="w-[80px]">{data[index].CODE}</div>
      <div>{data[index].NAMEENG}</div>
    </div>
  );

  const filteredData = itemDataQuery?.filter((item) =>
    item.NAMEENG.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatNumberWithCommas = (number) => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  console.log(selectedProduct);

  return (
    <div>
      <h1 className="text-xl font-bold">New Standard Consumption Product</h1>
      <div className="mt-6">
        <h2 className="text-xl">Selected Product:</h2>
        {selectedProduct.ID ? (
          <div className="mt-2 flex space-x-2 text-xs">
            <p>
              ID:{" "}
              <span className="bg-orange-400 px-4 py-1 rounded-full text-white">
                {selectedProduct.ID}
              </span>
            </p>
            <p>
              Product Name:{" "}
              <span className="bg-green-400 px-4 py-1 rounded-full text-white">
                {selectedProduct.PRODUCTNAME}
              </span>
            </p>
          </div>
        ) : (
          <p>No product selected</p>
        )}
      </div>
      <Separator className="mt-4" />

      {/* tab section area */}
      <div className="mt-4">
        <Tabs defaultValue="supplier" className="max-w-full">
          <TabsList>
            {selectedProduct.sections && selectedProduct.sections.length > 0
              ? selectedProduct.sections.map((section, index) => (
                  <TabsTrigger
                    className="text-xs"
                    key={section.ID}
                    value={section.DESCRIPTION}
                    onClick={() => {
                      setCurrentSection(index);
                    }}
                  >
                    {section.DESCRIPTION}
                  </TabsTrigger>
                ))
              : null}
            <div
              className="px-4 cursor-pointer underline"
              onClick={handleFrmSectionModal}
            >
              <span className="flex">
                <Plus className="w-4 h-4" /> Add Section
              </span>
            </div>
          </TabsList>
          {selectedProduct.sections.map((section, index) => (
            <TabsContent key={section.ID} value={section.DESCRIPTION}>
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
                    {selectedProduct.sections[currentSection]?.ITEMS?.map(
                      (item, index) => (
                        <tr
                          key={`${currentSection}-${index}`}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            index % 2 !== 0 ? "bg-gray-100" : ""
                          }`}
                        >
                          <td className="px-4 py-1 border border-gray-300">
                            {item.ITEMCODE}
                          </td>
                          <td className="px-4 py-1 border border-gray-300">
                            {item.NAMEENG}
                          </td>
                          <td className="px-4 py-1 border border-gray-300">
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
                                  updateItemQty({
                                    currentSection,
                                    items: { itemId: item.ID, value: newQty },
                                  })
                                );
                              }}
                            />
                          </td>
                          <td className="px-4 py-1 border border-gray-300">
                            {item.CODE}
                          </td>
                          <td className="px-4 py-1 border border-gray-300"></td>
                          <td className="px-4 py-1 border border-gray-300">
                            <CircleX
                              className="cursor-pointer m-auto"
                              height={20}
                              width={20}
                              color="#fb8500"
                              onClick={() => {
                                dispatch(
                                  removeItemSection({
                                    currentSection,
                                    selectedId: item.ID,
                                  })
                                );
                              }}
                            />
                          </td>
                        </tr>
                      )
                    )}
                    <tr>
                      <td className="px-4 py-1 border border-gray-300 font-bold text-center">
                        <p
                          className="bg-gray-700 inline-block text-white px-2 rounded-full cursor-pointer"
                          onClick={() => {
                            setFrmItem(true);
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
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* dialog section */}
      <div>
        <Dialog open={frmSection}>
          <DialogContent className="w-96 overflow-hidden">
            <DialogHeader>
              <DialogTitle className="font-normal flex  items-center justify-between">
                <span>Section for product:</span>

                <span className="bg-green-400 px-4 py-1 rounded-full text-white text-sm">
                  {selectedProduct.PRODUCTNAME}
                </span>
              </DialogTitle>

              <DialogDescription></DialogDescription>
            </DialogHeader>

            <div className="table-container-receiving">
              <table className="min-w-full table-fixed-header text-[12px]">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border border-gray-300 w-[80px]">
                      ID
                    </th>
                    <th className="px-4 py-2 border border-gray-300 w-[150px]">
                      CODE
                    </th>

                    <th className="px-4 py-2 border border-gray-300 w-[150px]">
                      DESCRIPTION
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white text-[10px]">
                  {fileredSectionData &&
                    fileredSectionData.map((pd, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-100 cursor-pointer ${
                          index % 2 !== 0 ? "bg-gray-50" : ""
                        }`}
                        onClick={() => {
                          dispatch(
                            setSelectedSection({
                              SECTIONID: pd.ID,
                              DESCRIPTION: pd.DESCRIPTION,
                              ITEMS: [],
                            })
                          );

                          handleFrmSectionModal();
                        }}
                      >
                        <td className="px-4 py-2 border border-gray-300 text-center">
                          {pd.ID}
                        </td>
                        <td className="px-4 py-1 border border-gray-300 font-bold">
                          {pd.CODE}
                        </td>

                        <td className="px-4 py-1 border border-gray-300 ">
                          {pd.DESCRIPTION}
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
                    onClick={handleFrmSectionModal}
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

      {/* dialog item */}
      <div>
        <Dialog open={frmItem}>
          <DialogContent className="max-w-[800px] h-[70%] overflow-y-scroll">
            <div className="relative">
              <div className="flex items-center gap-2">
                <div>
                  <h1 className="text-xl font-bold">ITEM LIST</h1>
                </div>
                <div className="text-xs cursor-pointer">
                  <div
                    className="flex items-center relative"
                    onClick={() => {
                      setFrmItem(false);
                    }}
                  >
                    <div>
                      <ShoppingBasket />
                    </div>
                    <div>
                      <HoverCard openDelay={100}>
                        <HoverCardTrigger>
                          <p className="bg-red-500 text-white px-1 py-1 rounded-full w-4 h-4 flex items-center justify-center absolute -top-1 -right-3 text-[11px]">
                            {
                              selectedProduct.sections[currentSection]?.ITEMS
                                ?.length
                            }
                          </p>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          View your item basket.
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="mt-4">
                <div className="text-xs">
                  <div className="flex gap-4">
                    {/* right side */}
                    <div className="w-1/2 mr-4">
                      <div className="mb-2 flex items-center gap-2">
                        <label
                          htmlFor="search"
                          className="block text-gray-700 "
                        >
                          SEARCH:
                        </label>
                        <input
                          placeholder="Search product name..."
                          type="text"
                          id="search"
                          name="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full p-1 px-2 border border-gray-500 rounded-full  uppercase "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LIST TABLE */}
              <div>
                <div className="grid grid-flow-col auto-cols-max text-xs gap-2 bg-gray-200 py-1 font-semibold">
                  <div className="w-[50px]">
                    <p className="ml-2">ID</p>
                  </div>
                  <div className="w-[80px]">
                    <p className="">CODE</p>
                  </div>
                  <div>
                    <p className="">MATERIAL</p>
                  </div>
                </div>
                <List
                  height={420}
                  itemCount={filteredData?.length}
                  itemSize={20}
                  width={750}
                  itemData={filteredData}
                >
                  {Row}
                </List>
              </div>
              {/* LIST TABLE END */}

              <div></div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* action button  */}
      <div>
        {/* BUTTON */}
        <div className="text-xs flex gap-1 mt-6 font-semibold">
          <div>
            <button
              type="button"
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
                dispatch(clearSelectedProduct());
                navigate("/production");
              }}
            >
              Close
            </button>
          </div>
        </div>
        {/* BUTTON END */}
      </div>
    </div>
  );
}

export default StandardConsumptionEntry;
