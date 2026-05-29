import { useParams } from "react-router-dom";
import { useState, useMemo } from 'react';
import { nestComments } from '../components/commentTree';
import Comment from '../components/comment';
import { mockThreadPayload } from '../components/mockPosts'; 
import "./forumPage.css";

export default function ForumPage() {
  const { postId } = useParams();
  /* eslint-disable-next-line no-unused-vars */
  const [mainPost, setMainPost] = useState(() => mockThreadPayload.mainPost || null);
  
  const [flatComments, setFlatComments] = useState(() => mockThreadPayload.comments || []);
  const [newCommentText, setNewCommentText] = useState('');
  
  /* eslint-disable-next-line no-unused-vars */
  const [isLoading, setIsLoading] = useState(false);

  const [sortBy, setSortBy] = useState('oldest');
  const [mainLikes, setMainLikes] = useState(() => mockThreadPayload.mainPost?.likes || 0);
  const [mainUserVote, setMainUserVote] = useState(null);

  /* eslint-disable-next-line no-unused-vars */
  const [globalToggle, setGlobalToggle] = useState({ collapse: false, timestamp: null });

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

  const handleMainVote = (type) => {
    if (mainUserVote === type) {
      setMainLikes(prev => type === 'up' ? prev - 1 : prev + 1);
      setMainUserVote(null);
    } else {
      if (mainUserVote) {
        setMainLikes(prev => type === 'up' ? prev + 2 : prev - 2);
      } else {
        setMainLikes(prev => type === 'up' ? prev + 1 : prev - 1);
      }
      setMainUserVote(type);
    }
  };

  const handleAddComment = async (parentId = null, targetDepth = 1, text) => {
    const payload = {
      id: `mock_doc_${Date.now()}`,
      creator: "current_user_placeholder",
      content: text,
      likes: 0,
      forum: postId,
      depth: parentId ? targetDepth : 1,
      reply_to: parentId || postId,
      created_time: new Date().toISOString()
    };
    setFlatComments(prevComments => [...prevComments, payload]);
  };

  const handleGlobalCollapseToggle = (shouldCollapse) => {
    const event = new CustomEvent('forum-global-collapse', {
      detail: { collapse: shouldCollapse }
    });
    window.dispatchEvent(event);
  };


  if (isLoading) return <div>Loading simulated thread...</div>;

  return (
    <div className="forum-page-container">
      {mainPost && (
        <div className="main-post-card">
          <div className="comment-main-flex">
            <div className="comment-avatar-column">
              <div className="comment-user-avatar main-post-avatar">
                {mainPost.creator ? mainPost.creator.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="comment-body-column">
              <div className="comment-header">
                <div className="comment-user-info">
                  <span className="comment-display-name">User Name</span>
                  <span className="comment-author">@{mainPost.creator}</span>
                </div>
                <div className="comment-header-right">
                  <span className="comment-timestamp">8 hrs ago</span>
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
        <textarea className="add-comment-input" placeholder="Add to the discussion..." value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} />
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
