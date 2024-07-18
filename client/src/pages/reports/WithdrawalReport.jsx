import React, { useState } from "react";

function WithdrawalReport() {
  const [startDate, setStartDate] = useState("2024-06-01");
  const [endDate, setEndDate] = useState("2024-06-30");
  return (
    <div>
      {" "}
      <div className="flex gap-4 mt-6">
        <label>
          Start Date:
          <input
            className="w-full p-1 border border-gray-500 rounded-full mt-2"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            className="w-full p-1 border border-gray-500 rounded-full mt-2"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

export default WithdrawalReport;
