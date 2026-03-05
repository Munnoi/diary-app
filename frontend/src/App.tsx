import { Route, Routes } from "react-router-dom";
import AddEntry from "./pages/AddEntry.tsx";
import Home from "./pages/Home.tsx";
import EntryDetail from "./pages/EntryDetail.tsx";
import { useEffect, useState } from "react";
import { EntryContext } from "./context/EntryContext.tsx";
import type { DiaryEntry } from "./constants/types.ts";

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/entries/");
        if (!response.ok) {
          throw new Error("Failed to fetch entries");
        }
        const data = await response.json();
        setEntries(data);
      } catch (err) {
        console.error(err);
        throw err;
      }
    };
    fetchEntries();
  }, []);
  return (
    <EntryContext.Provider value={{entries}}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-entry" element={<AddEntry />} />
        <Route path="/entry-detail/:id" element={<EntryDetail />} />
      </Routes>
    </EntryContext.Provider>
  );
};

export default App;
