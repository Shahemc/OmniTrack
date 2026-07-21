// Border color levels up with prestige count
const prestigeBorder = {
  0: "border-zinc-800",
  1: "border-amber-700",   // bronze
  2: "border-zinc-300",    // silver
  3: "border-yellow-400",  // gold
};

export default function EntryCard({ entry }) {
  const { title, mediaType, imageUrl, totalUnits, progress, status, prestigeCount } = entry;

  const percent = totalUnits ? Math.round((progress / totalUnits) * 100) : null;
  const border = prestigeBorder[Math.min(prestigeCount, 3)];

  return (
    <article className={`bg-zinc-900 rounded-xl overflow-hidden border-2 ${border}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-full h-56 object-cover" />
      ) : (
        <div className="w-full h-56 bg-zinc-800 flex items-center justify-center text-zinc-600">
          No image
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-wide bg-zinc-800 text-zinc-300 rounded px-2 py-0.5">
            {mediaType}
          </span>
          {prestigeCount > 0 && (
            <span className="text-xs font-bold bg-violet-600 rounded px-2 py-0.5">
              ★ Prestige {prestigeCount}
            </span>
          )}
        </div>

        <h3 className="font-semibold truncate" title={title}>{title}</h3>

        <div className="mt-3">
          {totalUnits ? (
            <>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {progress} / {totalUnits} · {percent}%
              </p>
            </>
          ) : (
            <p className="text-xs text-zinc-400">
              {progress} watched · <span className="text-emerald-400">Ongoing</span>
            </p>
          )}
        </div>

        <p className="text-xs text-zinc-500 mt-1 capitalize">{status.replace(/_/g, " ")}</p>
      </div>
    </article>
  );
}