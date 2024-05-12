import React, { useState, useEffect } from "react";
import { getFirmCustomer } from "@/query/firmRequest";

import { useQuery, useMutation } from "@tanstack/react-query";
import CustomerTable from "./CustomerTable";
import { Outlet } from "react-router-dom";
import ReusableTable from "@/custom-components/table/ReusableTable";
import { Button } from "@/components/ui/button";
import { Pencil, Plug2, PlusCircle } from "lucide-react";
import CustomerAddDialog from "@/custom-components/customer/CustomerAddDialog";

import { insertCustomerData } from "@/query/firmRequest";

function Customers() {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["customer"],
    queryFn: getFirmCustomer,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: insertCustomerData,
    onSuccess: () => {
      console.log("success insert");
      refetch();
    },
  });

  return (
    <div>
      <div className="mb-6">
        {/* button crud operation here */}
        <div className="flex gap-2">
          <div>
            <CustomerAddDialog mutate={mutation.mutate} />
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
