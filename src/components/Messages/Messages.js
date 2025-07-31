import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import Message from "../Message/Message";
import "./Messages.css";

const Messages = ({ messages, name }) => {
  // Ensure messages is an array
  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <ScrollToBottom className="messages">
      {safeMessages.length > 0 ? (
        safeMessages.map((message, i) => (
          <div key={`message-${i}`}>
            <Message message={message} name={name} />
          </div>
        ))
      ) : (
        <div className="no-messages">
          <p>No messages yet. Start the conversation!</p>
        </div>
      )}
    </ScrollToBottom>
  );
};

export default Messages;
