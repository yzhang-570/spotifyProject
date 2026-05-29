export const mockThreadPayload = {
  // depth: 0 post document
  mainPost: {
    id: "thread_spotify_123",
    creator: "audio_engineer_dan",
    title: "Is anyone else experiencing audio clipping on the new web player beta?",
    content: "It happens mostly on high-frequency tracks with the volume set over 80%. My setup is completely flat, so I'm wondering if it's a software limiter issue.",
    likes: 56,
    depth: 0,
    created_time: "2026-05-27T10:00:00.000Z"
  },

  // Collection of related sub-documents belonging to this forum thread
  comments: [
    // Top-Level Comment (depth: 1) -> points to main post via forum and reply_to
    {
      id: "comment_layer_1",
      creator: "bass_head_99",
      content: "Yes! I noticed this yesterday on the new electronic music releases. It sounds like digital distortion, not hardware rattling.",
      likes: 14,
      depth: 1,
      forum: "thread_spotify_123",
      reply_to: "thread_spotify_123",
      created_time: "2026-05-27T10:15:00.000Z"
    },

    // Reply to Top-Level Comment (depth: 2) -> reply_to points to comment_layer_1
    {
      id: "reply_layer_2",
      creator: "dev_specs",
      content: "Check your settings panel. The beta enabled a new 'Normalize Volume' algorithm by default. Turning it off fixed it entirely for me.",
      likes: 9,
      depth: 2,
      forum: "thread_spotify_123",
      reply_to: "comment_layer_1",
      created_time: "2026-05-27T10:30:00.000Z"
    },

    // Deep Sub-Reply (depth: 3) -> reply_to points to reply_layer_2
    {
      id: "reply_layer_3",
      creator: "audio_engineer_dan",
      content: "Wow, that actually resolved it. Good catch! They really need to tweak the headroom on that limiter.",
      likes: 4,
      depth: 3,
      forum: "thread_spotify_123",
      reply_to: "reply_layer_2",
      created_time: "2026-05-27T11:02:00.000Z"
    },

    // Another independent Top-Level Comment (depth: 1)
    {
      id: "comment_layer_1_secondary",
      creator: "casual_listener",
      content: "I'm on the beta too but everything sounds completely fine on my headphones. Might be limited to specific browsers?",
      likes: 3,
      depth: 1,
      forum: "thread_spotify_123",
      reply_to: "thread_spotify_123",
      created_time: "2026-05-27T10:45:00.000Z"
    },

    // Reply to the secondary comment (depth: 2)
    {
      id: "reply_layer_2_secondary",
      creator: "mac_user_club",
      content: "Are you running Chrome or Safari? I am experiencing it specifically on Brave and Chrome.",
      likes: 1,
      depth: 2,
      forum: "thread_spotify_123",
      reply_to: "comment_layer_1_secondary",
      created_time: "2026-05-27T11:15:00.000Z"
    }
  ]
};
