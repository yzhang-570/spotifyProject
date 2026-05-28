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

  const [userFollowersData, setUserFollowersData] = useState([]);
  const [userFollowingData, setUserFollowingData] = useState([]);
  const [following, setFollowing] = useState(true);
  const [tabSelected, setTabSelected] = useState("");

  const [userNotFound, setUserNotFound] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const updateFollowingStatus = async () => {
      console.log('update following status');
      // if profile doesn't belong to logged in user, add following status
      if (loggedInUser && loggedInUser.id !== params.userID) {
        console.log('checking following status');
        const response = await axios.get(`http://localhost:8888/users/${loggedInUser.id}/following/${params.userID}`);
        console.log('following response', response);
        const isFollowing = response.data.isFollowing;
        if (isFollowing) {
          console.log('setting following true')
          setFollowing(true);
        }
        else {
          console.log('setting following false');
          setFollowing(false);
        }
      }
    }

    const loadProfile = async () => {
      if (params) {
        const [userDocument, followingResponse, followersResponse] = await Promise.all([
          getFirebaseUser(params.userID),
          axios.get(`http://localhost:8888/users/${params.userID}/following`),
          axios.get(`http://localhost:8888/users/${params.userID}/followers`)
        ]);
        if (userDocument === null) setUserNotFound(true);
        await updateFollowingStatus();

        setUserProfileData(userDocument);
        setUserFollowingData(followingResponse.data);
        setUserFollowersData(followersResponse.data);
      }
    };
    loadProfile();
  }, [params.userID, refresh]);

  if (userNotFound) return <p style={{ color: 'white', padding: '2rem' }}>User not found.</p>;
  if (!userProfileData) return <p style={{ color: 'white', padding: '2rem' }}>Loading...</p>;

  console.log('following: ', following);

  const handleFollow = async () => {
    try {
      if (following) {
        console.log('attempting to unfollow');
        await axios.delete(`http://localhost:8888/users/${loggedInUser.id}/following/${params.userID}`);
        console.log('unfollowed');
      }
      else {
        console.log('attempting to follow');
        await axios.post(`http://localhost:8888/users/${loggedInUser.id}/following/${params.userID}`);
        console.log('followed');
      }
      // console.log('status: ', response.status);
      console.log('triggering refresh');
      setRefresh(prev => !prev);
      console.log('done updating');
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

  console.log('followers', userFollowersData);
  console.log('following', userFollowingData);

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
              <span className="xs">Spotify ID: {userProfileData.spotifyId}</span>
            </p>

            {/* Follower + Following Counts */}
            <div className="stats-div">
              <p className="m stat-text" onClick={() => {setConnectionsModalShown(true); setTabSelected('Followers')}}>
                <strong>{userFollowersData?.length || 0}</strong> <br/>
                <span className="xs">Followers</span>
              </p>
              <p className="m stat-text" onClick={() => {setConnectionsModalShown(true); setTabSelected('Following')}}>
                <strong>{userFollowingData?.length || 0}</strong> <br/>
                <span className="xs">Following</span>
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
          {
            userProfileData.top_songs_isPrivate && userProfileData.top_artists_isPrivate
            && userProfileData.liked_songs_isPrivate && (
              <div className="collectionsection-is-empty">
                <p style={{'color': '#999999'}}>No collections displayed.</p>
              </div>
            )
          }
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
        tabSelected={tabSelected}
        userData={userProfileData}
        displayedData={tabSelected === 'Followers' ? (userFollowersData) : (userFollowingData)}
        followingData={userFollowingData}
        followersData={userFollowersData}
        updateTab={(newSelectedTab) => setTabSelected(newSelectedTab)}
        onClose={() => setConnectionsModalShown(false)}
      />
    </main>
  );
};

export default Dashboard;