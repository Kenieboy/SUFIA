import React from "react";

//shadcn components

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

function CustomerTable({ data }) {
  console.log(data);
  return (
    <Table className="text-xs h-[800px]">
      <TableCaption>A lists of customers.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">CODE</TableHead>
          <TableHead>NAME</TableHead>
          <TableHead>REMARKS</TableHead>
          <TableHead>ADDRESS 1</TableHead>
          <TableHead>ADDRESS 2</TableHead>
          <TableHead>COLLECTION</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow> */}

        {data.map((item, i) => (
          <TableRow key={item.ID} className={i % 2 === 1 ? "bg-gray-200" : ""}>
            <TableCell>{item.CODE}</TableCell>
            <TableCell>{item.NAME}</TableCell>
            <TableCell className="w-[50px]">{item.REMARK}</TableCell>
            <TableCell>{item.ADDRESS1}</TableCell>
            <TableCell>{item.ADDRESS2}</TableCell>
            <TableCell>{item.COLLECTIONMETHODID}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default CustomerTable;
