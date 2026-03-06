import { useEntry } from "../context/EntryContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../services/api";

const formatDay = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString();
};

const EntryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const entries = useEntry()?.entries || [];
  const entry = entries.find((entry) => String(entry.id) === id);

  if (!entry) return <p>Entry not found</p>;

  const deleteEntryHandler = async () => {
    const shouldDelete = window.confirm("Delete this entry?");
    if (!shouldDelete) return;

    try {
      const response = await apiFetch(
        `/entries/${entry.id}/`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      alert("Entry deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Could not delete entry. Please try again.");
    }
  };

  const editEntryHandler = async () => {
    navigate(`/edit/${entry.id}`);
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

        <article className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-rose-100/50 border border-white/60 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-pink-400 via-rose-500 to-fuchsia-500" />

          <div className="p-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-rose-200 to-transparent" />
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
                {formatDay(entry.created_at)}
              </p>
              <div className="h-px flex-1 bg-gradient-to-l from-rose-200 to-transparent" />
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 text-center mb-8 leading-tight">
              {entry?.title}
            </h1>

            <div className="w-12 h-0.5 bg-rose-300 mx-auto mb-8 rounded-full" />

            <p className="text-lg leading-8 text-slate-600 whitespace-pre-wrap font-light">
              {entry?.content}
            </p>

            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <p className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-400" />
                <span className="font-medium text-slate-500">Created</span>{" "}
                {formatTime(entry.created_at)}
              </p>
              <p className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                <span className="font-medium text-slate-500">Updated</span>{" "}
                {formatTime(entry.updated_at)}
              </p>
            </div>
          </div>
        </article>

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={editEntryHandler}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-300 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Entry
          </button>
          <button
            onClick={deleteEntryHandler}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-500 px-4 py-3 rounded-xl hover:bg-red-50 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryDetail;
