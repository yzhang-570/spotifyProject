import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from 'react';
import { getThread, votePost, createComment } from "../api";
import { nestComments } from '../components/commentTree';
import { formatTimeAgo } from '../components/timeAgo';
import Comment from '../components/comment';
import "./forumPage.css";

export default function ForumPage() {
  const { postId } = useParams();
  const [mainPost, setMainPost] = useState(null);
  const [flatComments, setFlatComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('oldest');
  const [mainLikes, setMainLikes] = useState(0);
  const [mainUserVote, setMainUserVote] = useState(null);

  const [globalToggle, setGlobalToggle] = useState({ collapse: false, timestamp: null });

  useEffect(() => {
    let mounted = true;

    const loadThread = async () => {
      try {
        const data = await getThread(postId);

        if (!mounted) return;

        setMainPost(data.mainPost);
        setFlatComments(data.replies);

        setMainLikes(data.mainPost.likes || 0);
        setMainUserVote(data.mainPost.userVote || null);
      } catch (err) {
        console.error("Failed to load thread:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadThread();

    return () => {
      mounted = false;
    };
  }, [postId]);

  const commentTree = useMemo(() => {
    const nested = nestComments(flatComments);

    const sortTreeData = (nodes) => {
      nodes.sort((a, b) => {
        if (sortBy === 'likes') {
          return (b.likes || 0) - (a.likes || 0);
        } else if (sortBy === 'newest') {
          return new Date(b.created_time) - new Date(a.created_time);
        } else {
          return new Date(a.created_time) - new Date(b.created_time);
        }
      });
      nodes.forEach(node => {
        if (node.replies && node.replies.length > 0) {
          sortTreeData(node.replies);
        }
      });
    };

    sortTreeData(nested);
    return nested;
  }, [flatComments, sortBy]);

  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(prev => prev + 1);
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, []);


  const handleMainVote = async (type) => {
    const voteValue = type === "up" ? 1 : -1;

    const prevVote = mainUserVote;

    let delta = 0;

    if (prevVote === voteValue) {
      setMainUserVote(null);
      delta = voteValue === 1 ? -1 : 1;
    } else if (!prevVote) {
      setMainUserVote(voteValue);
      delta = voteValue;
    } else {
      setMainUserVote(voteValue);
      delta = voteValue === 1 ? 2 : -2;
    }

    setMainLikes(l => l + delta);

    try {
      const updated = await votePost(mainPost.id, voteValue);
      setMainLikes(updated.likes);
      setMainUserVote(updated.userVote);
    } catch (err) {
      // rollback
      setMainLikes(l => l - delta);
      setMainUserVote(prevVote);
    }
  };

  const handleAddComment = async (parentId = null, targetDepth = 1, text) => {
    if (!text.trim()) return;
    try {
      const newComment = await createComment(
        postId,
        text,
        parentId ? targetDepth : 1,
        parentId || postId
      );

      setFlatComments(prev => [...prev, newComment]);

    } catch (err) {
      console.error("Failed to create comment:", err);
    }
  };

  const handleGlobalCollapseToggle = (shouldCollapse) => {
    const event = new CustomEvent('forum-global-collapse', {
      detail: { collapse: shouldCollapse }
    });
    window.dispatchEvent(event);
  };


  if (isLoading) return <div>Loading thread...</div>;

  return (
    <div className="forum-page-container">
      {mainPost && (
        <div className="main-post-card">
          <div className="comment-main-flex">
            <div className="comment-avatar-column">
              <div className="comment-user-avatar main-post-avatar">
                {mainPost.author?.profile_img ? (
                  <img src={mainPost.author.profile_img} />
                ) : (
                  mainPost.author?.initials || "U"
                )}
              </div>
            </div>
            <div className="comment-body-column">
              <div className="comment-header">
                <div className="comment-user-info">
                  <span className="comment-display-name">{mainPost.author?.name}</span>
                  <span className="comment-author">@{mainPost.author?.username}</span>
                </div>
                <div className="comment-header-right">
                  <span className="comment-timestamp">{formatTimeAgo(mainPost.created_time)}</span>
                </div>
              </div>
              <h1>{mainPost.title}</h1>
              {mainPost.content && <p className="main-post-content">{mainPost.content}</p>}
              <div className="comment-actions-row">
                <div className="vote-counter-wrapper">
                  <button className={`vote-btn up ${mainUserVote === 'up' ? 'active' : ''}`} onClick={() => handleMainVote('up')}>↑</button>
                  <span className={`vote-count ${mainUserVote ? 'voted' : ''}`}>{mainLikes}</span>
                  <button className={`vote-btn down ${mainUserVote === 'down' ? 'active' : ''}`} onClick={() => handleMainVote('down')}>↓</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="root-comment-box">
        <textarea placeholder="Add to the discussion..." value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} />
        <button onClick={() => { handleAddComment(null, 1, newCommentText); setNewCommentText(''); }}>Comment</button>
      </div>

      <div className="comments-section">
        <div className="discussion-section-header">
          <h3>Discussion</h3>
          
          <div className="discussion-controls-toolbar">
            <div className="global-collapse-actions">
              <button onClick={() => handleGlobalCollapseToggle(true)} className="text-action-link">Collapse All</button>
              <span className="action-divider">|</span>
              <button onClick={() => handleGlobalCollapseToggle(false)} className="text-action-link">Expand All</button>
            </div>

            <div className="sort-dropdown-container">
              <label htmlFor="comment-sort">Sort by:</label>
              <select id="comment-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="forum-sort-select">
                <option value="oldest">Oldest</option>
                <option value="newest">Newest</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>
          </div>
        </div>

        {commentTree.map((rootComment) => (
          <Comment 
            key={rootComment.id} 
            comment={rootComment} 
            onReplySubmit={handleAddComment} 
          />
        ))}
      </div>
    </div>
  );
}
