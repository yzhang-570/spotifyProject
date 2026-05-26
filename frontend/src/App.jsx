import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Discover from "./pages/discover";
import LikedSongs from "./pages/likedSongs";
import TopArtists from "./pages/topArtists";
import TopSongs from "./pages/topSongs";
import Forums from "./pages/forums";
import Inbox from "./pages/inbox";
import Profile from "./pages/profile";
import Login from "./pages/login";


const App = () => {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/dashboard/:userID" element={<Dashboard />} />
            <Route path="/liked-songs" element={<LikedSongs />} />
            <Route path="/top-artists" element={<TopArtists />} />
            <Route path="/top-songs" element={<TopSongs />} />
            <Route path="/forums" element={<Forums />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;