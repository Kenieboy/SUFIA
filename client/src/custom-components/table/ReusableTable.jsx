// customer reusable add, edit form
import CustomerAddEditDialog from "@/pages/setting/customers/CustomerAddEditDialog";
import SupplierAddEditDialog from "@/pages/setting/suppliers/SupplierAddEditDialog";

// react state
import { useState } from "react";

function ReusableTable({ data, properties, mutate, component }) {
  const [showModal, setShowModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  if (!properties || properties.length === 0) {
    properties = Object.keys(data[0]);
  }

  // trigger Edit event
  const handleEditEvent = (item) => {
    setSelectedItem(item);
    setShowModal((prevState) => !prevState);
  };

  const AddEditDialog =
    component === "supplier" ? SupplierAddEditDialog : CustomerAddEditDialog;

  return (
    <div>
      <div>
        {/* ======= Add Edit ======= */}
        {showModal && (
          <AddEditDialog
            mode={showModal}
            onClose={handleEditEvent}
            mutate={mutate}
            action={`edit`}
            selectedItem={selectedItem}
          />
        )}
        {/* ======== Add Edit end ======== */}
      </div>
      <div className=" border border-gray-300 overflow-x-auto max-h-[640px]">
        <table className="table-auto">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-gray-300 text-black text-xs">
              {properties.map((property) => (
                <th key={property} className="px-4 py-2">
                  {property}
                </th>
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
                onDoubleClick={() => handleEditEvent(item)}
              >
                {properties.map((property) => (
                  <td key={property}>{item[property]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReusableTable;
