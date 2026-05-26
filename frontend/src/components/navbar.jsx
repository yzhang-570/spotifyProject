import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const location = useLocation();

  const links = [
    { path: "/discover", label: "Discover" },
    { path: "/dashboard", label: "My Dashboard" },
    { path: "/inbox", label: "Inbox" },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">Spotifeed ♪</div>
        <ul className="sidebar-links">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={location.pathname === link.path ? "active" : ""}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-user">
        {user?.images?.length > 0 ? (
            <img
                src={user.images[0].url}
                alt="avatar"
                className="sidebar-avatar-img"
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
        ) : (
            <div className="sidebar-avatar-placeholder" />
        )}
        <div className="sidebar-user-info">
            <span className="sidebar-name">{user?.display_name}</span>
            <span className="sidebar-username">{user?.email}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;