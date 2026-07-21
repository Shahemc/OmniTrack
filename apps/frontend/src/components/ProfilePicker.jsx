import { useEffect, useState } from "react";
import { fetchUsers, createUser } from "../api/omnitrack.js";

export default function ProfilePicker({ onSelect }) {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    try {
      const newUser = await createUser(username.trim());
      onSelect(newUser);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center">
          Omni<span className="text-violet-500">Track</span>
        </h1>
        <p className="text-zinc-400 text-center mt-2 mb-8">
          Track your anime & manga. Prestige your favorites.
        </p>

        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">
          Who's watching?
        </h2>

        {loading && <p className="text-zinc-400">Loading profiles...</p>}

        {!loading && users.length === 0 && (
          <p className="text-zinc-500 mb-4">No profiles yet — create the first one below.</p>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelect(user)}
              className="bg-zinc-800 hover:bg-violet-600 transition-colors rounded-lg px-4 py-2 font-medium"
            >
              {user.username}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-sm font-semibold text-zinc-400 uppercase tracking-wide">
            New profile
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter a username"
              maxLength={30}
              className="mt-2 w-full bg-zinc-800 border border-zinc-700 focus:border-violet-500 outline-none rounded-lg px-4 py-2 text-white placeholder-zinc-500"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-500 transition-colors rounded-lg py-2 font-semibold"
          >
            Create profile
          </button>
        </form>

        {error && <p className="mt-4 text-red-400">{error}</p>}
      </div>
    </main>
  );
}