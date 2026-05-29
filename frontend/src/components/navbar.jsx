import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

import { useContext } from 'react';
import { DarkModeContext } from '../DarkModeContext.jsx'

const Navbar = ({ user }) => {
  const location = useLocation();

  const { darkModeOn, toggleDarkMode } = useContext(DarkModeContext);
  console.log(darkModeOn);

  const links = [
    { path: "/forums", label: "Discuss" },
    { path: "/discover", label: "Discover" },
    { path: `/dashboard/${user.id}`, label: "My Dashboard" },
    { path: "/inbox", label: "Inbox" },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-top">
        <Link style={{'textDecoration': 'none'}} to="/forums"><div className="sidebar-logo">Spotifeed ♪</div></Link>
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
      <button onClick={toggleDarkMode} className="darkmode-toggle-button" style={darkModeOn ? ({'backgroundColor':'#676767', color: 'white'}):({'backgroundColor':'white'})}>
        {darkModeOn ? "Dark Mode: On" : "Dark Mode: Off"}
      </button>
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
