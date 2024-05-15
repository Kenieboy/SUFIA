import { Button } from "@/components/ui/button";
import AnotherTestDialog from "@/custom-components/test/AnotherTestDialog";
import { useState } from "react";

function Reports() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    setIsDialogOpen((prevState) => !prevState);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Reports</h1>
      </div>

      <div>
        <Button onClick={handleClick}>Dialog Display</Button>
      </div>

      {isDialogOpen && (
        <AnotherTestDialog mode={isDialogOpen} onClose={handleClick} />
      )}
    </div>
  );
}

export default Reports;
