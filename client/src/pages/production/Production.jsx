import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function Production() {
  const [modalState, setModalState] = useState(false);

  const handleModalStateAction = () => {
    setModalState((prev) => !prev);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Production</h1>

        {/* <Link to="/newproduction">New PCS</Link>
        <Link to="/newdailyconsumption">New PCS</Link> */}
      </div>

      <div className="space-x-2">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-400"
          onClick={handleModalStateAction}
        >
          Create Standard Consuption
        </button>
        <button>Daily Standard Consuption</button>
      </div>

      <Dialog open={modalState}>
        {/* max-w-[800px] h-[70%] overflow-y-scroll */}
        <DialogContent className="">
          <div>
            <h1 className="text-xl font-bold">PRODUCT LIST</h1>
          </div>

          <div>
            {/* BUTTON */}
            <div className="text-xs flex gap-1 mt-6 font-semibold">
              <div>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded-full"
                  onClick={handleModalStateAction}
                >
                  Close
                </button>
              </div>
            </div>
            {/* BUTTON END */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Production;
