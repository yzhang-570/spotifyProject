import { useMemo, useState } from "react";
import "./inbox.css";

const initialConversations = [
  {
    id: "maya",
    name: "Maya Chen",
    username: "mayalistens",
    initials: "MC",
    preview: "Send me that playlist when you get a chance.",
    lastActive: "2:45 PM",
    messages: [
      {
        id: "maya-1",
        sender: "Maya Chen",
        time: "2:41 PM",
        text: "I found a few songs that fit your late-night playlist.",
      },
      {
        id: "maya-2",
        sender: "You",
        time: "2:45 PM",
        text: "Nice, send them over.",
        isCurrentUser: true,
      },
    ],
  },
  {
    id: "jordan",
    name: "Jordan Lee",
    username: "jordanonshuffle",
    initials: "JL",
    preview: "Are you still making the workout mix?",
    lastActive: "11:59 AM",
    messages: [
      {
        id: "jordan-1",
        sender: "Jordan Lee",
        time: "11:52 AM",
        text: "Are you still making the workout mix?",
      },
      {
        id: "jordan-2",
        sender: "You",
        time: "11:59 AM",
        text: "Yes, I can share it later today.",
        isCurrentUser: true,
      },
    ],
  },
  {
    id: "sam",
    name: "Sam Rivera",
    username: "samspins",
    initials: "SR",
    preview: "How are you?",
    lastActive: "Yesterday",
    messages: [
      {
        id: "sam-1",
        sender: "Sam Rivera",
        time: "Yesterday",
        text: "How are you?",
      },
    ],
  },
];

const chatUsers = [
  {
    id: "maya",
    name: "Maya Chen",
    username: "mayalistens",
    initials: "MC",
    status: "Looking for mellow playlists",
  },
  {
    id: "jordan",
    name: "Jordan Lee",
    username: "jordanonshuffle",
    initials: "JL",
    status: "Sharing workout mixes",
  },
  {
    id: "sam",
    name: "Sam Rivera",
    username: "samspins",
    initials: "SR",
    status: "Hunting for deep cuts",
  },
  {
    id: "nina",
    name: "Nina Patel",
    username: "ninabeats",
    initials: "NP",
    status: "Building the perfect party queue",
  },
  {
    id: "alex",
    name: "Alex Morgan",
    username: "alextracks",
    initials: "AM",
    status: "Trading new album recommendations",
  },
];

