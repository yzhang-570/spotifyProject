import { useNavigate } from "react-router-dom";
import "./connectionsModal.css"

import { useState } from 'react'

const connectionsModal = ({ isOpen, onClose }) => {

  const [tabSelected, setTabSelected] = useState("Followers");
  const navigate = useNavigate();

  // hide if not open
  if(!isOpen) return null;

  // todo: add loading

  return (
    /* black overlay */
    <div className="connections-modal-overlay">

      {/* modal card */}
      <div className="connections-modal">

        <header className="connections-modal-header">
          <h3>[Username]</h3>
          <button type="button" className="connections-modal-closeX" onClick={onClose} aria-label="Close">
              ×
          </button>
        </header>

        {/* Tab Options (Followers, Following) */}
        <div className="connections-modal-tabs">
          <h2 className="xs connections-modal-tab-option"
            onClick={() => setTabSelected('Followers')}
            style={(tabSelected === 'Followers') ? ({'--tab-option-color': 'var(--accent-green)'}) : ({'--tab-option-color': '#ffffff79'})}>
            X Followers
          </h2>
          <h2 className="xs connections-modal-tab-option"
            onClick={() => setTabSelected('Following')}
            style={(tabSelected === 'Following') ? ({'--tab-option-color': 'var(--accent-green)'}) : ({'--tab-option-color': '#ffffff79'})}>
            X Following
          </h2>
        </div>

        {/* List of Profiles */}
        <article>
          <div className="preview-user-information">
            <div className="preview-image-mask">
              <image className="preview-image" src="" />
            </div>
            <div className="preview-user-information">
                <p>Name</p>
                <p>@username</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="preview-actions">

            {/* todo: navgiate to user's dm */}
            <button onClick={() => navigate('/inbox')}>Message</button>

            {/* todo: popup confirm remove follower/unfollow */}
            <button className="connections-modal-closeX" onClick={() => {}} aria-label="Close">
              ×
            </button>
          </div>
        </article>
        
      </div>

      <section className>

      </section>

    </div>
  )
};

export default connectionsModal;