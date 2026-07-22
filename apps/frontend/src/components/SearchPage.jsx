import { useEffect, useState } from "react";
import { createEntry } from "../api/omnitrack.js";
import SearchDetail from "./SearchDetail.jsx";

const LIMIT = 20;

export default function SearchPage({ user }) {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [mediaType, setMediaType] = useState("anime");
  const [results, setResults] = useState([]);
  const [heading, setHeading] = useState("Popular");
  const [offset, setOffset] = useState(0);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [viewing, setViewing] = useState(null);

  function buildUrl(q, startOffset) {
    const base = q.trim()
      ? `https://kitsu.io/api/edge/${mediaType}?filter[text]=${encodeURIComponent(q)}`
      : `https://kitsu.io/api/edge/${mediaType}?sort=popularityRank`;
    return `${base}&page[limit]=${LIMIT}&page[offset]=${startOffset}`;
  }

  async function loadPage(q, reset) {
    const startOffset = reset ? 0 : offset;
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(buildUrl(q, startOffset));
      if (!response.ok) throw new Error("Couldn't load titles — try again in a few seconds");
      const body = await response.json();
      setResults((prev) => (reset ? body.data : [...prev, ...body.data]));
      setOffset(startOffset + LIMIT);
      setCanLoadMore(body.data.length === LIMIT);
      setActiveQuery(q);
      setHeading(
        q.trim()
          ? `Results for "${q}"`
          : `Popular ${mediaType === "anime" ? "Anime" : "Manga"}`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage(query.trim() ? query : "", true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaType]);

  function handleSearch(event) {
    event.preventDefault();
    if (!query.trim()) {
      setError("Enter a title to search");
      return;
    }
    loadPage(query, true);
  }

  async function handleAdd(item) {
    setError("");
    setNotice("");
    const attr = item.attributes;
    const title = attr.canonicalTitle;
    try {
      await createEntry({
        userId: user.id,
        malId: Number(item.id),
        mediaType,
        title,
        imageUrl: attr.posterImage?.small ?? null,
        totalUnits: mediaType === "anime" ? attr.episodeCount : attr.chapterCount,
      });
      setNotice(`"${title}" added to your tracker!`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 mb-6">
        <div className="flex rounded-lg overflow-hidden border border-zinc-700">
          <button
            type="button"
            onClick={() => setMediaType("anime")}
            className={mediaType === "anime" ? "bg-violet-600 px-4 py-2 font-medium" : "bg-zinc-900 px-4 py-2 text-zinc-400"}
          >
            Anime
          </button>
          <button
            type="button"
            onClick={() => setMediaType("manga")}
            className={mediaType === "manga" ? "bg-violet-600 px-4 py-2 font-medium" : "bg-zinc-900 px-4 py-2 text-zinc-400"}
          >
            Manga
          </button>
        </div>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${mediaType} titles...`}
          className="flex-1 min-w-48 bg-zinc-900 border border-zinc-700 focus:border-violet-500 outline-none rounded-lg px-4 py-2 placeholder-zinc-500"
        />
        <button type="submit" className="bg-violet-600 hover:bg-violet-500 rounded-lg px-6 py-2 font-semibold">
          Search
        </button>
      </form>

      <h2 className="text-lg font-bold mb-3">{heading}</h2>

      {error && <p className="text-red-400 py-2">{error}</p>}
      {notice && <p className="text-emerald-400 py-2">{notice}</p>}
      {!loading && results.length === 0 && !error && (
        <p className="text-zinc-400 py-4">No titles found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((item) => {
          const attr = item.attributes;
          const total = mediaType === "anime" ? attr.episodeCount : attr.chapterCount;
          const poster = attr.posterImage?.medium ?? attr.posterImage?.small;
          return (
            <article key={item.id} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-violet-600 transition-colors flex flex-col">
              <div className="cursor-pointer" onClick={() => setViewing(item)}>
                {poster ? (
                  <img src={poster} alt={attr.canonicalTitle} className="w-full aspect-[2/3] object-cover" />
                ) : (
                  <div className="w-full aspect-[2/3] bg-zinc-800" />
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3
                  className="font-bold leading-snug line-clamp-2 min-h-[2.75rem] cursor-pointer hover:text-violet-400"
                  title={attr.canonicalTitle}
                  onClick={() => setViewing(item)}
                >
                  {attr.canonicalTitle}
                </h3>
                <div className="flex items-center gap-2 mt-2 mb-3 text-xs">
                  <span className="bg-zinc-800 text-zinc-300 rounded px-2 py-0.5">
                    {total ? `${total} ${mediaType === "anime" ? "eps" : "ch"}` : "Ongoing"}
                  </span>
                  {attr.averageRating && (
                    <span className="text-amber-400">★ {Math.round(attr.averageRating)}%</span>
                  )}
                </div>
                <button
                  onClick={() => handleAdd(item)}
                  className="mt-auto w-full bg-violet-600 hover:bg-violet-500 rounded-lg py-2 text-sm font-semibold"
                >
                  + Add to tracker
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {loading && <p className="text-zinc-400 py-4 text-center">Loading...</p>}

      {!loading && canLoadMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => loadPage(activeQuery, false)}
            className="bg-zinc-800 hover:bg-violet-600 border border-zinc-700 rounded-lg px-8 py-2 font-semibold transition-colors"
          >
            Load more
          </button>
        </div>
      )}

      {viewing && (
        <SearchDetail
          item={viewing}
          mediaType={mediaType}
          onClose={() => setViewing(null)}
          onAdd={(item) => {
            handleAdd(item);
            setViewing(null);
          }}
        />
      )}
    </div>
  );
}