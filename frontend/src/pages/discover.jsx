import { useMemo, useState, useEffect, useContext } from "react";
import { DarkModeContext } from '../DarkModeContext'
import "./discover.css";
import axios from 'axios';

import UserCard from '../components/userCard.jsx'

const Discover = () => {
  const [usersData, setUsersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { darkModeOn } = useContext(DarkModeContext);

  console.log('darkModeOn from discover', darkModeOn);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get('http://localhost:8888/users');
      setUsersData(response.data);
    }
    getData();
  }, [])

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return usersData;
    }

    return usersData.filter((user) => {
      const searchableText = [
        user.displayName,
        user.email,
        user.bio,
        // user.top_artists, - or get top artist/song and filter by -> spotify doesn't seem to have rankings (?)
        // user.top_songs
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [searchTerm, usersData]);

  console.log('usersData', usersData);
  console.log('filteredUsers', filteredUsers);
  // console.log(searchTerm);

  return (
    <section className="discover-page">
      <div className="discover-header">
        <p className="discover-kicker">Public profiles</p>
        <h1 id="discover-text">Discover Other Users</h1>
        <p id="discover-text">
          Browse listeners, compare favorite artists, and start a conversation
          around the music they love.
        </p>
      </div>

      <div className="discover-toolbar">
        <div className="discover-search">
          <label id="discover-text" htmlFor="discover-user-search">Search public profiles</label>
          <input
            id="discover-user-search"
            type="search"
            placeholder="Search by name, genre, artist, or song"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="discover-result-count">
          <strong id="discover-text-color">{filteredUsers.length}</strong>
          <span id="discover-text-color">
            {filteredUsers.length === 1 ? "profile found" : "profiles found"}
          </span>
        </div>
      </div>

      {usersData &&
        <div className="discover-grid" aria-live="polite">
          {filteredUsers.map((userData) => (
            <div key={userData.id}>
                <UserCard userData={userData}/>
            </div>
          ))}
        </div>
      }

      {filteredUsers.length === 0 && (
        <p className="empty-discover-state">No users found.</p>
      )}
    </section>
  );
};

export default Discover;
