import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./discover.css";

const publicUsers = [
  {
    id: "maya",
    name: "Maya Chen",
    username: "mayalistens",
    bio: "Late-night synth pop, soft R&B, and new albums on repeat.",
    genres: ["Indie Pop", "R&B"],
    topArtist: "SZA",
    topSong: "Good Days",
    status: "Looking for mellow playlists",
    initials: "MC",
    avatarColor: "#8f7cf6",
  },
  {
    id: "jordan",
    name: "Jordan Lee",
    username: "jordanonshuffle",
    bio: "Building playlists for runs, road trips, and rainy mornings.",
    genres: ["Hip-Hop", "House"],
    topArtist: "Kaytranada",
    topSong: "Freefall",
    status: "Sharing workout mixes",
    initials: "JL",
    avatarColor: "#2eb67d",
  },
  {
    id: "sam",
    name: "Sam Rivera",
    username: "samspins",
    bio: "Always looking for guitar-driven tracks and underrated albums.",
    genres: ["Alt Rock", "Folk"],
    topArtist: "Boygenius",
    topSong: "Not Strong Enough",
    status: "Hunting for deep cuts",
    initials: "SR",
    avatarColor: "#f4a261",
  },
  {
    id: "nina",
    name: "Nina Patel",
    username: "ninabeats",
    bio: "Pop hooks, dance tracks, and anything with a huge chorus.",
    genres: ["Dance Pop", "Disco"],
    topArtist: "Dua Lipa",
    topSong: "Levitating",
    status: "Building the perfect party queue",
    initials: "NP",
    avatarColor: "#e76f51",
  },
];

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return publicUsers;
    }

    return publicUsers.filter((user) => {
      const searchableText = [
        user.name,
        user.username,
        user.bio,
        user.topArtist,
        user.topSong,
        ...user.genres,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [searchTerm]);

  return (
    <section className="discover-page">
      <div className="discover-header">
        <p className="discover-kicker">Public profiles</p>
        <h1>Discover Other Users</h1>
        <p>
          Browse listeners, compare favorite artists, and start a conversation
          around the music they love.
        </p>
      </div>

      <div className="discover-toolbar">
        <div className="discover-search">
          <label htmlFor="discover-user-search">Search public profiles</label>
          <input
            id="discover-user-search"
            type="search"
            placeholder="Search by name, genre, artist, or song"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="discover-result-count">
          <strong>{filteredUsers.length}</strong>
          <span>
            {filteredUsers.length === 1 ? "profile found" : "profiles found"}
          </span>
        </div>
      </div>

      <div className="discover-grid" aria-live="polite">
        {filteredUsers.map((user) => (
          <article
            className="user-card"
            key={user.id}
            style={{ "--avatar-color": user.avatarColor }}
          >
            <div className="user-card-header">
              <div className="user-avatar">{user.initials}</div>

              <div className="user-identity">
                <h2>{user.name}</h2>
                <p className="username">@{user.username}</p>
              </div>

              <span className="public-badge">Public</span>
            </div>

            <div className="user-card-content">
              <p className="user-status">{user.status}</p>
              <p className="user-bio">{user.bio}</p>

              <div className="genre-list">
                {user.genres.map((genre) => (
                  <span key={genre}>{genre}</span>
                ))}
              </div>

              <dl className="music-preview">
                <div>
                  <dt>Top artist</dt>
                  <dd>{user.topArtist}</dd>
                </div>
                <div>
                  <dt>Top song</dt>
                  <dd>{user.topSong}</dd>
                </div>
              </dl>

              <div className="user-actions">
                <Link className="primary-action" to="/profile">
                  View Profile
                </Link>
                <Link className="secondary-action" to="/inbox">
                  Message
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <p className="empty-discover-state">No public users found.</p>
      )}
    </section>
  );
};

export default Discover;
