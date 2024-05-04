import React from "react";
import { Outlet } from "react-router-dom";

function Customers() {
  return (
    <div>
      <div>Customer</div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Customers;
