import '../styles/dashboard.css'

import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';

import axios from 'axios';

import EditProfileModal from '../components/editProfileModal';
import ConnectionsModal from '../components/connectionsModal';
import CollectionsSection from '../components/collectionsSection';

import { ArrowRight } from 'lucide-react';

import { getFirebaseUser, updateProfile } from '../api';

const recentActivityMock =  [
  {
    'id': 'someID1',  // forum post document ID
    'forumTitle': '#ForumTitle',
    'forumContent': '(Content) 1 Forum post content lalala...'
  },
  {
    'id': 'someID2',  // forum post document ID
    'forumTitle': '#ForumTitle',
    'forumContent': '(Content) 2 Forum post content lalala...'
  },
      {
    'id': 'someID3',  // forum post document ID
    'forumTitle': '#ForumTitle',
    'forumContent': '(Content) 3 Forum post content lalala...'
  }
]

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
  const [collectionsPreviewShown, setCollectionsPreviewShown] = useState(false);

  const isOwnProfile = loggedInUser?.id === params?.userID;

  // Fetch user data on load
  useEffect(() => {

    // Checks if current user is following user being viewed
    const updateFollowingStatus = async () => {
      // if profile doesn't belong to logged in user, add following status
      if (loggedInUser && loggedInUser.id !== params.userID) {
        const response = await axios.get(`http://localhost:8888/users/${loggedInUser.id}/following/${params.userID}`);
        const isFollowing = response.data.isFollowing;
        if (isFollowing) {
          setFollowing(true);
        }
        else {
          setFollowing(false);
        }
      }
    }

    // Loads user profile data and following, follower lists
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

  // Displays if user doesn't exist
  if (userNotFound) return <p style={{ color: 'white', padding: '2rem' }}>User not found.</p>;

  // Displays while fetching user profile data
  if (!userProfileData) return <p style={{ color: 'white', padding: '2rem' }}>Loading...</p>;

  // Handles follows/unfollows
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

  // Handles updating edited profile data
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

  console.log(userProfileData);

  return (
    <main className="dashboard">
      <div className="background-gradient" />
      <div className="left-div">
        <section className="profile-div">

          {/* Profile Image */}
          <div className="profile-image-mask">
            <img
              className="profile-image"
              src={userProfileData.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR99-ZMZeEtYlFVdT-HN3Hz0f_i64Zf76D67g&s'}
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
              {isOwnProfile
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
        {!userProfileData?.isPrivate
          ? (<CollectionsSection userProfileData={userProfileData} />)
          : (<p>This profile is private.</p>)
        }

        {/* Own-profile preview: shows every collection regardless of privacy. Does not change saved settings. */}
        {isOwnProfile && userProfileData?.isPrivate && (
          <div className="collections-preview-div">
            <button
              onClick={() => setCollectionsPreviewShown(prev => !prev)}
              className="collections-preview-button">
              {collectionsPreviewShown ? 'Hide my collections' : 'View my collections (only you can see this)'}
            </button>
            {collectionsPreviewShown && (
              <CollectionsSection userProfileData={userProfileData} showAll />
            )}
          </div>
        )}
      </div>

      {/* Recent Activity - Forum Posts */}
      <section className="recentactivity-div">
        <p className="recentactivity-titletext">Recent Activity</p>
        {recentActivityMock.map(forumPost =>
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