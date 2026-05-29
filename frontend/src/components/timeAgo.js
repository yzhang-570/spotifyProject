export const formatTimeAgo = (timestamp) => {

  if (!timestamp) return 'Just now';

  const seconds = Math.floor(
    (new Date() - new Date(timestamp)) / 1000
  );

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " yrs ago";
  }

  interval = seconds / 2592000;

  if (interval > 1) {
    return Math.floor(interval) + " mo ago";
  }

  interval = seconds / 86400;

  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }

  interval = seconds / 3600;

  if (interval > 1) {
    return Math.floor(interval) + " hrs ago";
  }

  interval = seconds / 60;

  if (interval > 1) {
    return Math.floor(interval) + " min ago";
  }

  return "Just now";
};