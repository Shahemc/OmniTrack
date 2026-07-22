import { useState } from "react";

export default function EntryForm({ entry, onSave, onCancel }) {
  const [progress, setProgress] = useState(entry.progress);
  const [status, setStatus] = useState(entry.status);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const p = Number(progress);

    if (!Number.isInteger(p) || p < 0) {
      setError("Progress must be 0 or more");
      return;
    }
    if (entry.totalUnits !== null && p > entry.totalUnits) {
      setError(`Progress cannot exceed ${entry.totalUnits}`);
      return;
    }

    onSave({ progress: p, status });
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl p-6 space-y-4"
      >
        <h2 className="font-bold text-lg truncate">Edit: {entry.title}</h2>

        <label className="block text-sm text-zinc-400">
          Progress {entry.totalUnits ? `(of ${entry.totalUnits})` : "(ongoing)"}
          <input
            type="number"
            min="0"
            max={entry.totalUnits ?? undefined}
            value={progress}
            onChange={(event) => setProgress(event.target.value)}
            className="mt-1 w-full bg-zinc-800 border border-zinc-700 focus:border-violet-500 outline-none rounded-lg px-3 py-2 text-white"
          />
        </label>

        <label className="block text-sm text-zinc-400">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="plan_to_watch">Plan to watch</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-500 rounded-lg py-2 font-semibold">
            Save
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg py-2">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}