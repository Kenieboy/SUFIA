import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// data fetching tanstack component
import { useQuery } from "@tanstack/react-query";
import { getProductItem } from "@/query/productionRequest";
import { useDispatch } from "react-redux";
import { setSelectedProduct } from "@/redux/standardConsumptionSlice";

function Production() {
  const [modalState, setModalState] = useState(false);

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
    queryFn: getProductItem, // Ensure you update the query function name if necessary
  });

  const handleModalStateAction = () => {
    setModalState((prev) => !prev);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Production</h1>

        {/* <Link to="/newproduction">New PCS</Link>
        <Link to="/newdailyconsumption">New PCS</Link> */}
      </div>

      <div className="space-x-2">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-400"
          onClick={handleModalStateAction}
        >
          Create Standard Consuption
        </button>
        <button>Daily Standard Consuption</button>
      </div>

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
                        console.log(
                          `Prodcut description: ${pd.ID}, ${pd.NAMEENG}`
                        );
                        dispatch(
                          setSelectedProduct({
                            PRODUCTITEMID: pd.ID,
                            PRODUCTNAME: pd.NAMEENG,
                          })
                        );
                        navigate("/newstandardconsumption");
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
