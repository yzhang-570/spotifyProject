import { useMemo, useState } from "react";
import "./inbox.css";

const conversations = [
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

const Inbox = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState(
    conversations[0].id
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
  }, [searchTerm]);

  const selectedConversation =
    conversations.find(
      (conversation) => conversation.id === selectedConversationId
    ) || conversations[0];

  return (
    <section className="inbox-page">
      <aside className="inbox-list-panel" aria-label="Message conversations">
        <div className="inbox-list-header">
          <div>
            <p className="inbox-kicker">Messages</p>
            <h1>Inbox</h1>
          </div>
          <button className="new-message-button" type="button" aria-label="New message">
            +
          </button>
        </div>

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
          {selectedConversation.messages.map((message) => (
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
          ))}
        </div>

        <form className="message-composer" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="message-input">Message</label>
          <input id="message-input" type="text" placeholder="Aa" />
          <button type="submit" aria-label="Send message">
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default Inbox;
