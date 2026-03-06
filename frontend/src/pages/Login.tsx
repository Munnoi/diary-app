import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api.ts";
import { useEntry } from "../context/EntryContext.tsx";

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { refreshEntries } = useEntry();
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      await refreshEntries();
      nav("/");
    } catch (err) {
        console.error("Login failed:", err);
        setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to your diary</p>
        </div>

        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-rose-100/50 border border-white/60 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-pink-400 via-rose-500 to-fuchsia-500" />

          <form onSubmit={submit} className="flex flex-col gap-5 p-8">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-rose-500 mb-2">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-800 placeholder-slate-300 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-rose-500 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-800 placeholder-slate-300 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl text-sm font-semibold shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-300 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Sign In
            </button>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-rose-500 hover:text-rose-600 transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
