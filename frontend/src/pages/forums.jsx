import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./forums.css";

// Mock data reflecting your required data shapes
const publicForums = [
  {
    id: "thread_spotify_123",
    title: "Spotify Wrapped 2026 Discussion",
    author: "Alex_Melody",
    category: "Albums",
    description: "What does your wrapped say about you this year? Share your top tracks and let's compare stats!",
    replies: 42,
    views: 310,
    tags: ["Spotify", "Wrapped", "Stats"]
  },
  {
    id: "thread_vinyl_456",
    title: "Is vinyl actually worth the premium price?",
    author: "BeatCollector",
    category: "Hardware",
    description: "Thinking of starting a collection but setup costs look steep. Looking for honest feedback.",
    replies: 15,
    views: 89,
    tags: ["Vinyl", "Audio", "Collecting"]
  }
];

const Forums = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredForums = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return publicForums;
    }
    return publicForums.filter((forum) => {
      const searchableText = [
        forum.title,
        forum.author,
        forum.category,
        forum.description,
        ...forum.tags,
      ]
        .join(" ")
        .toLowerCase();
      return searchableText.includes(query);
    });
  }, [searchTerm]);

  return (
    <section className="forums-page">
      <div className="forums-header">
        <p className="forums-kicker">Forum Messaging Boards</p>
        <h1>Discuss Music</h1>
        <p>
          Talk with other users about anything music - albums, playlists, artists - as soon as it drops!
        </p>
      </div>

      <div className="forums-toolbar">
        <div className="forums-search">
          <label htmlFor="forums-board-search">Search forums</label>
          <input
            id="forums-board-search"
            type="search"
            placeholder="Search by title, author, category, or tags"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="forums-result-count">
          <strong>{filteredForums.length}</strong>
          <span>
            {filteredForums.length === 1 ? "forum found" : "forums found"}
          </span>
        </div>
      </div>

      <div className="forums-grid" aria-live="polite">
        {filteredForums.map((forum) => (
          <article className="forum-card" key={forum.id}>
            <div className="forum-card-header">
              <div className="forum-avatar">
                {forum.author.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2>{forum.title}</h2>
                <p className="author-name">By @{forum.author}</p>
              </div>
              <span className="category-badge">{forum.category}</span>
            </div>

            <div className="forum-card-content">
              <p className="forum-description">{forum.description}</p>
              <div className="tag-list">
                {forum.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>

              <dl className="forum-preview">
                <div>
                  <dt>Replies</dt>
                  <dd>{forum.replies}</dd>
                </div>
                <div>
                  <dt>Views</dt>
                  <dd>{forum.views}</dd>
                </div>
              </dl>

              <div className="forum-actions">
                <Link className="primary-action" to={`/forums/${forum.id}`}>
                  View Thread
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredForums.length === 0 && (
        <p className="empty-forums-state">No forums found.</p>
      )}
    </section>
  );
};

export default Forums;
