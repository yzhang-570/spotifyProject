import '../styles/dashboard.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import EditProfileModal from '../components/editProfileModal';
import ConnectionsModal from '../components/connectionsModal';
import { getFirebaseUser, updateProfile } from '../api';

const Dashboard = ({ currentUser }) => {
  
  const navigate = useNavigate();

  const params = useParams()
  const [editProfileModalShown, setEditProfileModalShown] = useState(false);
  const [connectionsModalShown, setConnectionsModalShown] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);

  const [userNotFound, setUserNotFound] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (params.userID) {
        const userDocument = await getFirebaseUser(params.userID);

        if (userDocument === null) setUserNotFound(true);

        setUserProfileData(userDocument);
      }
    };
    loadProfile();
  }, [params]);

  if (userNotFound) return <p style={{ color: 'white', padding: '2rem' }}>User not found.</p>;
  if (!userProfileData) return <p style={{ color: 'white', padding: '2rem' }}>Loading...</p>;

  const handleFollow = (otherUserID) => {
    console.log(otherUserID);
  }

  const handleSaveProfile = async (updatedUserProfileData) => {
    console.log('saving:', updatedUserProfileData);
    try {
      const result = await updateProfile(updatedUserProfileData);
      console.log('result:', result);
      setUserProfileData((prev) => ({ ...prev, ...updatedUserProfileData }));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }

  return (
    <main className="dashboard">
      <div className="background-gradient" />
      <div className="left-div">
        <section className="profile-div">

          {/* Profile Image */}
          <div className="profile-image-mask">
            <img
              className="profile-image"
              src={userProfileData.profilePicture || 'https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg'}
              alt="User Profile Image"
            />
          </div>

          <div className="profile-info-div">

            {/* Name, Username */}
            <p className="displayname-text">
              <strong>{userProfileData.displayName}</strong> <br/>
              <span className="xs">{userProfileData.email}</span>
            </p>

            {/* Follower + Following Counts */}
            <div className="stats-div">
              <p className="m stat-text" onClick={() => setConnectionsModalShown(true)}>
                <strong>{userProfileData.following?.length || 0}</strong> <br/>
                <span className="xs">Following</span>
              </p>
              <p className="m stat-text" onClick={() => setConnectionsModalShown(true)}>
                <strong>{userProfileData.followers?.length || 0}</strong> <br/>
                <span className="xs">Followers</span>
              </p>
            </div>

            {/* Description */}
            <p className="xs">{userProfileData.bio || ''}</p>

            {/* Buttons */}
            <div className="buttons-div">
              {currentUser.id === params.userID ?
                (<button onClick={() => setEditProfileModalShown(true)} className="follow-button profile-action-button">Edit Profile</button>)
                :
                (<>
                  <button onClick={() => handleFollow()} className="follow-button profile-action-button">Follow</button>
                  <button onClick={() => navigate('/inbox')} className="message-button profile-action-button">Message</button>
                </>)
              }
            </div>
          </div>
        </section>

        {/* Top Songs, Top Artists, and Liked Songs */}
        {(userProfileData && !userProfileData.isPrivate)
        ?
        (<section className={"collectionsection-div"} >

          {!userProfileData.top_songs_isPrivate && (
            <button onClick={() => navigate('/top-songs')} className="collection-div"
              style={{'--div-color': "#648DA4", '--div-color-hover': "#517184"}}>
              <ArrowRight className="arrow-icon" color="#ffffff" />
              <h3 className="collection-name-text">Top Songs</h3>
            </button>
          )}

          {!userProfileData.top_artists_isPrivate && (
            <button onClick={() => navigate('/top-artists')} className="collection-div"
              style={{'--div-color': "#A46488", "--div-color-hover": "#83506d"}}>
              <ArrowRight className="arrow-icon" color="#ffffff" />
              <h3 className="collection-name-text">Top Artists</h3>
            </button>
          )}

          {!userProfileData.liked_songs_isPrivate && (
            <button onClick={() => navigate('/liked-songs')}
              style={{'--div-color': "#87AB72", '--div-color-hover': "#729161"}}
              className="collection-div">
              <ArrowRight className="arrow-icon" color="#ffffff" />
              <h3 className="collection-name-text">Liked Songs</h3>
            </button>
          )}

        </section>
        )
        :
        (<p>This profile is private.</p>)}
      </div>

      {/* Recent Activity - Forum Posts */}
      <section className="recentactivity-div">
        <p className="recentactivity-titletext">Recent Activity</p>
        {[].map(forumPost =>
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
        initialProfile={userProfileData}
        onClose={() => setEditProfileModalShown(false)}
        onSave={(updated) => {
          handleSaveProfile(updated);
          setEditProfileModalShown(false);
        }}
      />

      {/* Followers/Following Popup */}
      <ConnectionsModal
        isOpen={connectionsModalShown}
        onClose={() => setConnectionsModalShown(false)}
      />
    </main>
  );
};

export default Dashboard;