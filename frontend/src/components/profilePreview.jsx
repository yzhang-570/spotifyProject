import { useNavigate } from "react-router-dom";

import "./profilePreview.css"

const ProfilePreview = ({ userData }) => {

  // user id: userData.userID
  const navigate = useNavigate();

  return (
    <article className="preview-user-card">
      <div className="preview-user-information">
        <div className="preview-image-mask">
          <img className="preview-image" src={userData.profileImageURL} />
        </div>
        <div className="preview-user-details">
            <p className="xs bold">{userData.displayName}</p>
            {/* <p className="xs">{userData.email}</p> */}
        </div>
      </div>

      {/* Buttons */}
      <div className="preview-actions">
        {/* todo: navgiate to user's dm using userID */}
        <button className="preview-message-button" onClick={() => navigate('/inbox')}>Message</button>
        {/* todo: popup confirm remove follower/unfollow using userID */}
        <button className="connections-modal-closeX" onClick={() => {}} aria-label="Close">
          ×
        </button>
      </div>
    </article>
  )
};

export default ProfilePreview;