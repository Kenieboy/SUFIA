import React from "react";

import { useQuery } from "@tanstack/react-query";
import { getFirmSupplier } from "@/query/firmRequest";
import ReusableTable from "@/custom-components/table/ReusableTable";

import CustomerAddDialog from "@/custom-components/customer/CustomerAddDialog";
import { Button } from "@/components/ui/button";

import { Pencil, Plug2, PlusCircle } from "lucide-react";

function Suppliers() {
  const { isPending, error, data } = useQuery({
    queryKey: ["supplier"],
    queryFn: getFirmSupplier,
  });

  return (
    <div>
      <div className="mb-6">
        {/* button crud operation here */}
        <div className="flex gap-2">
          <div>
            <CustomerAddDialog />
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
    </div>
  );
}

export default Suppliers;
