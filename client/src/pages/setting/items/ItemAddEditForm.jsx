import React from "react";

// shadcn component
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useDispatch, useSelector } from "react-redux";

function ItemAddEditForm({ fmMode, fnClose }) {
  const { itemUnit } = useSelector((state) => state.itemData);
  return (
    <Dialog open={fmMode}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            <Button onClick={fnClose}>Close</Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ItemAddEditForm;
