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

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-zinc-800 rounded-full pl-1 pr-3 py-1">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-600 text-sm font-bold uppercase">
              {user.username.charAt(0)}
            </span>
            <span className="text-sm font-medium text-zinc-200">{user.username}</span>
          </div>
          <button
            onClick={onSwitchProfile}
            className="text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-violet-500 rounded-lg px-3 py-1.5 transition-colors"
          >
            Switch
          </button>
        </div>
      </div>
    </nav>
  );
}