const Inbox = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState(
    initialConversations[0].id
  );

  const filteredConversations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return conversations;
    }

    return conversations.filter((conversation) =>
      [conversation.name, conversation.username, conversation.preview]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [conversations, searchTerm]);

  const filteredChatUsers = useMemo(() => {
    const query = newChatSearch.trim().toLowerCase();

    if (!query) {
      return chatUsers;
    }

    return chatUsers.filter((user) =>
      [user.name, user.username, user.status]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [newChatSearch]);

  const selectedConversation =
    conversations.find(
      (conversation) => conversation.id === selectedConversationId
    ) || conversations[0];

  const handleSelectChatUser = (user) => {
    const existingConversation = conversations.find(
      (conversation) => conversation.username === user.username
    );

    if (existingConversation) {
      setSelectedConversationId(existingConversation.id);
      setIsNewChatOpen(false);
      setNewChatSearch("");
      return;
    }

    const newConversation = {
      id: user.id,
      name: user.name,
      username: user.username,
      initials: user.initials,
      preview: "No messages yet.",
      lastActive: "Now",
      messages: [],
    };

    setConversations((currentConversations) => [
      newConversation,
      ...currentConversations,
    ]);
    setSelectedConversationId(newConversation.id);
    setSearchTerm("");
    setNewChatSearch("");
    setIsNewChatOpen(false);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = draftMessage.trim();

    if (!trimmedMessage || !selectedConversation) {
      return;
    }

    setConversations((currentConversations) =>
      currentConversations.map((conversation) => {
        if (conversation.id !== selectedConversation.id) {
          return conversation;
        }

        return {
          ...conversation,
          preview: trimmedMessage,
          lastActive: "Now",
          messages: [
            ...conversation.messages,
            {
              id: `${conversation.id}-${conversation.messages.length + 1}`,
              sender: "You",
              time: "Now",
              text: trimmedMessage,
              isCurrentUser: true,
            },
          ],
        };
      })
    );
    setDraftMessage("");
  };

  return (
    <section className="inbox-page">
      <aside className="inbox-list-panel" aria-label="Message conversations">
        <div className="inbox-list-header">
          <div>
            <p className="inbox-kicker">Messages</p>
            <div className="inbox-title-row">
              <h1 className="inbox-title-card">
                <svg
                  className="inbox-title-icon"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M0 20V2C0 1.45 0.1958 0.9792 0.5875 0.5875C0.9792 0.1958 1.45 0 2 0H18C18.55 0 19.0208 0.1958 19.4125 0.5875C19.8042 0.9792 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H4L0 20ZM3.15 14H18V2H2V15.125L3.15 14Z" />
                </svg>
                <span>Inbox</span>
              </h1>
              <button
                className="new-message-button"
                type="button"
                aria-expanded={isNewChatOpen}
                aria-label="New message"
                onClick={() => setIsNewChatOpen((isOpen) => !isOpen)}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {isNewChatOpen && (
          <section className="new-chat-panel" aria-label="Create a new chat">
            <div className="new-chat-panel-header">
              <h2>Create a new chat</h2>
              <button
                type="button"
                onClick={() => setIsNewChatOpen(false)}
                aria-label="Close new chat panel"
              >
                x
              </button>
            </div>

            <label className="new-chat-search" htmlFor="new-chat-search">
              Search users
              <input
                id="new-chat-search"
                type="search"
                placeholder="Search by name or username"
                value={newChatSearch}
                onChange={(event) => setNewChatSearch(event.target.value)}
              />
            </label>

            <div className="new-chat-user-list">
              {filteredChatUsers.map((user) => {
                const hasExistingChat = conversations.some(
                  (conversation) => conversation.username === user.username
                );

                return (
                  <button
                    className="new-chat-user"
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectChatUser(user)}
                  >
                    <span className="new-chat-user-avatar">{user.initials}</span>
                    <span className="new-chat-user-info">
                      <span className="new-chat-user-name">{user.name}</span>
                      <span className="new-chat-user-username">
                        @{user.username}
                      </span>
                      <span className="new-chat-user-status">{user.status}</span>
                    </span>
                    <span className="new-chat-user-action">
                      {hasExistingChat ? "Open" : "Start"}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredChatUsers.length === 0 && (
              <p className="new-chat-empty">No users found.</p>
            )}
          </section>
        )}

        <label className="inbox-search" htmlFor="inbox-search">
          <span>Search messages</span>
          <input
            id="inbox-search"
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <div className="conversation-list">
          {filteredConversations.map((conversation) => (
            <button
              className={`conversation-item${
                conversation.id === selectedConversation.id ? " active" : ""
              }`}
              key={conversation.id}
              type="button"
              onClick={() => setSelectedConversationId(conversation.id)}
            >
              <span className="conversation-avatar">{conversation.initials}</span>
              <span className="conversation-summary">
                <span className="conversation-name">{conversation.name}</span>
                <span className="conversation-preview">
                  {conversation.preview}
                </span>
              </span>
              <span className="conversation-time">{conversation.lastActive}</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="message-panel">
        <header className="message-header">
          <div className="message-avatar">{selectedConversation.initials}</div>
          <div>
            <h2>{selectedConversation.name}</h2>
            <p>@{selectedConversation.username}</p>
          </div>
        </header>

        <div className="message-thread" aria-live="polite">
          {selectedConversation.messages.length > 0 ? (
            selectedConversation.messages.map((message) => (
              <article
                className={`message-bubble${
                  message.isCurrentUser ? " current-user" : ""
                }`}
                key={message.id}
              >
                <div className="message-meta">
                  <strong>{message.sender}</strong>
                  <span>{message.time}</span>
                </div>
                <p>{message.text}</p>
              </article>
            ))
          ) : (
            <div className="empty-message-thread">
              <p>No messages yet.</p>
              <span>Send the first message to start this chat.</span>
            </div>
          )}
        </div>

        <form className="message-composer" onSubmit={handleSendMessage}>
          <label htmlFor="message-input">Message</label>
          <input
            id="message-input"
            type="text"
            placeholder="Aa"
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
          />
          <button type="submit" aria-label="Send message">
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default Inbox;
