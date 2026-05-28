import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, getTopArtists } from "../api";
import "./topArtists.css";

const TopArtists = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState("last_year");
  const [isPrivate, setIsPrivate] = useState(false);
  const [artists, setArtists] = useState([]);
  const [userId, setUserId] = useState("");
  const [displayName, setDisplayName] = useState("Your");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const rangeMap = {
      all_time: "long_term",
      last_year: "medium_term",
      last_month: "short_term",
    };

    const loadArtists = async () => {
      setLoading(true);
      setError("");

      try {
        const me = await getMe();
        if (me) {
          setUserId(me.id);
          setDisplayName(me.display_name || "Your");
        }

        const data = await getTopArtists(rangeMap[range]);
        setArtists(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadArtists();
  }, [range]);

  const handleBack = () => {
    if (userId) {
      navigate(`/dashboard/${userId}`);
      return;
    }
    navigate("/discover");
  };

  return (
    <section className="top-artists-page">
      <div className="top-artists-header-row">
        <button
          className="top-artists-back-button"
          onClick={handleBack}
          type="button"
        >
          &larr; Back
        </button>

        <div className="top-artists-controls">
          <div className="top-artists-filter">
            <label htmlFor="top-artists-range">Filter by</label>
            <select
              id="top-artists-range"
              value={range}
              onChange={(event) => setRange(event.target.value)}
            >
              <option value="all_time">All time</option>
              <option value="last_year">Last year</option>
              <option value="last_month">Last month</option>
            </select>
          </div>

          <div className="top-artists-privacy">
            <label htmlFor="top-artists-privacy">Visibility</label>
            <select
              id="top-artists-privacy"
              value={isPrivate ? "private" : "public"}
              onChange={(event) =>
                setIsPrivate(event.target.value === "private")
              }
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>

      <h1 className="top-artists-title">{displayName}&apos;s Top Artists</h1>

      {loading ? <p>Loading top artists...</p> : null}
      {error ? <p>{error}</p> : null}

      {!loading && !error ? (
        <div className="top-artists-grid">
          {artists.map((artist) => (
            <article className="top-artist-card" key={artist.id}>
              {artist.images?.[0]?.url ? (
                <img
                  className="top-artist-image"
                  src={artist.images[0].url}
                  alt={`${artist.name} profile`}
                />
              ) : (
                <div className="top-artist-image-placeholder" aria-hidden="true" />
              )}
              <p className="top-artist-name">{artist.name}</p>
            </article>
          ))}
          {artists.length === 0 ? (
            <p>
              No artists found. Try another filter or{" "}
              <a href="http://127.0.0.1:8888/auth/login">log in with Spotify again</a>.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default TopArtists;
