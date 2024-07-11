import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getItemData, getPurchaseDeliveryDetail } from "@/query/itemRequest";
import { useQuery } from "@tanstack/react-query";
import { FixedSizeList as List } from "react-window";
import { useDispatch, useSelector } from "react-redux";
import { addPDDItem } from "@/redux/purchaseDDSlice";
import { ShoppingBasket } from "lucide-react";

function WithdrawalItemList({ modalState, fnWIClose }) {
  const [searchQuery, setSearchQuery] = useState("");

  const { purchaseDeliveryDetail } = useSelector((state) => state?.pddData);

  const action = useDispatch();

  const {
    isPending: isItemDataPending,
    error: isItemDataError,
    data: itemDataQuery,
  } = useQuery({
    queryKey: ["item"],
    queryFn: getItemData,
  });

  if (isItemDataPending) {
    return <div>Loading...</div>;
  }

  if (isItemDataError) {
    return <div>Error loading data</div>;
  }

  const filteredData = itemDataQuery.filter((item) =>
    item.NAMEENG.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const Row = ({ index, style, data }) => (
    <div
      style={style}
      className={`grid grid-flow-col auto-cols-max text-xs gap-2 cursor-pointer hover:bg-gray-100 ${
        index % 2 !== 0 ? "bg-gray-50" : ""
      }`}
      onClick={async () => {
        const fetchItem = await getPurchaseDeliveryDetail(data[index].ID);
        action(addPDDItem(fetchItem));
      }}
    >
      <div className="w-[50px] text-center">{data[index].ID}</div>
      <div className="w-[80px]">{data[index].CODE}</div>
      <div>{data[index].NAMEENG}</div>
    </div>
  );

  return (
    <Dialog open={modalState}>
      <DialogContent className="max-w-[800px] h-[70%] overflow-y-scroll">
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">ITEM LIST</h1>
            </div>
            <div className="text-xs cursor-pointer">
              <div className="flex items-center">
                <ShoppingBasket />
                <p className="bg-red-500 text-white px-1 py-1 rounded-full w-4 h-4 flex items-center justify-center ">
                  {purchaseDeliveryDetail?.length}
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          <div className="mt-4">
            <div className="text-xs">
              <div className="flex gap-4">
                {/* right side */}
                <div className="w-1/4 mr-4">
                  <div className="mb-2">
                    <label htmlFor="search" className="block text-gray-700">
                      Search
                    </label>
                    <input
                      type="text"
                      id="search"
                      name="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-1 px-2 border border-gray-500 rounded-full text-red-500 uppercase font-bold"
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
              height={350}
              itemCount={filteredData.length}
              itemSize={20}
              width={750}
              itemData={filteredData}
            >
              {Row}
            </List>
          </div>
          {/* LIST TABLE END */}

          <div>
            {/* BUTTON */}
            <div className="text-xs flex gap-1 mt-6 font-semibold">
              <div>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded-full"
                  onClick={() => {
                    fnWIClose(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
            {/* BUTTON END */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawalItemList;
