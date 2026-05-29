import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPosts, createMainPost, votePost } from "../api";
import "./forums.css";

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
  const [userVote, setUserVote] = useState(forum.userVote); // 1, -1, null
  const [likes, setLikes] = useState(forum.likes);
  /* eslint-disable-next-line no-unused-vars */
  const [loadingVote, setLoadingVote] = useState(false);

  const handleVote = async (type) => {
    const voteValue = type === "up" ? 1 : -1;

    const previous = userVote;

    // optimistic UI
    let delta = 0;

    if (previous === voteValue) {
      setUserVote(null);
      delta = voteValue === 1 ? -1 : 1;
    } else if (!previous) {
      setUserVote(voteValue);
      delta = voteValue;
    } else {
      setUserVote(voteValue);
      delta = voteValue === 1 ? 2 : -2;
    }

    setLikes((l) => l + delta);

    try {
      await votePost(forum.id, voteValue);
    } catch {
      // rollback
      setLikes((l) => l - delta);
      setUserVote(previous);
    }
  };

  return (
    <article className="forum-card">
      <div className="forum-card-header">
        <div className="forum-avatar">
          {forum.author.profile_img ? (
            <img
              src={forum.author.profile_img}
              alt={forum.author.name}
              className="forum-avatar-img"
            />
          ) : (
            forum.author.initials
          )}
        </div>
        <div className="forum-header-meta">
          <h2>{forum.title}</h2>
          <p className="author-name">By @{forum.author.name}</p>
        </div>
        <div className="forum-time-badges">
          <span className="time-ago-badge">
            {formatTimeAgo(forum.created_time)}
          </span>

          {forum.recent_time && forum.recent_time !== forum.created_time && (
            <span className="recent-activity-badge">
              ACTIVE {formatTimeAgo(forum.recent_time).replace("POSTED ", "")}
            </span>
          )}
        </div>
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
  const [forumsList, setForumsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [forumsError, setForumsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadForums = async () => {
      try {
        const posts = await getPosts();

        if (!isMounted) return;

        setForumsList(posts);
        setForumsError("");
      } catch (error) {
        if (!isMounted) return;

        setForumsError(error.message || "Unable to load forums.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadForums();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredForums = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    let filtered = forumsList;

    // Search filtering
    if (query) {
      filtered = forumsList.filter((forum) => {
        const searchableText = [
          forum.title,
          forum.author.name,
          forum.content,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "created":
          return new Date(b.created_time) - new Date(a.created_time);
        case "recent":
          return new Date(b.recent_time) - new Date(a.recent_time);
        case "replies":
          return (b.replies || 0) - (a.replies || 0);
        case "likes":
          return (b.likes || 0) - (a.likes || 0);
        default:
          return new Date(b.recent_time) - new Date(a.recent_time);
      }
    });

    return sorted;
  }, [forumsList, searchTerm, sortBy]);

  // Dynamic counter to check input layout array length states live
  const titleWordCount = useMemo(() => {
    const trimmed = formData.title.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [formData.title]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (titleWordCount > 15) {
      setErrorMessage("Title cannot exceed 15 words.");
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    try {
      const newPost = await createMainPost(
        formData.title,
        formData.content
      );

      setForumsList((prev) => [newPost, ...prev]);

      setFormData({
        title: "",
        content: "",
      });

      setIsModalOpen(false);
      navigate(`/forums/${newPost.id}`);
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to create post."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="page-loading-state">
        <div className="loading-spinner" />
        <p>Loading forums...</p>
      </div>
    );
  }

  if (forumsError) {
    return <p>{forumsError}</p>;
  }

  return (
    <section className="forums-page">
      <div className="forums-header-wrapper">
        <div className="forums-header">
          <p className="forums-kicker">Forum Messaging Boards</p>
          <h1>Discuss Music</h1>
          <p>Talk with other users about anything music - albums, playlists, artists - as soon as it drops!</p>
        </div>
        <div className="forums-header-actions">
          <button
            className="create-post-trigger-btn"
            onClick={() => {
              setErrorMessage("");
              setIsModalOpen(true);
            }}
          >
            + Create Post
          </button>

          <div className="forums-sort-panel">
            <label htmlFor="forum-sort-select">
              Sort Threads
            </label>

            <select
              id="forum-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="forums-sort-select"
            >
              <option value="recent">Recent Activity</option>
              <option value="created">Newest Posts</option>
              <option value="replies">Most Replies</option>
              <option value="likes">Most Likes</option>
            </select>
          </div>
        </div>
      </div>

      <div className="forums-toolbar">
        <div className="forums-search">
          <label htmlFor="forums-board-search">Search forums</label>
          <input
            id="forums-board-search"
            type="search"
            placeholder="Search by title or author"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="forums-result-count">
          <strong>{filteredForums.length}</strong>
          <span>{filteredForums.length === 1 ? "forum found" : "forums found"}</span>
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
