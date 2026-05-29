import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./forums.css";

const initialForums = [
  {
    id: "thread_spotify_123",
    title: "Spotify Wrapped 2026 Discussion",
    creator: "Alex_Melody",
    content: "What does your wrapped say about you this year? Share your top tracks and let's compare stats! If you haven't seen your stats yet, make sure to check the main mobile application homepage canvas banner since that is where they are rolling out first across regional database server stacks globally.",
    replies: 42,
    likes: 310,
    created_time: "2026-05-27T21:15:00.000Z"
  },
  {
    id: "thread_vinyl_456",
    title: "Is vinyl actually worth the premium price?",
    creator: "BeatCollector",
    content: "Thinking of starting a collection but setup costs look steep. Looking for honest feedback regarding player setups, preamp modules, and weighted dynamic tonearm balances.",
    replies: 15,
    likes: 89,
    created_time: "2026-05-27T01:15:00.000Z"
  }
];

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const created = new Date(timestamp);
  const secondsPast = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (secondsPast < 60) return "POSTED JUST NOW";
  const minutesPast = Math.floor(secondsPast / 60);
  if (minutesPast < 60) return `POSTED ${minutesPast} ${minutesPast === 1 ? "MINUTE" : "MINUTES"} AGO`;
  const hoursPast = Math.floor(minutesPast / 60);
  if (hoursPast < 24) return `POSTED ${hoursPast} ${hoursPast === 1 ? "HOUR" : "HOURS"} AGO`;
  const daysPast = Math.floor(hoursPast / 24);
  return `POSTED ${daysPast} ${daysPast === 1 ? "DAY" : "DAYS"} AGO`;
};

// Helper utility function to slice text up to a fixed maximum word ceiling
const truncateWords = (text, maxWords) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
};

const ForumCard = ({ forum }) => {
  const [likes, setLikes] = useState(forum.likes);
  const [userVote, setUserVote] = useState(null);

  const handleVote = (type) => {
    if (userVote === type) {
      setLikes(prev => type === 'up' ? prev - 1 : prev + 1);
      setUserVote(null);
    } else {
      if (userVote) {
        setLikes(prev => type === 'up' ? prev + 2 : prev - 2);
      } else {
        setLikes(prev => type === 'up' ? prev + 1 : prev - 1);
      }
      setUserVote(type);
    }
  };

  return (
    <article className="forum-card">
      <div className="forum-card-header">
        <div className="forum-avatar">
          {forum.creator.substring(0, 2).toUpperCase()}
        </div>
        <div className="forum-header-meta">
          <h2>{forum.title}</h2>
          <p className="author-name">By @{forum.creator}</p>
        </div>
        <span className="time-ago-badge">{formatTimeAgo(forum.created_time)}</span>
      </div>

      <div className="forum-card-content">
        {/* Cap displayed content at 50 words */}
        <p className="forum-description">
          {truncateWords(forum.content, 50)}
        </p>

        <div className="forum-footer-actions-row">
          <div className="vote-counter-wrapper">
            <button className={`vote-btn up ${userVote === 'up' ? 'active' : ''}`} onClick={() => handleVote('up')}>↑</button>
            <span className={`vote-count ${userVote ? 'voted' : ''}`}>{likes}</span>
            <button className={`vote-btn down ${userVote === 'down' ? 'active' : ''}`} onClick={() => handleVote('down')}>↓</button>
          </div>

          <div className="forum-replies-counter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B3B3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="replies-text-count"><strong>{forum.replies}</strong> replies</span>
          </div>

          <Link className="primary-action inline-view-btn" to={`/forums/${forum.id}`}>
            View Thread
          </Link>
        </div>
      </div>
    </article>
  );
};

const Forums = () => {
  const [forumsList, setForumsList] = useState(initialForums);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const filteredForums = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return forumsList;
    return forumsList.filter((forum) => {
      const searchableText = [forum.title, forum.creator, forum.content].join(" ").toLowerCase();
      return searchableText.includes(query);
    });
  }, [searchTerm, forumsList]);

  // Dynamic counter to check input layout array length states live
  const titleWordCount = useMemo(() => {
    const trimmed = formData.title.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [formData.title]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (titleWordCount > 15) {
      setErrorMessage("Title cannot exceed 15 words.");
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) return;

    const newThread = {
      id: `thread_${Date.now()}`,
      title: formData.title,
      creator: "CurrentUser",
      content: formData.content,
      replies: 0,
      likes: 0,
      created_time: new Date().toISOString()
    };

    setForumsList(prev => [newThread, ...prev]);
    setFormData({ title: "", content: "" });
    setIsModalOpen(false);
  };

  return (
    <section className="forums-page">
      <div className="forums-header-wrapper">
        <div className="forums-header">
          <p className="forums-kicker">Forum Messaging Boards</p>
          <h1 id='forums-text'>Discuss Music</h1>
          <p id='forums-text'>Talk with other users about anything music - albums, playlists, artists - as soon as it drops!</p>
        </div>
        <button className="create-post-trigger-btn" onClick={() => { setErrorMessage(""); setIsModalOpen(true); }}>
          + Create Post
        </button>
      </div>

      <div className="forums-toolbar">
        <div className="forums-search">
          <label id="forums-text" htmlFor="forums-board-search">Search forums</label>
          <input
            id="forums-board-search"
            type="search"
            placeholder="Search by title or author"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="forums-result-count">
          <strong id="forums-secondary-text">{filteredForums.length}</strong>
          <span id="forums-secondary-text">{filteredForums.length === 1 ? "forum found" : "forums found"}</span>
        </div>
      </div>

      <div className="forums-grid" aria-live="polite">
        {filteredForums.map((forum) => (
          <ForumCard key={forum.id} forum={forum} />
        ))}
      </div>

      {filteredForums.length === 0 && (
        <p className="empty-forums-state">No forums found.</p>
      )}

      {isModalOpen && (
        <div className="modal-backdrop-overlay" role="dialog" aria-modal="true">
          <div className="modal-surface-container">
            <div className="modal-header-row">
              <h2>Create a New Thread</h2>
              <button className="modal-close-icon-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="modal-submission-form">
              <div className="form-input-group">
                <div className="input-label-row">
                  <label htmlFor="modal-post-title">Thread Title</label>
                  <span className={`word-counter-indicator ${titleWordCount > 15 ? "overflowing" : ""}`}>
                    {titleWordCount}/15 words
                  </span>
                </div>
                <input
                  id="modal-post-title"
                  type="text"
                  required
                  placeholder="Enter a descriptive topic title..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="form-input-group">
                <label htmlFor="modal-post-content">Description Content</label>
                <textarea
                  id="modal-post-content"
                  required
                  rows="5"
                  placeholder="What would you like to discuss with the community?"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>

              {errorMessage && <p className="modal-error-alert-banner">{errorMessage}</p>}

              <div className="modal-form-actions">
                <button type="button" className="cancel-action-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-action-btn" disabled={titleWordCount > 15}>
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Forums;
