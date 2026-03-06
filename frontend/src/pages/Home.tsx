import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEntry } from "../context/EntryContext";
import { deleteAccount, getMe, logout } from "../services/api";

const Home = () => {
  const [user, setUser] = useState<string>("");
  const [q, setQ] = useState<string>("");
  const [sort, setSort] = useState("-updated_at");
  const [period, setPeriod] = useState<"week" | "month" | "all">("all");
  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();
  const { entries, setEntries, refreshEntries, count, next, previous } = useEntry();

  useEffect(() => {
    getMe()
      .then((user) => setUser(user.username))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [q, sort, period]);

  useEffect(() => {
    const t = setTimeout(() => {
      refreshEntries({ q, sort, period, page });
    }, 300);
    return () => clearTimeout(t);
  }, [q, sort, period, page]);

  const PAGE_SIZE = 5;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const logoutHandler = async () => {
    await logout();
    setEntries([]);
    navigate("/login");
  };

  const deleteAccountHandler = async () => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (!shouldDelete) return;
    try {
      await deleteAccount();
      setEntries([]);
      navigate("/register");
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Start Writing
          </button>
        </div>

        {/* Filters */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-rose-100/30 border border-white/60 p-5 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="Search entries..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-sm text-slate-600 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
              >
                <option value="-updated_at">Recently updated</option>
                <option value="-created_at">Newest first</option>
                <option value="created_at">Oldest first</option>
                <option value="title">Title A-Z</option>
                <option value="-title">Title Z-A</option>
              </select>
              <select
                value={period}
                onChange={(e) =>
                  setPeriod(e.target.value as "week" | "month" | "all")
                }
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-sm text-slate-600 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
              >
                <option value="all">All time</option>
                <option value="week">Past week</option>
                <option value="month">Past month</option>
              </select>
            </div>
          </div>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!previous}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 hover:bg-white/80 hover:text-rose-500"
            >
              &larr; Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                  p === page
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200"
                    : "text-slate-500 hover:bg-white/80 hover:text-rose-500"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={!next}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 hover:bg-white/80 hover:text-rose-500"
            >
              Next &rarr;
            </button>
          </div>
        )}

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
