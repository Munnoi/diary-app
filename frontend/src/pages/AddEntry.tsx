import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../services/api.ts";

const AddEntry = () => {
  const [title, setTitle] = useState<string>("");
  const [entry, setEntry] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");

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
        setCreatedAt(data.createdAt ?? "");
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm text-slate-400 hover:text-rose-500 transition-colors mb-10"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-1">
            &larr;
          </span>
          Back to Home
        </Link>

        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-rose-100/50 border border-white/60 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-pink-400 via-rose-500 to-fuchsia-500" />

          <div className="p-10">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              {isEditMode ? "Edit Entry" : "New Entry"}
            </h1>
            <p className="text-sm text-slate-400 mb-8">
              {isEditMode
                ? "Update your thoughts below."
                : "What's on your mind today?"}
            </p>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-rose-500 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Give your entry a title..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-800 placeholder-slate-300 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-rose-500 mb-2">
                  Entry
                </label>
                <textarea
                  name="entry"
                  id="entry"
                  placeholder="Write your thoughts here..."
                  rows={14}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-800 placeholder-slate-300 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all resize-none leading-relaxed"
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                />
              </div>

              <button
                onClick={addEntryHandler}
                className="self-end inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-300 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                {isEditMode ? "Update Entry" : "Save Entry"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEntry;
