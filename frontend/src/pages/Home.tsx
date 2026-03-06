import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEntry } from "../context/EntryContext";
import { deleteAccount, getMe, logout } from "../services/api";

const Home = () => {
  const [user, setUser] = useState<string>("");
  const navigate = useNavigate();
  const { entries, setEntries, refreshEntries } = useEntry();

  useEffect(() => {
    getMe()
      .then((user) => setUser(user.username))
      .catch(console.error);
    refreshEntries();
  }, []);

  const logoutHandler = async () => {
    await logout();
    setEntries([]);
    navigate("/login");
  };

  const deleteAccountHandler = async () => {
    const shouldDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!shouldDelete) return;
    try {
      await deleteAccount();
      setEntries([]);
      navigate("/register");
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
            Welcome back{user ? `, ${user}` : ""}
          </h1>
          <p className="mt-3 text-slate-400">
            Your personal space to jot down thoughts, feelings, and experiences.
          </p>
          <button
            onClick={() => navigate("/add-entry")}
            className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-300 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Start Writing
          </button>
        </div>

        {/* Entries */}
        <div className="flex flex-col gap-4">
          {entries.length === 0 && (
            <p className="text-center text-slate-300 text-sm py-10">
              No entries yet. Start writing your first one!
            </p>
          )}
          {entries.map((entry, index) => (
            <Link to={`/entry-detail/${entry.id}`} key={index}>
              <div className="group bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm shadow-rose-100/30 p-5 hover:shadow-md hover:shadow-rose-200/40 hover:-translate-y-0.5 transition-all">
                <h2 className="text-lg font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                  {entry.title}
                </h2>
                <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">
                  {entry.content.length > 100
                    ? entry.content.slice(0, 100) + "..."
                    : entry.content}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Account actions */}
        <div className="mt-16 pt-8 border-t border-rose-100 flex items-center justify-between">
          <button
            onClick={logoutHandler}
            className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
          >
            Log out
          </button>
          <button
            onClick={deleteAccountHandler}
            className="text-sm font-medium text-slate-400 hover:text-red-500 transition-colors"
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
