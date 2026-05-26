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
        <div className="sidebar-avatar" />
        <div className="sidebar-user-info">
            <span className="sidebar-name">{user?.display_name}</span>
            <span className="sidebar-username">{user?.email}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;