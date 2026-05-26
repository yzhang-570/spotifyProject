import '../styles/dashboard.css'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';

// Icons
import { ArrowRight } from 'lucide-react';

const Dashboard = () => {

  const navigate = useNavigate();

  // User's Forum Activity... most recent 3 comments/forum posts (or less)
  const [forumActivityData, setForumActivityData] = useState([
    {
      'id': 'someID',  // forum post document ID
      'forumTitle': '#ForumTitle',
      'forumContent': '(Content) Forum post content lalala...'
    },
    //     {
    //   'id': 'someID',  // forum post document ID
    //   'forumTitle': '#ForumTitle',
    //   'forumContent': '(Content) Forum post content lalala...'
    // },
    //     {
    //   'id': 'someID',  // forum post document ID
    //   'forumTitle': '#ForumTitle',
    //   'forumContent': '(Content) Forum post content lalala...'
    // }
  ])
  
  useEffect(() => {
    // load formum activity data
  }, [])

  const handleFollow = (otherUserID) => {
    // make current user follow user with ID, otherUserID
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
            <p className="displayname-text"><strong>Name</strong> <br/> @username</p>

            {/* Follower + Following Counts */}
            <div className="stats-div">
              {/* todo: open a popup showing following + followers */}
              <p className="m stat-text"><strong>27</strong> <br/> <span className="s">Following</span></p>
              <p className="m stat-text"><strong>1.1k+</strong> <br/> <span className="s">Followers</span></p>
            </div>

            {/* Description */}
            <p>Description lalalalaal hi! My name is [name] and...sdfgfgdgdgfdgfgdhgfdhfghfdhghdhghdfsd</p>

            {/* Follow + Message Buttons */}
            {/* todo: show edit profile instead if is current user */}
            <div className="buttons-div">
              {true === true ?
              // actual condition should be: if logged in user = user profile being viewed
              (<button onClick={() => handleFollow()} className="follow-button profile-action-button">Edit Profile</button>)
              :
              (<>
                <button onClick={() => handleFollow()} className="follow-button profile-action-button">Follow</button>
                {/* todo: update to pass in user's id */}
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

    </main>
  )
};

export default Dashboard;