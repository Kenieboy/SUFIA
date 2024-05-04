import React from "react";

import { useParams } from "react-router-dom";

function CustomerId() {
  const { customerId } = useParams();
  return <div>CustomerId: {customerId}</div>;
}

export default CustomerId;
