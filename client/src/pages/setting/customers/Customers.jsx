import React, { useState, useEffect } from "react";
import { getFirmCustomer } from "@/query/firmRequest";

import { useQuery } from "@tanstack/react-query";
import CustomerTable from "./CustomerTable";
import { Outlet } from "react-router-dom";
import ReusableTable from "@/custom-components/table/ReusableTable";

function Customers() {
  const { isPending, error, data } = useQuery({
    queryKey: ["customer"],
    queryFn: getFirmCustomer,
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
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Customers;
