import { useState } from "react";

export function useDialog(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onOpenChange: (open: boolean) => setIsOpen(open),
  };
}
