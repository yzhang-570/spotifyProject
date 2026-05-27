import ProfilePreview from './profilePreview.jsx'
import "./connectionsModal.css"

import { useState } from 'react'

const ConnectionsModal = ({ isOpen, onClose }) => {

  const [tabSelected, setTabSelected] = useState("Followers");

  // todo: move to dashboard; fetch on display and pass as prop

  // list of users the current user's followers
  // const [followers, setFollowers] = useState([]);
  const followers =   
  [
    {
      'userID': 1,
      'displayName': 'a follower',
      'email': '@follower_username',
      'profileImageURL': 'https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg'
    }
  ]

  // list of users the current user is following
  // const [following, setFollowing] = useState([])
  const following = [
    {
      'userID': 1,
      'displayName': 'a following 1',
      'email': '@following_username',
      'profileImageURL': 'https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg'
    },
    {
      'userID': 2,
      'displayName': 'a following 2',
      'email': '@following_username',
      'profileImageURL': 'https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg'
    },
    {
      'userID': 3,
      'displayName': 'a following 3',
      'email': '@following_username',
      'profileImageURL': 'https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg'
    },
    {
      'userID': 4,
      'displayName': 'a following 3',
      'email': '@following_username',
      'profileImageURL': 'https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg'
    },
    {
      'userID': 5,
      'displayName': 'a following 3',
      'email': '@following_username',
      'profileImageURL': 'https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg'
    },
    {
      'userID': 6,
      'displayName': 'a following 3',
      'email': '@following_username',
      'profileImageURL': 'https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg'
    }
  ];

  console.log(tabSelected);

  // hide if not open
  if(!isOpen) return null;

  // todo: add loading

  return (
    /* black overlay */
    <div className="connections-modal-overlay">

      {/* modal card */}
      <div className="connections-modal">

        <header className="connections-modal-header">
          <h3 className="connections-modal-header-text">[Username]</h3>
          <button type="button" className="connections-modal-closeX" onClick={onClose} aria-label="Close">
              ×
          </button>
        </header>

        {/* Tab Options (Followers, Following) */}
        <div className="connections-modal-tabs">
          <h2 className="xs connections-modal-tab-option"
            onClick={() => setTabSelected('Followers')}
            style={(tabSelected === 'Followers') ? ({'--tab-option-color': 'var(--accent-green)', 'borderBottom': '2px solid var(--tab-option-color)'}) : ({'--tab-option-color': '#ffffff79'})}>
            X Followers
          </h2>
          <h2 className="xs connections-modal-tab-option"
            onClick={() => setTabSelected('Following')}
            style={(tabSelected === 'Following') ? ({'--tab-option-color': 'var(--accent-green)', 'borderBottom': '2px solid var(--tab-option-color)'}) : ({'--tab-option-color': '#ffffff79'})}>
            X Following
          </h2>
        </div>

        <div className="connections-modal-preview-list">
          {/* List of Profiles */}
          {(tabSelected === 'Followers' ? (followers) : (following)).map(userData => 
            (<div key={userData.userID}>
              <ProfilePreview userData={userData} />
            </div>)
          )}
        </div>
        
      </div>

      {/* <section className>

      </section> */}

    </div>
  )
};

export default ConnectionsModal;