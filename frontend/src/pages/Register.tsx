import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { register } from "../services/api.ts"

const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const nav = useNavigate();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await register(username, password);
            alert('Registration successful!');
            nav("/login");
        } catch (error) {
            console.error('Registration failed:', error);
        }
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Create Account</h1>
          <p className="mt-2 text-sm text-slate-400">Start your journaling journey</p>
        </div>

        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-rose-100/50 border border-white/60 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-pink-400 via-rose-500 to-fuchsia-500" />

          <form onSubmit={submit} className="flex flex-col gap-5 p-8">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-rose-500 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-800 placeholder-slate-300 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-rose-500 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-800 placeholder-slate-300 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl text-sm font-semibold shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-300 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Create Account
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-rose-500 hover:text-rose-600 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register