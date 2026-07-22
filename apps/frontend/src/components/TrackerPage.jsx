import { useEffect, useState } from "react";
import { fetchEntries, updateEntry, deleteEntry } from "../api/omnitrack.js";
import EntryCard from "./EntryCard.jsx";
import EntryForm from "./EntryForm.jsx";
import EntryDetail from "./EntryDetail.jsx";

export default function TrackerPage({ user }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ type: "", status: "", search: "", sort: "newest" });

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchEntries(user.id, filters)
      .then(setEntries)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.id, filters]);

  function replaceEntry(updated) {
    setEntries((current) =>
      current.map((e) => (e.id === updated.id ? { ...e, ...updated } : e))
    );
  }

  async function handleIncrement(entry) {
    try {
      replaceEntry(await updateEntry(entry.id, { progress: entry.progress + 1 }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handlePrestige(entry) {
    try {
      replaceEntry(await updateEntry(entry.id, { prestige: true }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(entry) {
    if (!window.confirm(`Remove "${entry.title}" from your tracker?`)) return;
    try {
      await deleteEntry(entry.id);
      setEntries((current) => current.filter((e) => e.id !== entry.id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSave(changes) {
    try {
      replaceEntry(await updateEntry(editing.id, changes));
      setEditing(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    setFilters((f) => ({ ...f, search: searchText }));
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 min-w-48">
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search your tracker..."
            className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-violet-500 outline-none rounded-lg px-4 py-2 placeholder-zinc-500"
          />
          <button type="submit" className="bg-zinc-800 hover:bg-zinc-700 rounded-lg px-4 py-2 text-sm">
            Go
          </button>
        </form>

        <select
          value={filters.type}
          onChange={(event) => setFilters((f) => ({ ...f, type: event.target.value }))}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All types</option>
          <option value="anime">Anime</option>
          <option value="manga">Manga</option>
        </select>

        <select
          value={filters.status}
          onChange={(event) => setFilters((f) => ({ ...f, status: event.target.value }))}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="plan_to_watch">Plan to watch</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filters.sort}
          onChange={(event) => setFilters((f) => ({ ...f, sort: event.target.value }))}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>

      {loading && <p className="text-zinc-400 py-4">Loading your tracker...</p>}
      {error && <p className="text-red-400 py-2">{error}</p>}

      {!loading && !error && entries.length === 0 && (
        <div className="py-12 text-center text-zinc-400">
          <p className="text-lg">Nothing here.</p>
          <p className="text-sm mt-1">Try different filters, or add series from Search.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onIncrement={handleIncrement}
            onEdit={setEditing}
            onDelete={handleDelete}
            onPrestige={handlePrestige}
            onView={(e) => setViewingId(e.id)}
          />
        ))}
      </div>

      {editing && (
        <EntryForm entry={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
      )}

      {viewingId && (
        <EntryDetail entryId={viewingId} onClose={() => setViewingId(null)} />
      )}
    </div>
  );
}import { useEffect, useState } from "react";
import { fetchEntries, updateEntry, deleteEntry } from "../api/omnitrack.js";
import EntryCard from "./EntryCard.jsx";
import EntryForm from "./EntryForm.jsx";
import EntryDetail from "./EntryDetail.jsx";

export default function TrackerPage({ user }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ type: "", status: "", search: "", sort: "newest" });

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchEntries(user.id, filters)
      .then(setEntries)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.id, filters]);

  function replaceEntry(updated) {
    setEntries((current) =>
      current.map((e) => (e.id === updated.id ? { ...e, ...updated } : e))
    );
  }

  async function handleIncrement(entry) {
    try {
      replaceEntry(await updateEntry(entry.id, { progress: entry.progress + 1 }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handlePrestige(entry) {
    try {
      replaceEntry(await updateEntry(entry.id, { prestige: true }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(entry) {
    if (!window.confirm(`Remove "${entry.title}" from your tracker?`)) return;
    try {
      await deleteEntry(entry.id);
      setEntries((current) => current.filter((e) => e.id !== entry.id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSave(changes) {
    try {
      replaceEntry(await updateEntry(editing.id, changes));
      setEditing(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    setFilters((f) => ({ ...f, search: searchText }));
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 min-w-48">
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search your tracker..."
            className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-violet-500 outline-none rounded-lg px-4 py-2 placeholder-zinc-500"
          />
          <button type="submit" className="bg-zinc-800 hover:bg-zinc-700 rounded-lg px-4 py-2 text-sm">
            Go
          </button>
        </form>

        <select
          value={filters.type}
          onChange={(event) => setFilters((f) => ({ ...f, type: event.target.value }))}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All types</option>
          <option value="anime">Anime</option>
          <option value="manga">Manga</option>
        </select>

        <select
          value={filters.status}
          onChange={(event) => setFilters((f) => ({ ...f, status: event.target.value }))}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="plan_to_watch">Plan to watch</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filters.sort}
          onChange={(event) => setFilters((f) => ({ ...f, sort: event.target.value }))}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>

      {loading && <p className="text-zinc-400 py-4">Loading your tracker...</p>}
      {error && <p className="text-red-400 py-2">{error}</p>}

      {!loading && !error && entries.length === 0 && (
        <div className="py-12 text-center text-zinc-400">
          <p className="text-lg">Nothing here.</p>
          <p className="text-sm mt-1">Try different filters, or add series from Search.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onIncrement={handleIncrement}
            onEdit={setEditing}
            onDelete={handleDelete}
            onPrestige={handlePrestige}
            onView={(e) => setViewingId(e.id)}
          />
        ))}
      </div>

      {editing && (
        <EntryForm entry={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
      )}

      {viewingId && (
        <EntryDetail entryId={viewingId} onClose={() => setViewingId(null)} />
      )}
    </div>
  );
}