import React, { useState } from "react";
import { getFirmCustomer } from "@/query/firmRequest";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import ReusableTable from "@/custom-components/table/ReusableTable";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { insertCustomerData } from "@/query/firmRequest";
import AddEditDialog from "./AddEditDialog";

function Customers() {
  // add edit modal
  const [showModal, setShowModal] = useState(false);

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
      console.log("success insert");
      refetch();
    },
  });

  // edit customer data
  const mutationEditData = useMutation({
    mutationFn: (data) => {
      console.log(`edit customer data: ${data.ID} , ${data.CODE}`);
    },
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
            <AddEditDialog
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
              className="flex gap-2 bg-green-500 hover:bg-green-400"
              onClick={handleAddBtn}
            >
              <PlusCircle />
              Add
            </Button>
          </div>

          <Button className="flex gap-2">
            <Pencil />
            Edit
          </Button>
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
              mutate={mutationEditData.mutate}
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
