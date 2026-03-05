import { createContext, useContext } from "react";
import type { DiaryEntry } from "../constants/types";

export const EntryContext = createContext({
  entries: [] as DiaryEntry[],
});

export const useEntry = () => {
  const context = useContext(EntryContext);
  if (context === undefined) {
    throw new Error("useEntry must be used within an EntryProvider");
  }
  return context;
};
