"use client";

import * as React from "react";
import { useQueryState, parseAsJson } from "nuqs";
import { createSearchParamsCache } from "nuqs/server";

interface DialogData {
  [key: string]: unknown;
}

interface DialogContextType {
  dialog: string | null;
  dialogData: DialogData | null;
  showDialog: (name: string, data?: DialogData) => void;
  hideDialog: () => void;
}

export const DialogContext = React.createContext<DialogContextType>({
  dialog: null,
  dialogData: null,
  showDialog: () => {},
  hideDialog: () => {},
});

export function useDialog() {
  return React.useContext(DialogContext);
}

// Create a cache to persist the search params
createSearchParamsCache({});

const dialogParser = (value: unknown): string => {
  if (typeof value === "string") return value;
  return "";
};

const dialogDataParser = (value: unknown): DialogData => {
  if (value && typeof value === "object") return value as DialogData;
  return {};
};

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useQueryState(
    "dialog",
    parseAsJson<string>(dialogParser).withDefault("")
  );

  const [dialogData, setDialogData] = useQueryState(
    "dialogData",
    parseAsJson<DialogData>(dialogDataParser).withDefault({})
  );

  const showDialog = React.useCallback(
    (name: string, data?: DialogData) => {
      void setDialog(name);
      if (data) void setDialogData(data);
    },
    [setDialog, setDialogData]
  );

  const hideDialog = React.useCallback(() => {
    void setDialog("");
    void setDialogData({});
  }, [setDialog, setDialogData]);

  const value = React.useMemo(
    () => ({
      dialog: dialog || null,
      dialogData: Object.keys(dialogData).length > 0 ? dialogData : null,
      showDialog,
      hideDialog,
    }),
    [dialog, dialogData, showDialog, hideDialog]
  );

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}
