import '../styles/dashboard.css'

import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

import axios from 'axios';

import EditProfileModal from '../components/editProfileModal';
import ConnectionsModal from '../components/connectionsModal';

import { getFirebaseUser, updateProfile } from '../api';

const Dashboard = ({ loggedInUser }) => {
  
  const navigate = useNavigate();
  const params = useParams()
  // params.userID = id of user being viewed

  const [editProfileModalShown, setEditProfileModalShown] = useState(false);
  const [connectionsModalShown, setConnectionsModalShown] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);

  const [refresh, setRefresh] = useState(false); // toggle refresh

  const [userFollowersData, setUserFollowersData] = useState([]);
  const [userFollowingData, setUserFollowingData] = useState([]);
  const [following, setFollowing] = useState(false);

  const [userNotFound, setUserNotFound] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (params) {
        const [userDocument, followersResponse, followingResponse] = await Promise.all([
          getFirebaseUser(params.userID),
          axios.get(`http://localhost:8888/users/${params.userID}/following`),
          axios.get(`http://localhost:8888/users/${params.userID}/followers`)
        ]);

        // if profile doesn't belong to logged in user, add following status
        if (loggedInUser && loggedInUser.id !== params.userID) {
          const isFollowing = axios.get(`http://localhost:8888/users/${loggedInUser.id}/following/${params.userID}`);
          if (isFollowing) {
            setFollowing(true);
          }
          else {
            setFollowing(false);
          }
        }
        if (userDocument === null) setUserNotFound(true);

        setUserProfileData(userDocument);
        setUserFollowersData(followersResponse.data);
        setUserFollowingData(followingResponse.data);
      }
    };
    loadProfile();
  }, [params, refresh]);

  if (userNotFound) return <p style={{ color: 'white', padding: '2rem' }}>User not found.</p>;
  if (!userProfileData) return <p style={{ color: 'white', padding: '2rem' }}>Loading...</p>;

  console.log('following: ', following);

  const handleFollow = async () => {

    try {
      if (following) {
        console.log('attempting to unfollow');
        const response = await axios.delete(`http://localhost:8888/users/${loggedInUser.id}/following/${params.userID}`)
      }
      else {
        console.log('attempting to unfollow');
        const response = await axios.post(`http://localhost:8888/users/${loggedInUser.id}/following/${params.userID}`)
      }
      // console.log('status: ', response.status);
      setRefresh(!refresh);
    }
    catch (error) {
      console.log(`(React) Error occurred when attempting to create a follow: ${error}`);
    }
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

  console.log(userFollowersData);
  console.log(userFollowingData);

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
              {loggedInUser && loggedInUser.id === params.userID
              ?
              (<button onClick={() => setEditProfileModalShown(true)} className="follow-button profile-action-button">Edit Profile</button>)
              :
              (<>
                <button onClick={handleFollow} className="follow-button profile-action-button"
                  style={following ? ({'color': 'var(--accent-green)', 
                    'border': '1px solid var(--accent-green)', 'backgroundColor': 'transparent'}):({})}>
                  {following ? "Unfollow":"Follow"}
                </button>
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