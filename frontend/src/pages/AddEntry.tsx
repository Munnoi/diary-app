import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../services/api.ts";

const AddEntry = () => {
  const [title, setTitle] = useState<string>("");
  const [entry, setEntry] = useState<string>("");

  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      throw new Error("No access token");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const loadOldValues = async () => {
      try {
        const response = await apiFetch(`/entries/${id}/`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error("Failed to fetch entry details");
        const data = await response.json();
        setTitle(data.title ?? "");
        setEntry(data.content ?? "");
      } catch (err) {
        console.error(err);
      }
    };

    if (isEditMode) loadOldValues();
  }, [id, isEditMode]);

  const addEntryHandler = async () => {
    try {
      const headers = getAuthHeaders();

      const response = await apiFetch(
        isEditMode ? `/entries/${id}/` : "/entries/",
        {
          method: isEditMode ? "PUT" : "POST",
          headers,
          body: JSON.stringify({ title, content: entry }),
        },
      );

      if (!response.ok) {
        console.log(response.status, await response.text());
        throw new Error(`Request failed: ${response.status}`);
      }
      alert(
        isEditMode
          ? "Entry updated successfully!"
          : "Entry added successfully!",
      );
    } catch (err) {
      console.error(err);
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
