import { useEntry } from "../context/EntryContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../services/api";

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
    <div className="flex flex-col items-center gap-20 py-10">
      <Link
        to="/"
        className="text-blue-500 hover:text-blue-700 hover:cursor-pointer"
      >
        Back to Home
      </Link>
      <div className="w-5xl bg-gray-100 p-4 rounded shadow mt-4 text-center">
        <h2 className="text-xl font-bold mb-2">{entry?.title}</h2>
        <p className="text-lg text-justify">{entry?.content}</p>
      </div>

      <div className="w-5xl flex items-center justify-between">
        <button onClick={editEntryHandler} className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition duration-300">
          Edit Entry
        </button>
        <button
          onClick={deleteEntryHandler}
          className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition duration-300"
        >
          Delete Entry
        </button>
      </div>
    </div>
  );
};

export default EntryDetail;
