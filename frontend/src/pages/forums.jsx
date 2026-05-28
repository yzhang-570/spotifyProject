import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./forums.css";

// Initial Mock Data reflecting your exact fields
const initialForums = [
  {
    id: "thread_spotify_123",
    title: "Spotify Wrapped 2026 Discussion",
    creator: "Alex_Melody",
    content: "What does your wrapped say about you this year? Share your top tracks and let's compare stats!",
    replies: 42,
    likes: 310,
    created_time: "2026-05-27T21:15:00.000Z"
  },
  {
    id: "thread_vinyl_456",
    title: "Is vinyl actually worth the premium price?",
    creator: "BeatCollector",
    content: "Thinking of starting a collection but setup costs look steep. Looking for honest feedback.",
    replies: 15,
    likes: 89,
    created_time: "2026-05-27T01:15:00.000Z"
  }
];

// Helper function to calculate time ago strings
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

// Sub-component for individual thread rows to manage isolated vote/toggle states locally
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
        <p className="forum-description">{forum.content}</p>

        {/* Action strip replacing the old list tags with interactive rows */}
        <div className="forum-footer-actions-row">
          
          {/* 1. Vote counter chip using your style tokens */}
          <div className="vote-counter-wrapper">
            <button 
              className={`vote-btn up ${userVote === 'up' ? 'active' : ''}`} 
              onClick={() => handleVote('up')}
            >
              ↑
            </button>
            <span className={`vote-count ${userVote ? 'voted' : ''}`}>
              {likes}
            </span>
            <button 
              className={`vote-btn down ${userVote === 'down' ? 'active' : ''}`} 
              onClick={() => handleVote('down')}
            >
              ↓
            </button>
          </div>

          {/* 2. Custom reply counts next to text canvas metrics */}
          {/* 2. Replies Bubble Counter with Outline SVG Icon */}
          <div className="forum-replies-counter">
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#3B3B3B" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="chat-outline-icon"
              style={{ marginRight: "0.2rem" }}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="replies-text-count">
              <strong>{forum.replies}</strong> replies
            </span>
          </div>


          {/* 3. Navigation link aligning horizontally along baseline actions */}
          <Link className="primary-action inline-view-btn" to={`/forums/${forum.id}`}>
            View Thread
          </Link>
          
        </div>
      </div>
    </article>
  );
};

const Forums = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredForums = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return initialForums;
    return initialForums.filter((forum) => {
      const searchableText = [forum.title, forum.creator, forum.content].join(" ").toLowerCase();
      return searchableText.includes(query);
    });
  }, [searchTerm]);

  return (
    <section className="forums-page">
      <div className="forums-header">
        <p className="forums-kicker">Forum Messaging Boards</p>
        <h1>Discuss Music</h1>
        <p>Talk with other users about anything music - albums, playlists, artists - as soon as it drops!</p>
      </div>

      <div className="forums-toolbar">
        <div className="forums-search">
          <label htmlFor="forums-board-search">Search forums</label>
          <input
            id="forums-board-search"
            type="search"
            placeholder="Search by title, author, or description"
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
    </section>
  );
};

export default Forums;
