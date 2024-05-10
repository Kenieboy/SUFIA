import React from "react";

function ReusableTable({ data, properties }) {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  if (!properties || properties.length === 0) {
    properties = Object.keys(data[0]);
  }

  return (
    <div className=" border border-gray-300 rounded-lg shadow-md overflow-x-auto max-h-[680px]">
      <table className="table-auto">
        <thead className="sticky top-0 bg-gray-400 text-white">
          <tr>
            {properties.map((property) => (
              <th key={property}>{property}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {data.map((item, index) => (
            <tr
              key={item.ID}
              className={
                index % 2 === 1
                  ? "bg-gray-200 hover:bg-gray-100"
                  : "hover:bg-gray-100"
              }
            >
              {properties.map((property) => (
                <td key={property}>{item[property]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReusableTable;
