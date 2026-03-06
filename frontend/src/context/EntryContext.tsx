import React, { createContext, useContext, useEffect, useState } from "react";
import type { DiaryEntry } from "../constants/types";
import { apiFetch } from "../services/api.ts";

type EntryContextType = {
  entries: DiaryEntry[],
  setEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>,
  refreshEntries: (filters?: EntryFilters) => Promise<void>,
  count: number,
  next: string | null,
  previous: string | null,
};

type EntryFilters = {
  q?: string;
  sort?: string;
  period?: "week" | "month" | "all";
  page?: number;
};

export const EntryContext = createContext<EntryContextType | undefined>(undefined);

export const EntryProvider = ({ children }: { children: React.ReactNode }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [count, setCount] = useState<number>(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

  const refreshEntries = async (filters: EntryFilters = {}) => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        setEntries([]);
        return;
      }
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.q) params.append("q", filters.q);
      if (filters.sort) params.append("sort", filters.sort);
      if (filters.period) params.append("period", filters.period);

      const path = params.toString() ? `/entries/?${params.toString()}` : "/entries/";
      const response = await apiFetch(path);
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setEntries([]);
        }
        throw new Error("Failed to fetch entries");
      }
      const data = await response.json();
      if (data && typeof data === "object" && "results" in data) {
        setEntries(data.results);
        setCount(data.count ?? 0);
        setNext(data.next ?? null);
        setPrevious(data.previous ?? null);
      } else if (Array.isArray(data)) {
        setEntries(data);
        setCount(data.length);
        setNext(null);
        setPrevious(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshEntries();
  }, []);

  return (
    <EntryContext.Provider value={{ entries, setEntries, refreshEntries, count, next, previous }}>
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
