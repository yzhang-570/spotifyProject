import "./profilePreview.css"

import { useNavigate } from "react-router-dom";

const ProfilePreview = ({ userData, onClick }) => {

  const navigate = useNavigate();

  const handleNavInbox = () => {
    navigate('/inbox');
  }

  return (
    <article className="preview-user-card" onClick={() => onClick(userData.id)}>
      <div className="preview-user-information">
        <div className="preview-image-mask">
          <img className="preview-image" src={userData.profilePicture} />
        </div>
        <div className="preview-user-details">
            <p className="xs bold">{userData.displayName}</p>
            {/* <p className="xs">{userData.email}</p> */}
        </div>
      </div>

      {/* Buttons */}
      <div className="preview-actions">
        {/* todo: navgiate to user's dm using userID */}
        <button className="preview-message-button" onClick={handleNavInbox}>Message</button>
        {/* todo: popup confirm remove follower/unfollow using userID */}
        {/* <button className="connections-modal-closeX" onClick={() => {}} aria-label="Close">
          ×
        </button> */}
      </div>
    </article>
  )
};

export default ProfilePreview;