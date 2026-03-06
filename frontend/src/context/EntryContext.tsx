import React, { createContext, useContext, useEffect } from "react";
import type { DiaryEntry } from "../constants/types";
import { apiFetch } from "../services/api.ts";

type EntryContextType = {
  entries: DiaryEntry[],
  setEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>,
  refreshEntries: () => Promise<void>,
};

export const EntryContext = createContext<EntryContextType | undefined>(undefined);

export const EntryProvider = ({ children }: { children: React.ReactNode }) => {
  const [entries, setEntries] = React.useState<DiaryEntry[]>([]);

  const refreshEntries = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        setEntries([]);
        return;
      }
      const response = await apiFetch("/entries/");
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setEntries([]);
        }
        throw new Error("Failed to fetch entries");
      }
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshEntries();
  }, []);

  return (
    <EntryContext.Provider value={{ entries, setEntries, refreshEntries }}>
      {children}
    </EntryContext.Provider>
  )
};

export const useEntry = () => {
  const context = useContext(EntryContext);
  if (context === undefined) {
    throw new Error("useEntry must be used within an EntryProvider");
  }
  return context;
};
