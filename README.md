# Spotifeed
This application is a social media extension to Spotify where users can showcase their top artists, join forums, and connect with other Spotify users.

## Table of Contents
- Getting Started
- Project Structure
- How to Use This Project
- Major Features
- Credits

## Getting Started
1. Clone the repo into your local environment

3. Add firebase API keys to .env in /backend

4. Change directories into frontend folder  
`cd frontend`  

5. Run react app  
```bash
npm install
npm run dev
```

4. Change directories into backend folder in a **different terminal**  while simultaneously running the react app
`cd backend`  

5. Run express server  
```bash
npm install
npm start
```

## Project Structure
frontend/
- /styles       # CSS files
- /components
- /pages
- /utils        # utility functions

backend/
- /routes
- /db           # all firebase interactions

## How to Use Project
- Navigate to ‘http://update link’
    - Note: You will be unable to access any features without connecting your Spotify account
  
- **Home:** Once you are logged in with your Spotify account, you will be automatically redirected to the “Discuss” page, where you can scroll and search through different forum posts, as well as click on them for more details

- **Navigation:** A navigation bar on the side has additional links to the “Discover” page, “Your Dashboard” page, and the “Inbox” page

- **Discover:** Navigating to the “Discover” page will take you to a list of public users that once clicked on will take you to their personal dashboards, where you can view their lists and befriend them

- **Dashboard:** “My Dashboard” will allow you to customize your profile and showcase your top songs, top artists, and liked songs, as well as edit your privacy settings and other preferences.

- **Inbox:** The “Inbox” page displays all your personal chats with friends, and clicking on an individual chat will enable you to message them directly

## Major Features and their Status
**Discussion forums** - _In progress_
- Chat with other music enthusiasts about an album, song, playlist, etc. 
- Create a completely new thread and start your own discussion, or comment on others and even reply to other comments  

**Discover other users** - _In progress _
- Scroll through other users and view their profiles to find friends of similar taste or even encounter users who will enrich your experience with new music recommendations   

**User Dashboard** - _In progress_
- Share your preferences and tastes by making your profile public, allowing other users to see lists like your liked songs, top artists, and top songs  

**Chat** - _In progress_
- Follow other users and be able to chat one-on-one for more efficient discussions

## Credits
Please contact anyone in the following list of software engineers through Github if you run into issues:
- Anushka Arun
- Lina Gougil
- Ibaad Hassan
- Kwanwoo Lee
- Yuwen Zhang
