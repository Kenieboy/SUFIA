import AddEditDialog from "@/pages/setting/customers/AddEditDialog";
import { useState } from "react";

function ReusableTable({ data, properties, mutate }) {
  const [showModal, setShowModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  console.log(selectedItem);

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

  return (
    <div>
      <div>
        {showModal && (
          <AddEditDialog
            mode={showModal}
            onClose={handleEditEvent}
            mutate={mutate}
            action={`edit`}
            selectedItem={selectedItem}
          />
        )}
      </div>
      <div className=" border border-gray-300 rounded-lg shadow-md overflow-x-auto max-h-[640px]">
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
