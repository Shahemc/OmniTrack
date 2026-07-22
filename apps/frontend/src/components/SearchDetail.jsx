export default function SearchDetail({ item, mediaType, onClose, onAdd }) {
  const attr = item.attributes;
  const total = mediaType === "anime" ? attr.episodeCount : attr.chapterCount;
  const poster = attr.posterImage?.medium ?? attr.posterImage?.small;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-20"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex gap-4">
          {poster && (
            <img
              src={poster}
              alt={attr.canonicalTitle}
              className="w-28 h-40 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wide bg-zinc-800 text-zinc-300 rounded px-1.5 py-0.5">
                {mediaType}
              </span>
              {attr.averageRating && (
                <span className="text-xs text-amber-400">★ {Math.round(attr.averageRating)}%</span>
              )}
            </div>
            <h2 className="font-bold text-lg leading-snug">{attr.canonicalTitle}</h2>
            <p className="text-sm text-zinc-400 mt-1">
              {total ? `${total} ${mediaType === "anime" ? "episodes" : "chapters"}` : "Ongoing"}
            </p>
          </div>
        </div>

        {attr.synopsis && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">
              Description
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{attr.synopsis}</p>
          </div>
        )}

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => onAdd(item)}
            className="flex-1 bg-violet-600 hover:bg-violet-500 rounded-lg py-2 font-semibold"
          >
            + Add to tracker
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}