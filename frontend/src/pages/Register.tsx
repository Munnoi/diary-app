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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="p-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300"
          >
            Register
          </button>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register