import { useState, useEffect } from "react";
import { getLikedSongs } from "../api";
import "./likedSongs.css";

const LikedSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      const data = await getLikedSongs();
      setSongs(data.items);
      setLoading(false);
    };
    fetchSongs();
  }, []);

  if (loading) return <p className="loading">Loading liked songs...</p>;

  return (
    <div className="liked-songs">
      <h1 className="page-title">Liked Songs</h1>
      <div className="songs-grid">
        {songs.map((item) => (
          <div className="song-card" key={item.track.id}>
            <img
              src={item.track.album.images[0]?.url}
              alt={item.track.name}
              className="song-image"
            />
            <p className="song-name">{item.track.name}</p>
            <p className="song-artist">
              {item.track.artists.map((a) => a.name).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedSongs;