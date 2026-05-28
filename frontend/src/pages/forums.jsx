import { Link } from "react-router-dom"

const Forums = () => {
  return  (
    <div>
      <h1 className="page-title">Forums</h1>

      <Link to="/forums/thread_spotify_123" className="forum-link">
        Go to Example Spotify Thread
      </Link>
    </div>
  );
};

export default Forums;