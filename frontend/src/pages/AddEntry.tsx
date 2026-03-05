import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const AddEntry = () => {
  const [title, setTitle] = useState<string>("");
  const [entry, setEntry] = useState<string>("");

  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  useEffect(() => {
    const loadOldValues = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/entries/${id}/`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch entry details");
        }
        const data = await response.json();
        setTitle(data.title);
        setEntry(data.content);
      } catch (err) {
        console.error(err);
        throw err;
      }
    };
    if (isEditMode) {
      loadOldValues();
      console.log(title, entry);
    }
  }, [id, isEditMode]);

  const addEntryHandler = async () => {
    try {
      if (isEditMode) {
        const response = await fetch(
          `http://localhost:8000/api/entries/edit/${id}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              content: entry,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to update entry");
        }
        // setTitle("");
        // setEntry("");

        alert("Entry updated successfully!");
      } else {
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
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="flex items-center justify-center py-10">
      <Link
        to="/"
        className="text-blue-500 hover:text-blue-700 hover:cursor-pointer"
      >
        Back to Home
      </Link>
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
