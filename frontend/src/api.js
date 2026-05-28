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
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Failed to load top artists.');
  }
  return data;
};

export const getTopSongs = async (timeRange = 'medium_term') => {
  const response = await fetch(`${BASE_URL}/spotify/top-songs?time_range=${timeRange}`, {
    credentials: 'include',
  });
  return response.json();
};