import { useState, useEffect } from 'react'; // 1. Import useEffect

export default function Comment({ comment, onReplySubmit, globalToggle }) { // 2. Accept globalToggle prop
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [likes, setLikes] = useState(comment.likes || 0);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    if (globalToggle && globalToggle.timestamp !== null) {
      if (globalToggle.collapse) {
        // FIXED: Only collapse if it's a nested sub-reply (depth > 1)
        // Top-level direct comments (depth === 1) remain open and visible!
        if (comment.depth > 1) {
          setIsCollapsed(true);
        }
      } else {
        // Expand all expands everything back out unconditionally
        setIsCollapsed(false);
      }
    }
  }, [globalToggle, comment.depth]);


  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReplySubmit(comment.id, comment.depth + 1, replyText);
    setReplyText('');
    setIsReplying(false);
  };

  const handleVote = (type) => {
    if (userVote === type) {
      setLikes(prev => type === 'up' ? prev - 1 : prev + 1);
      setUserVote(null);
    } else {
      if (userVote) setLikes(prev => type === 'up' ? prev + 2 : prev - 2);
      else setLikes(prev => type === 'up' ? prev + 1 : prev - 1);
      setUserVote(type);
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " yrs ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hrs ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " min ago";
    return "Just now";
  };

  return (
    <div className="comment-container">
      <div className="comment-layout">
        {comment.depth > 1 && (
          <div className={`comment-indent-line ${isCollapsed ? 'collapsed' : ''}`} onClick={() => setIsCollapsed(!isCollapsed)} />
        )}
        <div className="comment-wrapper-branch">
          <div className="comment-content-box">
            <div className="comment-main-flex">
              <div className="comment-avatar-column">
                <div className="comment-user-avatar">
                  {comment.creator ? comment.creator.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <div className="comment-body-column">
                <div className="comment-header" onClick={() => setIsCollapsed(!isCollapsed)}>
                  <div className="comment-user-info">
                    <span className="comment-display-name">User Name</span>
                    <span className="comment-author">@{comment.creator}</span>
                  </div>
                  <div className="comment-header-right">
                    <span className="comment-timestamp">{formatTimeAgo(comment.created_time)}</span>
                    <span className="collapse-toggle-btn">[{isCollapsed ? '+' : '-'}]</span>
                  </div>
                </div>
                {!isCollapsed && (
                  <>
                    <p className="comment-body">{comment.content}</p>
                    <div className="comment-actions-row">
                      <div className="vote-counter-wrapper">
                        <button className={`vote-btn up ${userVote === 'up' ? 'active' : ''}`} onClick={() => handleVote('up')}>↑</button>
                        <span className={`vote-count ${userVote ? 'voted' : ''}`}>{likes}</span>
                        <button className={`vote-btn down ${userVote === 'down' ? 'active' : ''}`} onClick={() => handleVote('down')}>↓</button>
                      </div>
                      <button className="reply-trigger-btn" onClick={() => setIsReplying(!isReplying)}>Reply</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {!isCollapsed && isReplying && (
            <form onSubmit={handleReply} className="reply-form">
              <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="What are your thoughts?" />
              <div className="reply-form-actions">
                <button type="button" onClick={() => setIsReplying(false)}>Cancel</button>
                <button type="submit">Post Reply</button>
              </div>
            </form>
          )}
          {!isCollapsed && comment.replies && comment.replies.length > 0 && (
            <div className="comment-replies-list">
              {comment.replies.map((reply) => (
                <Comment 
                  key={reply.id} 
                  comment={reply} 
                  onReplySubmit={onReplySubmit} 
                  globalToggle={globalToggle} // 4. FIXED: Forward prop into recursive rendering loops!
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
