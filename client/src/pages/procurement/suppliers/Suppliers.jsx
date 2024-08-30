import React, { useState } from "react";

// api request
import {
  getFirmSupplier,
  insertSupplierData,
  updateSupplierData,
} from "@/query/firmRequest";

// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";

// routing
import { Outlet } from "react-router-dom";

// supplier component to display table
import ReusableTable from "@/custom-components/table/ReusableTable";

// shadcn component
import { Button } from "@/components/ui/button";

// icons
import { CirclePlus, PlusCircle } from "lucide-react";

// supplier reusable add, edit form
import SupplierAddEditDialog from "./SupplierAddEditDialog";

function Supplier() {
  // add edit modal
  const [showModal, setShowModal] = useState(false);
  const [component, setComponent] = useState("supplier");

  // fetching supplier data
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["supplier"],
    queryFn: getFirmSupplier,
    staleTime: Infinity,
  });

  // insert supplier data
  const mutationInsertData = useMutation({
    mutationFn: insertSupplierData,
    onSuccess: () => {
      console.log("success insert");
      refetch();
    },
  });

  // edit supplier data
  const mutationUpdateData = useMutation({
    mutationFn: updateSupplierData,
    onSuccess: () => {
      console.log("success Edit");
      refetch();
    },
  });

  //triger add dialog
  const handleAddBtn = () => {
    setShowModal((prevState) => !prevState);
  };

  return (
    <div>
      <div className="mb-6">
        {/* button crud operation here */}
        <div>
          {/* Add/Edit form here */}
          {showModal && (
            <SupplierAddEditDialog
              mode={showModal}
              onClose={handleAddBtn}
              mutate={mutationInsertData.mutate}
            />
          )}
        </div>
        <div className="flex gap-2">
          <div>
            {/* <CustomerAddDialog mutate={mutation.mutate} /> */}
            {/* <Button
              className="flex gap-2 bg-green-500 hover:bg-green-400 px-8"
              onClick={handleAddBtn}
            >
              <PlusCircle />
              Add
            </Button> */}

            <button
              className="bg-green-500 hover:bg-green-400 flex gap-1 items-center text-xs px-4 py-1 text-white rounded-full"
              type="button"
              onClick={handleAddBtn}
            >
              {/* <Plus /> */}
              <CirclePlus width={20} height={20} />
              New
            </button>
          </div>

          {/* <Button className="flex gap-2">
            <Pencil />
            Edit
          </Button> */}
        </div>
      </div>
      <div>
        <div>
          {/* TABLE HERE */}

          <ReusableTable
            data={data}
            properties={[
              "CODE",
              "NAME",
              "REMARK",
              "ADDRESS1",
              "ADDRESS2",
              "COUNTRY",
            ]}
            mutate={mutationUpdateData.mutate}
            component={component}
          />

          {/* TABLE */}

          {/* <div className="table-container-supplier w-[1380px]">
            <table className="min-w-full table-fixed-header text-[12px]">
              <thead>
                <tr>
                  <th className="px-4 py-2 border border-gray-300 w-[80px]">
                    CODE
                  </th>
                  <th className="px-4 py-2 border border-gray-300 w-[50px]">
                    NAME
                  </th>
                  <th className="px-4 py-2 border border-gray-300 w-[50px]">
                    REMARK
                  </th>
                  <th className="px-4 py-2 border border-gray-300 w-[150px]">
                    ADDRESS1
                  </th>
                  <th className="px-4 py-2 border border-gray-300 w-[150px]">
                    ADDRESS2
                  </th>
                  <th className="px-4 py-2 border border-gray-300 w-[50px]">
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
                    >
                      <td className="px-4 py-2 border border-gray-300 text-left">
                        {item.CODE}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-left">
                        {item.NAME}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-left">
                        {item.REMARK}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-left">
                        {item.ADDRESS1}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-left">
                        {item.ADDRESS2}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-left">
                        {item.COUNTRY}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div> */}

          {/* TABLE END */}
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Supplier;
