import { useEffect, useMemo, useState, useContext } from "react";
import {
  createChat,
  getChatUsers,
  getChats,
  sendChatMessage,
} from "../api";
import "./inbox.css";
import { DarkModeContext } from '../DarkModeContext'

const getInitials = (value) => {
  if (!value) return "U";

  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const formatTime = (value) => {
  if (!value) return "Now";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};

const mapApiUser = (user = {}) => {
  const name = user.name || user.displayName || user.username || "Unknown User";
  const username = user.username || user.id || "unknown";

  return {
    id: user.id || username,
    name,
    username,
    initials: user.initials || getInitials(name),
    status: user.bio || "Spotify listener",
  };
};

const mapApiChat = (chat) => {
  const otherUser = mapApiUser(chat.otherUser || {});
  const messages = (chat.messages || []).map((message, index) => ({
    id: `${chat.id}-${message.sent_time || index}`,
    sender: message.isCurrentUser ? "You" : otherUser.name,
    time: formatTime(message.sent_time),
    text: message.text,
    isCurrentUser: Boolean(message.isCurrentUser),
  }));
  const latestMessage = messages[messages.length - 1];

  return {
    id: chat.id,
    otherUserId: otherUser.id,
    name: otherUser.name,
    username: otherUser.username,
    initials: otherUser.initials,
    preview: latestMessage?.text || "No messages yet.",
    lastActive:
      latestMessage?.time || formatTime(chat.updated_time || chat.created_time),
    messages,
  };
};

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [inboxError, setInboxError] = useState("");

  const {darkModeOn } = useContext(DarkModeContext);

  useEffect(() => {
    let isMounted = true;

    const loadInboxData = async () => {
      try {
        const [chatData, userData] = await Promise.all([
          getChats(),
          getChatUsers(),
        ]);

        if (!isMounted) return;

        const mappedConversations = chatData.map(mapApiChat);

        setConversations(mappedConversations);
        setChatUsers(userData.map(mapApiUser));
        setSelectedConversationId((currentId) => {
          const stillExists = mappedConversations.some(
            (conversation) => conversation.id === currentId
          );
          return stillExists ? currentId : mappedConversations[0]?.id || "";
        });
        setInboxError("");
      } catch (error) {
        if (!isMounted) return;
        setInboxError(error.message || "Unable to load chats.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInboxData();

    return () => {
      isMounted = false;
    };
  }, []);

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
  }, [chatUsers, newChatSearch]);

  const selectedConversation =
    conversations.find(
      (conversation) => conversation.id === selectedConversationId
    ) || conversations[0] || null;

  const handleSelectChatUser = async (user) => {
    const existingConversation = conversations.find(
      (conversation) =>
        conversation.otherUserId === user.id ||
        conversation.username === user.username
    );

    if (existingConversation) {
      setSelectedConversationId(existingConversation.id);
      setIsNewChatOpen(false);
      setNewChatSearch("");
      return;
    }

    try {
      const createdChat = mapApiChat(await createChat(user.id));

      setConversations((currentConversations) => [
        createdChat,
        ...currentConversations.filter(
          (conversation) => conversation.id !== createdChat.id
        ),
      ]);
      setSelectedConversationId(createdChat.id);
      setSearchTerm("");
      setNewChatSearch("");
      setIsNewChatOpen(false);
      setInboxError("");
    } catch (error) {
      setInboxError(error.message || "Unable to create chat.");
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = draftMessage.trim();

    if (!trimmedMessage || !selectedConversation) {
      return;
    }

    try {
      const updatedChat = mapApiChat(
        await sendChatMessage(selectedConversation.id, trimmedMessage)
      );

      setConversations((currentConversations) => [
        updatedChat,
        ...currentConversations.filter(
          (conversation) => conversation.id !== updatedChat.id
        ),
      ]);
      setSelectedConversationId(updatedChat.id);
      setDraftMessage("");
      setInboxError("");
    } catch (error) {
      setInboxError(error.message || "Unable to send message.");
    }
  };

  return (
    <section className="inbox-page">
      <aside className="inbox-list-panel" style={darkModeOn ?{'backgroundColor': '#121212'}:{'backgroundColor':'#ffffff'}} aria-label="Message conversations">
        <div className="inbox-list-header">
          <div>
            <p className="inbox-kicker">Messages</p>
            <div className="inbox-title-row">
              <h1 className="inbox-title-card">
                <svg
                  className="inbox-title-icon"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  id="inbox-text"
                >
                  <path d="M0 20V2C0 1.45 0.1958 0.9792 0.5875 0.5875C0.9792 0.1958 1.45 0 2 0H18C18.55 0 19.0208 0.1958 19.4125 0.5875C19.8042 0.9792 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H4L0 20ZM3.15 14H18V2H2V15.125L3.15 14Z" />
                </svg>
                <span id="inbox-button-text">Inbox</span>
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
                  (conversation) =>
                    conversation.otherUserId === user.id ||
                    conversation.username === user.username
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

        {inboxError && <p className="inbox-error">{inboxError}</p>}

        <label className="inbox-search" htmlFor="inbox-search">
          <span id="inbox-text">Search messages</span>
          <input
            id="inbox-search"
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <div className="conversation-list">
          {isLoading && <p className="inbox-status">Loading chats...</p>}
          {!isLoading && filteredConversations.length === 0 && (
            <p className="inbox-status">No chats yet.</p>
          )}
          {!isLoading &&
            filteredConversations.map((conversation) => (
              <button
                className={`conversation-item${
                  conversation.id === selectedConversation?.id ? " active" : ""
                }`}
                key={conversation.id}
                type="button"
                onClick={() => setSelectedConversationId(conversation.id)}
              >
                <span className="conversation-avatar">
                  {conversation.initials}
                </span>
                <span className="conversation-summary">
                  <span className="conversation-name">{conversation.name}</span>
                  <span id="inbox-text" className="conversation-preview">
                    {conversation.preview}
                  </span>
                </span>
                <span id="inbox-text" className="conversation-time">
                  {conversation.lastActive}
                </span>
              </button>
            ))}
        </div>
      </aside>

      <div className="message-panel" style={darkModeOn?{'backgroundColor': '#3B3B3B'}:{'backgroundColor':'#ffffff'}}>
        {selectedConversation ? (
          <>
            <header className="message-header">
              <div className="message-avatar">{selectedConversation.initials}</div>
              <div>
                <h2 id="inbox-text">{selectedConversation.name}</h2>
                <p id="inbox-text">@{selectedConversation.username}</p>
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
                      <span id="inbox-text-secondary">{message.time}</span>
                    </div>
                    <p id="inbox-text">{message.text}</p>
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
          </>
        ) : (
          <div className="message-empty-state">
            <p>Select or create a chat.</p>
            <span>Use the plus button to start messaging another user.</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default Inbox;
