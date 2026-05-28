export function nestComments(flatComments) {
  const commentMap = {};
  
  // Map all items by their ID and initialize empty replies array
  flatComments.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  const commentTree = [];

  // Tie replies to parents using the correct database fields
  flatComments.forEach(comment => {
    const mappedComment = commentMap[comment.id];

    // If reply_to matches the forum ID, it is a top-level comment (Depth 1)
    if (comment.reply_to === comment.forum) {
      commentTree.push(mappedComment);
    } else if (commentMap[comment.reply_to]) {
      // Otherwise, it is a deeper reply (Depth 2+) pointing to a comment ID
      commentMap[comment.reply_to].replies.push(mappedComment);
    } else {
      // Fallback edge case
      commentTree.push(mappedComment);
    }
  });

  // Deafult sorts comments by creation time (oldest first for readable comment flows)
  const sortFunc = (a, b) => new Date(a.created_time) - new Date(b.created_time);
  commentTree.sort(sortFunc);
  Object.values(commentMap).forEach(c => c.replies.sort(sortFunc));

  return commentTree;
}
