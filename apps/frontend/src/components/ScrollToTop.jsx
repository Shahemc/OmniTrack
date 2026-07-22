import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur text-zinc-300 hover:text-white border border-zinc-700 hover:border-violet-500 hover:bg-violet-600/20 rounded-lg px-4 py-2 text-sm font-medium shadow-lg transition-colors"
      title="Back to top"
    >
      🔝
    </button>
  );
}