import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import WithdrawalAddEditForm from "./WithdrawalAddEditForm";

function Withdrawal() {
  const [modalState, setModalState] = useState({
    isVisible: false,
    isEditMode: false,
  });

  const handleModalStateAction = () => {
    setModalState((prev) => !prev);
  };

  return (
    <div>
      <div className="mt-6">
        {modalState.isVisible && (
          <WithdrawalAddEditForm
            modalState={modalState}
            fnClose={handleModalStateAction}
          />
        )}

        <div className="p-2">
          <Button
            className="bg-green-500 hover:bg-green-400 flex gap-1"
            type="button"
            onClick={() => {
              setModalState({ isVisible: true });
            }}
          >
            <Plus />
            New
          </Button>
        </div>

        <div className="mt-6 relative overflow-hidden"></div>
      </div>
    </div>
  );
}

export default Withdrawal;
