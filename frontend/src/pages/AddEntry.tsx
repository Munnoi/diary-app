import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AddEntry = () => {
  const [title, setTitle] = useState<string>("");
  const [entry, setEntry] = useState<string>("");

  useEffect(() => {}, []);

  const addEntryHandler = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/entries/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: entry,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add entry");
      }

      setTitle("");
      setEntry("");

      alert("Entry added successfully!");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="flex items-center justify-center py-10">
      <div className="flex flex-col gap-2 shadow-lg p-6 rounded bg-purple-300">
        <input
          type="text"
          placeholder="Title"
          className="p-4 border border-gray-200 outline-none rounded bg-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          name="entry"
          id="entry"
          placeholder="Write your entry here..."
          cols={80}
          rows={20}
          className="p-4 border border-gray-200 outline-none rounded bg-white"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        ></textarea>
        <button
          onClick={addEntryHandler}
          className="p-2 bg-green-400 rounded text-white hover:cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddEntry;
