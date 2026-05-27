import '../styles/dashboard.css'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';

// Icons
import { ArrowRight } from 'lucide-react';

// Components
import EditProfileModal from '../components/editProfileModal';
import ConnectionsModal from '../components/connectionsModal'

const Dashboard = () => {

  const navigate = useNavigate();

  const [editProfileModalShown, setEditProfileModalShown] = useState(false);
  const [connectionsModalShown, setConnectionsModalShown] = useState(false);

  // User's Profile Information; holds "final" profile changes...
  const [userProfileData, setUserProfileData] = useState(
    {
      'displayName': 'Name',
      'username': '@username', // note: username cannot be modified (tied to Spotify)
      'bio': 'Description lalalalaal hi! My name is [name] and...sdfgfgdgdgfdgfgdhgfdhfghfdhghdhghdfsd',
      'isPrivate': false,
      'top_songs_isPrivate': false,
      'top_artists_isPrivate': false,
      'liked_songs_isPrivate': false
    }
  )

  // User's Forum Activity... most recent 3 comments/forum posts (or less)
  const [forumActivityData, setForumActivityData] = useState([
    {
      'id': 'someID',  // forum post document ID
      'forumTitle': '#ForumTitle',
      'forumContent': '(Content) Forum post content lalala...'
    },
  ])
  
  useEffect(() => {
    // load forum activity data
    // load user profile data
  }, [])

  const handleFollow = (otherUserID) => {
    // make current user follow user with ID, otherUserID
  }

  const handleSaveProfile = (updatedUserProfileData) => {
    console.log('Save profile', updatedUserProfileData);
    // try catch - if failed (assume 400/500 causes error), don't set the user profile and show error

    // save the profile to db
    // set displayed profile data to returned (updated) data; -> automatically triggers refresh
  }

  return (
    <main className="dashboard">
      <div className="background-gradient" />
      <div className="left-div">
        <section className="profile-div">

          {/* Profile Image */}
          <div className="profile-image-mask">
            <img className="profile-image" src="https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg"
              alt="User Profile Image"/>
          </div>

          <div className="profile-info-div">

            {/* Name, Username */}
            <p className="displayname-text"><strong>{userProfileData.displayName}</strong> <br/> <span className="xs">{userProfileData.username}</span></p>

            {/* Follower + Following Counts */}
            <div className="stats-div">
              {/* todo: open a popup showing following + followers */}
              <p className="m stat-text" onClick={() => setConnectionsModalShown(true)}>
                <strong>27</strong> <br/> <span className="xs">Following</span>
              </p>
              <p className="m stat-text" onClick={() => setConnectionsModalShown(true)}>
                <strong>1.1k+</strong> <br/> <span className="xs">Followers</span>
              </p>
            </div>

            {/* Description */}
            <p className="xs">{userProfileData.bio}</p>

            {/* Follow + Message Buttons */}
            {/* todo: show edit profile instead if is current user */}
            <div className="buttons-div">
              {true === true ?
              // actual condition should be: if logged in user = user profile being viewed
              (<button onClick={() => setEditProfileModalShown(true)} className="follow-button profile-action-button">Edit Profile</button>)
              :
              (<>
                <button onClick={() => handleFollow()} className="follow-button profile-action-button">Follow</button>
                {/* todo: update to pass in user's id; follow or unfollow depending on if alr following */}
                <button onClick={() => navigate('/inbox')} className="message-button profile-action-button">Message</button>
                {/* todo: update to navigate to chat another user */}
              </>)
              }
            </div>
          </div>
        </section>

        {/* Top Songs, Top Artists, and Liked Songs */}
        <section className="collectionsection-div">
          
          <button onClick={() => navigate('/top-songs')} className="collection-div"
            style={{'--div-color': "#648DA4", '--div-color-hover': "#517184"}}>
            <ArrowRight className="arrow-icon" color="#ffffff" />
            <h3 className="collection-name-text">Top Songs</h3>
          </button>

          <button onClick={() => navigate('/top-artists')} className="collection-div"
            style={{'--div-color': "#A46488", "--div-color-hover": "#83506d"}}>
            <ArrowRight className="arrow-icon" color="#ffffff" />
            <h3 className="collection-name-text">Top Artists</h3>
          </button>

          <button onClick={() => navigate('/liked-songs')}
            style={{'--div-color': "#87AB72", '--div-color-hover': "#729161"}}
            className="collection-div">
            <ArrowRight className="arrow-icon" color="#ffffff" />
            <h3 className="collection-name-text">Liked Songs</h3>
          </button>

        </section>
      </div>

      {/* Recent Activity - Forum Posts */}
      <section className="recentactivity-div">
        <p className="recentactivity-titletext">Recent Activity</p>
        {/* todo: navigate to forum post on click */}
        {forumActivityData.map(forumPost => 
          (<article key={forumPost.id} className="forumpost-div">
            <p className="black forum-titletext-small">{forumPost.forumTitle}</p>
            <p className="black"><strong>{forumPost.forumContent}</strong></p>
            <ArrowRight color="#000000" />
          </article>)
        )}
      </section>

      {/* Edit Profile Popup */}
      <EditProfileModal
        isOpen={editProfileModalShown}
        // todo: replace with profile that is currently loaded...
        initialProfile={userProfileData}
        onClose={() => setEditProfileModalShown(false)}
        onSave={(updated) => {
          handleSaveProfile(updated);   // should handle: persist to backend, then update displayed profile data -> add a refresh in dashboard
          setEditProfileModalShown(false);
        }}
      />

      {/* Followers/Following Popup */}
      <ConnectionsModal 
        isOpen={connectionsModalShown}
        onClose={() => setConnectionsModalShown(false)}
      />

    </main>
  )
};

export default Dashboard;

/*
dashboard - opens form; owns:
- form open/closed
- display persisted profile data
  - SO also handles db interaction, updating persisted profile data (**directly triggers auto refresh**)

- pass callback to updated **form open/closed**
- pass persisted profile data
- pass form open/closed status
- pass callback to update **persisted profile data**

edit profile form; owns:
- display of form based on form open/closed
- updating temporary/in progress form changes
  - when open, or persistent profile data changes
- call callback to close in parent
*/