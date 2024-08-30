import React, { useState } from "react";

// api request
import {
  getFirmCustomer,
  insertCustomerData,
  updateCustomerData,
} from "@/query/firmRequest";

// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";

// routing
import { Outlet } from "react-router-dom";

// customer component to display table
import ReusableTable from "@/custom-components/table/ReusableTable";

// shadcn component
import { Button } from "@/components/ui/button";

// icons
import { CirclePlus, PlusCircle } from "lucide-react";

// customer reusable add, edit form
import CustomerAddEditDialog from "./CustomerAddEditDialog";

function Customers() {
  // add edit modal
  const [showModal, setShowModal] = useState(false);
  const [component, setComponent] = useState("customer");

  // fetching customer data
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["customer"],
    queryFn: getFirmCustomer,
    staleTime: Infinity,
  });

  // insert customer data
  const mutationInsertData = useMutation({
    mutationFn: insertCustomerData,
    onSuccess: () => {
      refetch();
    },
  });

  // edit customer data
  const mutationUpdateData = useMutation({
    mutationFn: updateCustomerData,
    onSuccess: () => {
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
            <CustomerAddEditDialog
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
        {isPending ? (
          <p>loading...</p>
        ) : (
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
          </div>
        )}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Customers;
