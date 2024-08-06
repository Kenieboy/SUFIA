import React from "react";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";
import { getFirmCustomer } from "@/query/firmRequest";

function Customer() {
  // fetching customer data
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["customer"],
    queryFn: getFirmCustomer,
    staleTime: Infinity,
  });

  return (
    <div>
      <div className="mb-4">
        <Button
          className="bg-green-500 hover:bg-green-400 flex gap-1 text-xs"
          type="button"
          onClick={() => {
            setModalState({ isVisible: true });
          }}
        >
          {/* <Plus /> */}
          <CirclePlus width={20} height={20} />
          New
        </Button>
      </div>

      <div className="table-container-receiving-report mt-4">
        <table className="min-w-full table-fixed-header text-[12px]">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300 w-[100px]">
                CODE
              </th>
              <th className="px-4 py-2 border border-gray-300 w-[200px]">
                NAME
              </th>
              <th className="px-4 py-2 border border-gray-300 w-[300px]">
                REMARKS
              </th>
              <th className="px-4 py-2 border border-gray-300 w-[150px]">
                ADDRESS1
              </th>
              <th className="px-4 py-2 border border-gray-300 w-[150px]">
                ADDRESS2
              </th>
              <th className="px-4 py-2 border border-gray-300 w-[100px]">
                COUNTRY
              </th>
            </tr>
          </thead>
          <tbody className="bg-white text-[10px]">
            {data &&
              data.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-100 cursor-pointer ${
                    index % 2 !== 0 ? "bg-gray-50" : ""
                  }`}
                  onClick={() => {
                    console.log(item.ID);
                  }}
                >
                  <td className="px-4 py-1 border border-gray-300 ">
                    {item.CODE}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 text-left">
                    {item.NAME}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 font-bold">
                    {item.REMARK}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 font-bold">
                    {item.ADDRESS1}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 font-bold">
                    {item.ADDRESS2}
                  </td>
                  <td className="px-4 py-1 border border-gray-300 font-bold">
                    {item.COUNTRY}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customer;
