import { useState } from "react";
import { getItemData } from "@/query/itemRequest";
import { useQuery } from "@tanstack/react-query";
import { FixedSizeList as List } from "react-window";

function Reports() {
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const {
    isLoading: isItemLoading,
    error: itemError,
    data: itemData,
    refetch: refetchItem,
  } = useQuery({
    queryKey: ["items"],
    queryFn: getItemData,
    onSuccess: (data) => {
      setFilteredData(data); // Initialize filteredData with itemData
    },
  });

  const handleSearchChange = (event) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);

    if (inputValue.trim() === "") {
      setFilteredData(itemData); // Reset filteredData to itemData when search input is empty
    } else {
      const filtered = itemData.filter((item) =>
        item.NAMEENG.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const Row = ({ index, style }) => (
    <tr
      key={`${filteredData[index].ID}`}
      style={{ ...style, height: "30px" }} // Override height here
      className={`${index % 2 === 0 ? "bg-gray-100" : ""}`}
      onClick={() => {
        console.log(filteredData[index].ID);
      }}
    >
      <td className="border border-gray-200 px-2 py-1 text-xs font-bold">
        {`${filteredData[index].NAMEENG}`}
      </td>
      <td className="border border-gray-200 px-2 py-1 text-xs text-gray-500">
        {filteredData[index].NAMEJP}
      </td>
    </tr>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="mb-4">
        <input
          id="search"
          name="search"
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search by NAMEENG"
          className="px-4 py-2 border border-gray-300 rounded-md mb-4"
        />
      </div>

      <div style={{ maxHeight: 700, overflowY: "auto" }}>
        <table className="table-auto w-full shadow-md border border-gray-300 rounded-md">
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr>
              <th className="border border-gray-300 px-2 py-1 w-[200px]">
                NAMEENG
              </th>
              <th className="border border-gray-300 px-2 py-1">NAMEJP</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <Row key={item.ID} index={index} style={{ height: "30px" }} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
