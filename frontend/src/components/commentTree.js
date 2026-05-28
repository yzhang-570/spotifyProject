export function nestComments(flatComments) {
  const commentMap = {};
  
  // Step 1: Map all items by their ID and initialize empty replies array
  flatComments.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  const commentTree = [];

  // Step 2: Tie replies to parents using the correct database fields
  flatComments.forEach(comment => {
    const mappedComment = commentMap[comment.id];
    const parentId = comment.reply_to; // Updated to match your database field name

    // If reply_to matches the forum ID, it is a top-level comment (Depth 1)
    if (parentId === comment.forum) {
      commentTree.push(mappedComment);
    } else if (commentMap[parentId]) {
      // Otherwise, it is a deeper reply (Depth 2+) pointing to a comment ID
      commentMap[parentId].replies.push(mappedComment);
    } else {
      // Fallback edge case
      commentTree.push(mappedComment);
    }
  });

  // Sort comments by creation time (oldest first for readable comment flows)
  const sortFunc = (a, b) => new Date(a.created_time) - new Date(b.created_time);
  commentTree.sort(sortFunc);
  Object.values(commentMap).forEach(c => c.replies.sort(sortFunc));

  return commentTree;
}
