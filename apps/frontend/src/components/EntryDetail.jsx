import { useEffect, useState } from "react";
import { fetchEntry } from "../api/omnitrack.js";

export default function EntryDetail({ entryId, onClose }) {
  const [entry, setEntry] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setDescription("");

    fetchEntry(entryId)
      .then(async (data) => {
        if (!active) return;
        setEntry(data);
        // Pull the synopsis from Kitsu using the stored id + media type.
        try {
          const res = await fetch(
            `https://kitsu.io/api/edge/${data.mediaType}/${data.malId}`
          );
          if (res.ok) {
            const body = await res.json();
            if (active) setDescription(body.data?.attributes?.synopsis || "");
          }
        } catch {
          // description is optional — ignore failures
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [entryId]);

  const percent =
    entry && entry.totalUnits ? Math.round((entry.progress / entry.totalUnits) * 100) : null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-20"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        {loading && <p className="text-zinc-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {entry && (
          <div>
            <div className="flex gap-4">
              {entry.imageUrl && (
                <img
                  src={entry.imageUrl}
                  alt={entry.title}
                  className="w-28 h-40 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wide bg-zinc-800 text-zinc-300 rounded px-1.5 py-0.5">
                    {entry.mediaType}
                  </span>
                  {entry.prestigeCount > 0 && (
                    <span className="text-[10px] font-bold bg-violet-600 rounded px-1.5 py-0.5">
                      ★ Prestige {entry.prestigeCount}
                    </span>
                  )}
                </div>
                <h2 className="font-bold text-lg leading-snug">{entry.title}</h2>
                <p className="text-sm text-zinc-400 mt-1 capitalize">
                  {entry.status.replace(/_/g, " ")}
                </p>
              </div>
            </div>

            <div className="mt-4">
              {entry.totalUnits ? (
                <>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="text-sm text-zinc-400 mt-1">
                    {entry.progress} / {entry.totalUnits} · {percent}% complete
                  </p>
                </>
              ) : (
                <p className="text-sm text-zinc-400">
                  {entry.progress} watched · <span className="text-emerald-400">Ongoing series</span>
                </p>
              )}
            </div>

            {description && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">
                  Description
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">{description}</p>
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-6 w-full bg-zinc-800 hover:bg-zinc-700 rounded-lg py-2"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}