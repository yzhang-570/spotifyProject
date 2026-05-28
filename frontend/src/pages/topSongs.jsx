import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./topSongs.css";

const topSongsMock = [
  { id: 1, title: "Song Name", artist: "Artist Name", album: "Album Name" },
  { id: 2, title: "Song Name", artist: "Artist Name", album: "Album Name" },
  { id: 3, title: "Song Name", artist: "Artist Name", album: "Album Name" },
  { id: 4, title: "Song Name", artist: "Artist Name", album: "Album Name" },
];

const TopSongs = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState("all_time");

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
      </div>

      <h1 className="top-songs-title">Top Songs</h1>

      <div className="top-songs-list">
        {topSongsMock.map((song, index) => (
          <article className="top-song-row" key={song.id}>
            <p className="top-song-rank">#{index + 1}</p>

            <div className="top-song-card">
              <div className="top-song-cover" aria-hidden="true" />
              <div className="top-song-text">
                <p className="top-song-name">{song.title}</p>
                <p className="top-song-artist">{song.artist}</p>
                <p className="top-song-album">{song.album}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TopSongs;