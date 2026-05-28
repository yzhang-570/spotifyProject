const BASE_URL = 'http://127.0.0.1:8888';

export const getMe = async () => {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    credentials: 'include',
  });
  if (!response.ok) return null;
  return response.json();
};

export const getLikedSongs = async () => {
  const response = await fetch(`${BASE_URL}/spotify/liked-songs`, {
    credentials: 'include',
  });
  return response.json();
};

export const getTopArtists = async (timeRange = 'medium_term') => {
  const response = await fetch(`${BASE_URL}/spotify/top-artists?time_range=${timeRange}`, {
    credentials: 'include',
  });
  return response.json();
};

export const getTopSongs = async (timeRange = 'medium_term') => {
  const response = await fetch(`${BASE_URL}/spotify/top-songs?time_range=${timeRange}`, {
    credentials: 'include',
  });
  return response.json();
};

export const getFirebaseUser = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      credentials: 'include',
    });
    if (response.status === 404) return null;
    return response.json();
  }
  catch (error) {
    console.log(`An error occured while fetching user profile data: ${error}`)
  }
};

export const getAllUsers = async () => {
  const response = await fetch(`${BASE_URL}/users`, {
    credentials: 'include',
  });
  return response.json();
};

export const updateProfile = async (updates) => {
  const response = await fetch(`${BASE_URL}/users/update`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return response.json();
};