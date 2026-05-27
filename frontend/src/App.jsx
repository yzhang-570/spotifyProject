import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import Dashboard from "./pages/dashboard";
import Discover from "./pages/discover";
import LikedSongs from "./pages/likedSongs";
import TopArtists from "./pages/topArtists";
import TopSongs from "./pages/topSongs";
import Forums from "./pages/forums";
import Inbox from "./pages/inbox";
import Login from "./pages/login";
import { getMe } from "./api";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const me = await getMe();
      setUser(me);
      setLoading(false);
    };
    checkLogin();
  }, []);

  if (loading) return <p style={{ color: 'white', padding: '2rem' }}>Loading...</p>;

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar user={user} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/dashboard/:userID" element={<Dashboard />} />
            <Route path="/liked-songs" element={<LikedSongs />} />
            <Route path="/top-artists" element={<TopArtists />} />
            <Route path="/top-songs" element={<TopSongs />} />
            <Route path="/forums" element={<Forums />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;