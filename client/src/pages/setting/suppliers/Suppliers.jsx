import React from "react";

import { useQuery } from "@tanstack/react-query";
import { getFirmSupplier } from "@/query/firmRequest";
import ReusableTable from "@/custom-components/table/ReusableTable";

function Suppliers() {
  const { isPending, error, data } = useQuery({
    queryKey: ["supplier"],
    queryFn: getFirmSupplier,
  });

  return (
    <div>
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
