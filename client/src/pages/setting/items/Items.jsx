import React, { useState } from "react";

// data fetching tanstack component
import { useQuery, useMutation } from "@tanstack/react-query";

// routing
import { Outlet } from "react-router-dom";

// customer component to display table
import ReusableTable from "@/custom-components/table/ReusableTable";

// shadcn component
import { Button } from "@/components/ui/button";

// icons
import { PlusCircle } from "lucide-react";

// customer reusable add, edit form
import ItemAddEditDialog from "./ItemAddEditDialog";

// api request
import { getItemData } from "@/query/itemRequest";

function Items() {
  // add edit modal
  const [showModal, setShowModal] = useState(false);
  const [component, setComponent] = useState("items");

  // fetching items data
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["items"],
    queryFn: getItemData,
    staleTime: Infinity,
  });

  // ================================================== add edit operation =========
  // insert customer data
  const mutationInsertData = useMutation({
    mutationFn: () => {
      console.log("insert data...");
    },
    onSuccess: () => {
      console.log("success insert");
      refetch();
    },
  });

  // edit customer data
  const mutationUpdateData = useMutation({
    mutationFn: () => {
      console.log("edit data...");
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
            <ItemAddEditDialog
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
                "NAMEENG",
                "NAMEJP",
                "NOTE",
                "POPRICE",
                "UPDATED",
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

export default Items;
