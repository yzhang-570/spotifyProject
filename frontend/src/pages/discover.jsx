import { useMemo, useState, useEffect } from "react";
import "./discover.css";
import axios from 'axios';

import UserCard from '../components/userCard.jsx'

// const publicUsers = [
//   {
//     id: "maya",
//     display_name: "Maya Chen",
//     email: "maya.chen@example.com",
//     bio: "Late-night synth pop, soft R&B, and new albums on repeat.",
//     top_artists: [{ name: "SZA" }],
//     top_songs: [{ name: "Good Days" }],
//     profile_img: "https://i.pravatar.cc/160?u=maya",
//     is_private: false,
//   },
//   {
//     id: "jordan",
//     display_name: "Jordan Lee",
//     email: "jordan.lee@example.com",
//     bio: "Building playlists for runs, road trips, and rainy mornings.",
//     top_artists: [{ name: "Kaytranada" }],
//     top_songs: [{ name: "Freefall" }],
//     profile_img: "https://i.pravatar.cc/160?u=jordan",
//     is_private: false,
//   },
//   {
//     id: "sam",
//     display_name: "Sam Rivera",
//     email: "sam.rivera@example.com",
//     bio: "Always looking for guitar-driven tracks and underrated albums.",
//     top_artists: [{ name: "Boygenius" }],
//     top_songs: [{ name: "Not Strong Enough" }],
//     profile_img: "https://i.pravatar.cc/160?u=sam",
//     is_private: true,
//   },
//   {
//     id: "nina",
//     display_name: "Nina Patel",
//     email: "nina.patel@example.com",
//     bio: "Pop hooks, dance tracks, and anything with a huge chorus.",
//     top_artists: [{ name: "Dua Lipa" }],
//     top_songs: [{ name: "Levitating" }],
//     profile_img: "https://i.pravatar.cc/160?u=nina",
//     is_private: false,
//   },
// ];

const Discover = () => {
  const [usersData, setUsersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
        // user.top_artists, - or get top artist/song and filter by
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
        <h1>Discover Other Users</h1>
        <p>
          Browse listeners, compare favorite artists, and start a conversation
          around the music they love.
        </p>
      </div>

      <div className="discover-toolbar">
        <div className="discover-search">
          <label htmlFor="discover-user-search">Search public profiles</label>
          <input
            id="discover-user-search"
            type="search"
            placeholder="Search by name, genre, artist, or song"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="discover-result-count">
          <strong>{filteredUsers.length}</strong>
          <span>
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
