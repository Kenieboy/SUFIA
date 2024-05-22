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
import { PlusCircle } from "lucide-react";

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
            <Button
              className="flex gap-2 bg-green-500 hover:bg-green-400 px-8"
              onClick={handleAddBtn}
            >
              <PlusCircle />
              Add
            </Button>
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

export default Supplier;
