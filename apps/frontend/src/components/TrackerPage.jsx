import { useEffect, useState } from "react";
import { fetchEntries } from "../api/omnitrack.js";
import EntryCard from "./EntryCard.jsx";

export default function TrackerPage({ user }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchEntries(user.id)
      .then(setEntries)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) return <p className="text-zinc-400 p-8">Loading your tracker...</p>;
  if (error) return <p className="text-red-400 p-8">{error}</p>;

  if (entries.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <p className="text-lg">Nothing tracked yet.</p>
        <p className="text-sm mt-1">Head to Search and add your first series!</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}