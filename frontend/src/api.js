const BASE_URL = 'http://127.0.0.1:8888';

const parseJsonResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error ||
      (typeof data === 'string' ? data : 'Something went wrong.');
    throw new Error(message);
  }

  return data;
};

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
export const getChats = async () => {
  const response = await fetch(`${BASE_URL}/chats`, {
    credentials: 'include',
  });
  return parseJsonResponse(response);
};

export const getChatUsers = async () => {
  const response = await fetch(`${BASE_URL}/chats/users`, {
    credentials: 'include',
  });
  return parseJsonResponse(response);
};

export const createChat = async (recipientId) => {
  const response = await fetch(`${BASE_URL}/chats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ recipientId }),
  });
  return parseJsonResponse(response);
};

export const sendChatMessage = async (chatId, text) => {
  const response = await fetch(`${BASE_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ text }),
  });
  return parseJsonResponse(response);
};
