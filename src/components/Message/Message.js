import React from "react";
import "./Message.css";
import ReactEmoji from "react-emoji";

const Message = ({ message, name }) => {
  // Handle case where message might be undefined or malformed
  if (!message || typeof message !== "object") {
    return null;
  }

  const { user, text, time } = message;

  // Handle case where required fields are missing
  if (!user || !text) {
    return null;
  }

  let isSentByCurrentUser = false;
  const trimmedName = name ? name.trim().toLowerCase() : "";
  const trimmedUser = user ? user.trim().toLowerCase() : "";

  if (trimmedUser === trimmedName) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{name}</p>
      <div className="messageBox backgroundBlue">
        {time && <p className="message-time">{time}</p>}
        <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        {time && <p className="message-time">{time}</p>}
        <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
      </div>
      <p className="sentText pl-10">{user}</p>
    </div>
  );
};

export default Message;
