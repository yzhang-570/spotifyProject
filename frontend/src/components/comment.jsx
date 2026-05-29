import { useState, useEffect } from 'react';
import { formatTimeAgo } from './timeAgo';
import { voteComment } from "../api";

export default function Comment({ comment, onReplySubmit }) { 
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [likes, setLikes] = useState(comment.likes || 0);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    const handleGlobalCollapse = (e) => {
      const shouldCollapse = e.detail.collapse;
      
      if (shouldCollapse) {
        // Only collapse if it's a nested sub-reply (depth > 1)
        if (comment.depth > 1) {
          setIsCollapsed(true);
        }
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('forum-global-collapse', handleGlobalCollapse);
    
    return () => {
      window.removeEventListener('forum-global-collapse', handleGlobalCollapse);
    };
  }, [comment.depth]); 

  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(prev => prev + 1);
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLikes(comment.likes || 0);
  }, [comment.likes]);

  useEffect(() => {
    setUserVote(comment.userVote || null);
  }, [comment.userVote]);

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReplySubmit(comment.id, comment.depth + 1, replyText);
    setReplyText('');
    setIsReplying(false);
  };

  const handleVote = async (type) => {
    const voteValue = type === "up" ? 1 : -1;

    const prev = userVote;

    let delta = 0;

    if (prev === voteValue) {
      setUserVote(null);
      delta = voteValue === 1 ? -1 : 1;
    } else if (!prev) {
      setUserVote(voteValue);
      delta = voteValue;
    } else {
      setUserVote(voteValue);
      delta = voteValue === 1 ? 2 : -2;
    }

    setLikes(l => l + delta);

    try {
      const updated = await voteComment(comment.forum, comment.id, voteValue);
      setLikes(updated.likes);
      setUserVote(updated.userVote);
    } catch (err) {
      setLikes(l => l - delta);
      setUserVote(prev);
    }
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
                  {comment.author?.profile_img ? (
                  <img src={comment.author.profile_img} />
                ) : (
                  comment.author?.initials || "U"
                )}
                </div>
              </div>
              <div className="comment-body-column">
                <div className="comment-header" onClick={() => setIsCollapsed(!isCollapsed)}>
                  <div className="comment-user-info">
                    <span className="comment-display-name">{comment.author?.name}</span>
                    <span className="comment-author">@{comment.author?.username}</span>
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
                <Comment key={reply.id} comment={reply} onReplySubmit={onReplySubmit} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
