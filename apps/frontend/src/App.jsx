import { useState } from "react";
import ProfilePicker from "./components/ProfilePicker.jsx";
import Navbar from "./components/Navbar.jsx";
import TrackerPage from "./components/TrackerPage.jsx";
import SearchPage from "./components/SearchPage.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("tracker");

  if (!currentUser) {
    return <ProfilePicker onSelect={setCurrentUser} />;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar
        user={currentUser}
        page={page}
        onNavigate={setPage}
        onSwitchProfile={() => setCurrentUser(null)}
      />

      {page === "tracker" && <TrackerPage user={currentUser} />}
      {page === "search" && <SearchPage user={currentUser} />}

      <ScrollToTop />
    </main>
  );
}