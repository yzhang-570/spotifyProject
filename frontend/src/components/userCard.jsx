import "../pages/discover.css";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

const UserCard = ({ userData }) => {
  return (
    <article
      className="user-card"
    >
      <div className="user-card-header">
        <div className="user-avatar">
          <img src={userData.profilePicture} alt={`${userData.display_name} avatar`} />
        </div>

        <div className="user-identity">
          <h2>{userData.displayName}</h2>
          <p className="username">Spotify ID:{userData.spotifyId}</p>
        </div>

        <span className={`public-badge${userData.is_private ? " is-private" : ""}`}>
          {userData.isPrivate ? "Private" : "Public"}
        </span>
      </div>

      <div className="user-card-content">
        <p className={`user-bio${userData.bio ? "" : " is-empty"}`}>
          {userData.bio || "[Bio is empty]"}
        </p>

        <dl className={`music-preview${userData.is_private ? " is-private" : ""}`}>
          
          {/* && userData.id !== loggedInUser.id */}
          {userData.isPrivate ? (
            <div className="music-preview-lock">
              <Lock size={16} aria-hidden="true" />
              <span>Private</span>
            </div>
          )
          :
          (
            <>
              <div>
                <dt>Top artist</dt>
                {userData.top_artists_isPrivate ? (
                  <dd className="is-empty">Private</dd>
                ) : userData.topArtists?.length ? (
                  <dd>{userData.topArtists[0].name}</dd>
                ) : (
                  <dd className="is-empty">None</dd>
                )}
              </div>

              <div>
                <dt>Top song</dt>
                {userData.top_songs_isPrivate ? (
                  <dd className="is-empty">Private</dd>
                ) : userData.topSongs?.length ? (
                  <dd>{userData.topSongs[0].name}</dd>
                ) : (
                  <dd className="is-empty">None</dd>
                )}
              </div>
            </>
          )}
        </dl>

        <div className="user-actions">
          <Link className="primary-action" to={`/dashboard/${userData.id}`}>
            View Profile
          </Link>
          <Link className="secondary-action" to="/inbox">
            Message
          </Link>
        </div>
      </div>
    </article>
  )
};

export default UserCard;