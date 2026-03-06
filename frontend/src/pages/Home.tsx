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
    <div className="flex flex-col items-center gap-20 py-10">
      <div>
        <h1 className="text-4xl font-bold text-center">
          Welcome to Your Diary {user ? `, ${user}` : ""}!
        </h1>
        <p className="text-center mt-4 text-lg">
          Your personal space to jot down thoughts, feelings, and experiences.
        </p>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/add-entry")}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition duration-300"
          >
            Start Writing
          </button>
        </div>
      </div>
      <div>
        {entries.map((entry, index) => (
          <Link to={`/entry-detail/${entry.id}`} key={index}>
            <div className="max-w-lg bg-gray-100 p-4 rounded shadow mt-4">
              <h2 className="text-xl font-bold mb-2">{entry.title}</h2>
              <p>{entry.content.slice(0, 50)}...</p>
            </div>
          </Link>
        ))}
      </div>
      <div>
        <button
          onClick={logoutHandler}
          className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
        <button onClick={deleteAccountHandler} className="bg-red-700 text-white px-6 py-3 rounded hover:bg-red-800 transition duration-300 ml-4
        ">Delete account</button>
      </div>
    </div>
  );
};

export default Home;
