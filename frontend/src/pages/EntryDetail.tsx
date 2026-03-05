import { useEntry } from "../context/EntryContext";
import { Link, useParams } from "react-router-dom";

const EntryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const entries = useEntry()?.entries || [];
  const entry = entries.find((entry) => String(entry.id) === id);

  if (!entry) return <p>Entry not found</p>;
  
  return (
    <div className="flex flex-col items-center gap-20 py-10">
      <Link
        to="/"
        className="text-blue-500 hover:text-blue-700 hover:cursor-pointer"
      >
        Back to Home
      </Link>
      <div className="max-w-5xl bg-gray-100 p-4 rounded shadow mt-4 text-center">
        <h2 className="text-xl font-bold mb-2">{entry?.title}</h2>
        <p className="text-lg text-left">
          {entry?.content}
        </p>
      </div>

      <div className="w-5xl flex items-center justify-between">
        <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition duration-300">
          Edit Entry
        </button>
        <button className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition duration-300">
          Delete Entry
        </button>
      </div>
    </div>
  );
};

export default EntryDetail;
