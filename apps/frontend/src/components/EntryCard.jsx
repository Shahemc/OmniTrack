const prestigeBorder = {
  0: "border-zinc-800",
  1: "border-amber-700",
  2: "border-zinc-300",
  3: "border-yellow-400",
};

export default function EntryCard({ entry, onIncrement, onEdit, onDelete, onPrestige, onView }) {
  const { title, mediaType, imageUrl, totalUnits, progress, status, prestigeCount } = entry;

  const percent = totalUnits ? Math.round((progress / totalUnits) * 100) : null;
  const border = prestigeBorder[Math.min(prestigeCount, 3)];
  const isFinished = totalUnits !== null && progress === totalUnits;
  const canIncrement = totalUnits === null || progress < totalUnits;

  return (
    <article className={`bg-zinc-900 rounded-xl overflow-hidden border-2 ${border} flex flex-col`}>
      <div className="cursor-pointer" onClick={() => onView(entry)}>
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full aspect-[2/3] object-cover" />
        ) : (
          <div className="w-full aspect-[2/3] bg-zinc-800 flex items-center justify-center text-zinc-600 text-sm">
            No image
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] uppercase tracking-wide bg-zinc-800 text-zinc-300 rounded px-1.5 py-0.5">
            {mediaType}
          </span>
          {prestigeCount > 0 && (
            <span className="text-[10px] font-bold bg-violet-600 rounded px-1.5 py-0.5">
              ★ {prestigeCount}
            </span>
          )}
        </div>

        <h3
          className="font-bold leading-snug line-clamp-2 min-h-[2.75rem] cursor-pointer hover:text-violet-400"
          title={title}
          onClick={() => onView(entry)}
        >
          {title}
        </h3>

        <div className="mt-2">
          {totalUnits ? (
            <>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${percent}%` }} />
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

        <div className="flex gap-1.5 mt-auto pt-3">
          {isFinished ? (
            <button
              onClick={() => onPrestige(entry)}
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg py-1.5 text-sm font-bold"
            >
              ★ Prestige
            </button>
          ) : (
            canIncrement && (
              <button
                onClick={() => onIncrement(entry)}
                className="flex-1 bg-violet-600 hover:bg-violet-500 rounded-lg py-1.5 text-sm font-semibold"
              >
                +1
              </button>
            )
          )}
          <button
            onClick={() => onEdit(entry)}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg py-1.5 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(entry)}
            className="bg-zinc-800 hover:bg-red-600 rounded-lg px-3 py-1.5 text-sm"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>
    </article>
  );
}