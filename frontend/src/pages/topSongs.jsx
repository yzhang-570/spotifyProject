import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./topSongs.css";

const TopSongs = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState("all_time");
  const [isPrivate, setIsPrivate] = useState(false);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const rangeMap = {
      all_time: "long_term",
      last_year: "medium_term",
      last_month: "short_term",
    };

    const fetchTopSongs = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://127.0.0.1:8888/spotify/top-songs?time_range=${rangeMap[range]}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load top songs.");
        }

        const data = await response.json();
        setSongs(data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSongs();
  }, [range]);

  return (
    <section className="top-songs-page">
      <div className="top-songs-header-row">
        <button
          className="top-songs-back-button"
          onClick={() => navigate("/dashboard")}
          type="button"
        >
          &larr; Back
        </button>

        <div className="top-songs-controls">
          <div className="top-songs-filter">
            <label htmlFor="top-songs-range">Filter by</label>
            <select
              id="top-songs-range"
              value={range}
              onChange={(event) => setRange(event.target.value)}
            >
              <option value="all_time">All time</option>
              <option value="last_year">Last year</option>
              <option value="last_month">Last month</option>
            </select>
          </div>

          <div className="top-songs-privacy">
            <span className="top-songs-privacy-label">Visibility</span>
            <div className="privacy-toggle">
              <button
                type="button"
                className={!isPrivate ? "privacy-toggle-active" : ""}
                onClick={() => setIsPrivate(false)}
              >
                Public
              </button>
              <button
                type="button"
                className={isPrivate ? "privacy-toggle-active" : ""}
                onClick={() => setIsPrivate(true)}
              >
                Private
              </button>
            </div>
          </div>
        </div>
      </div>

      <h1 className="top-songs-title">Top Songs</h1>

      {loading ? <p>Loading top songs...</p> : null}
      {error ? <p>{error}</p> : null}

      {!loading && !error ? (
        <div className="top-songs-list">
          {songs.map((song, index) => (
            <article className="top-song-row" key={song.id}>
              <p className="top-song-rank">#{index + 1}</p>

              <div className="top-song-card">
                {song.album?.images?.[0]?.url ? (
                  <img
                    className="top-song-cover-image"
                    src={song.album.images[0].url}
                    alt={`${song.name} album cover`}
                  />
                ) : (
                  <div className="top-song-cover" aria-hidden="true" />
                )}
                <div className="top-song-text">
                  <p className="top-song-name">{song.name}</p>
                  <p className="top-song-artist">
                    {song.artists?.map((artist) => artist.name).join(", ")}
                  </p>
                  <p className="top-song-album">{song.album?.name}</p>
                </div>
              </div>
            </article>
          ))}
          {songs.length === 0 ? <p>No songs found.</p> : null}
        </div>
      ) : null}
    </section>
  );
};

export default TopSongs;