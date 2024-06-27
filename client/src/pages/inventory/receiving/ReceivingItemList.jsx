import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// tanstack data query component
import { useQuery } from "@tanstack/react-query";
import { getItemData, getPurchaseDeliveryDetail } from "@/query/itemRequest";
import { useDispatch } from "react-redux";
import { addPDDItem, fetchPurchaseDetailId } from "@/redux/purchaseDDSlice";

function ReceivingItemList({ modalState, fnRIClose }) {
  // item table properties
  const properties = ["CODE", "NAMEENG", "NAMEJP", ,];
  // fetching items data
  const {
    isLoading: isItemLoading,
    isPending: isItemPending,
    error: itemError,
    data: itemData,
    refetch: refetchItem,
  } = useQuery({
    queryKey: ["items"],
    queryFn: getItemData,
  });

  const dispatch = useDispatch();
  return (
    <Dialog open={modalState}>
      <DialogContent className="max-w-[1000px] h-[80%]">
        <DialogHeader>
          <DialogTitle>List of items</DialogTitle>
          {/* <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription> */}
        </DialogHeader>
        <div className="relative">
          <div>
            {/* TABLE ITEM AREA */}
            <div>
              {isItemLoading ? (
                <p>loading...</p>
              ) : (
                <div className="text-[10px] border border-gray-300 overflow-x-auto max-h-[550px]">
                  <table className="table-auto">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b border-gray-300 text-black text-xs">
                        {properties.map((property) => (
                          <th
                            key={property}
                            // className={`px-4 py-2 w-80 ${
                            //   property === "CODE" ? `w-60` : ``
                            // }`}
                          >
                            {property}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {itemData.map((item, index) => (
                        <tr
                          key={item.ID}
                          onClick={async () => {
                            console.log(item.ID);
                            // dispatch(fetchPurchaseDetailId(item.ID));
                            // fnRIClose(false);

                            const fetchItem = await getPurchaseDeliveryDetail(
                              item.ID
                            );

                            dispatch(addPDDItem(fetchItem));
                            fnRIClose(false);
                          }}
                        >
                          {properties.map((property) => (
                            <td className="p-4 cursor-pointer" key={property}>
                              {item[property]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {/* END TABLE ITEM AREA */}
          </div>

          <div className="absolute bottom-2 left-2">
            <Button
              className="bg-red-500 hover:bg-red-400"
              type="button"
              onClick={() => {
                fnRIClose(false);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReceivingItemList;
