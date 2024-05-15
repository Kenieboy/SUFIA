import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function AnotherTestDialog({ mode = false, onClose }) {
  const [isOpen, setIsOpen] = useState(mode);

  const handleBackButton = () => {
    onClose();
  };
  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleBackButton}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AnotherTestDialog;
