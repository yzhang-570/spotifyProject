import ProfilePreview from './profilePreview.jsx'
import "./connectionsModal.css"

import { useNavigate } from "react-router-dom";

const ConnectionsModal = ({ userData, tabSelected, updateTab, isOpen, onClose, displayedData, followersData, followingData }) => {

  const navigate = useNavigate();

  const handleNavigateToProfile = (userID) => {
    navigate(`/dashboard/${userID}`);
    onClose();
  }

  // hide if not open
  if(!isOpen) return null;

  // todo: add loading

  return (
    /* black overlay */
    <div className="connections-modal-overlay" onClick={onClose}>

      {/* modal card */}
      <div className="connections-modal" onClick={(e) => (e.stopPropagation())}>

        <header className="connections-modal-header">
          <h3 className="connections-modal-header-text">{userData.displayName}</h3>
          <button type="button" className="connections-modal-closeX" onClick={onClose} aria-label="Close">
              ×
          </button>
        </header>

        {/* Tab Options (Followers, Following) */}
        <div className="connections-modal-tabs">
          <h2 className="xs connections-modal-tab-option"
            onClick={(e) => {e.stopPropagation(); updateTab('Followers')}}
            style={(tabSelected === 'Followers') ? ({'--tab-option-color': 'var(--accent-color)', 'borderBottom': '2px solid var(--tab-option-color)'}) : ({'--tab-option-color': 'var(--tab-inactive-color)'})}>
            {followersData && followersData.length} Followers
          </h2>
          <h2 className="xs connections-modal-tab-option"
            onClick={(e) => {e.stopPropagation(); updateTab('Following')}}
            style={(tabSelected === 'Following') ? ({'--tab-option-color': 'var(--accent-color)', 'borderBottom': '2px solid var(--tab-option-color)'}) : ({'--tab-option-color': 'var(--tab-inactive-color)'})}>
            {followingData && followingData.length} Following
          </h2>
        </div>

        <div className="connections-modal-preview-list">
          {/* List of Profiles */}
          {displayedData.length > 0 ? 
          (displayedData.map(userData => 
            (<div key={userData.id}>
              <ProfilePreview userData={userData} onClick={(userID) => handleNavigateToProfile(userID)}/>
            </div>)
          ))
          :
          (<div className="connections-modal-preview-empty-div">
            <p style={{'color': 'gray'}}>No {tabSelected.toLowerCase()} yet</p>
          </div>)
          }
        </div>
        
      </div>

    </div>
  )
};

export default ConnectionsModal;