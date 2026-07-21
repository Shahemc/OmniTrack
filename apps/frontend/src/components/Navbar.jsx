export default function Navbar({ user, page, onNavigate, onSwitchProfile }) {
  const linkStyle = (target) =>
    page === target
      ? "bg-violet-600 text-white rounded-lg px-4 py-1.5 font-medium"
      : "text-zinc-400 hover:text-white rounded-lg px-4 py-1.5 font-medium";

  return (
    <nav className="sticky top-0 z-10 bg-zinc-900/80 backdrop-blur border-b border-zinc-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <span className="text-xl font-bold">
          Omni<span className="text-violet-500">Track</span>
        </span>

        <div className="flex items-center gap-2">
          <button className={linkStyle("tracker")} onClick={() => onNavigate("tracker")}>
            My Tracker
          </button>
          <button className={linkStyle("search")} onClick={() => onNavigate("search")}>
            Search
          </button>
        </div>

        <button
          onClick={onSwitchProfile}
          className="text-sm text-zinc-400 hover:text-white"
          title="Switch profile"
        >
          {user.username} ↩
        </button>
      </div>
    </nav>
  );
}