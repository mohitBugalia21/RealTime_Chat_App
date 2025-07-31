import React from "react";
import onlineIcon from "../../icons/onlineIcon.png";
import "./TextContainer.css";

const TextContainer = ({ users, activeRooms }) => {
  // Ensure users and activeRooms are arrays
  const safeUsers = Array.isArray(users) ? users : [];
  const safeActiveRooms = Array.isArray(activeRooms) ? activeRooms : [];

  return (
    <div className="textContainer">
      <div>
        <h1>
          Realtime Chat Application{" "}
          <span role="img" aria-label="emoji">
            💬
          </span>
        </h1>
        <h2>
          Try it out right now!{" "}
          <span role="img" aria-label="emoji">
            ⬅️
          </span>
        </h2>
      </div>

      {safeUsers.length > 0 && (
        <div>
          <h1>People currently chatting:</h1>
          <div className="activeContainer">
            {safeUsers.map((user, index) => {
              // Handle both object and string formats
              const userName = typeof user === "object" ? user.name : user;
              const userKey =
                typeof user === "object" && user.id
                  ? user.id
                  : `${userName}-${index}`;

              return (
                <div key={userKey} className="activeItem">
                  <span>{userName}</span>
                  <img alt="Online Icon" src={onlineIcon} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {safeActiveRooms.length > 0 && (
        <div>
          <h1>Active Chat Rooms:</h1>
          <div className="activeContainer">
            {safeActiveRooms.map((roomData, index) => {
              // Handle different possible structures
              const roomName =
                roomData.room || roomData.name || `Room ${index + 1}`;
              const userCount = roomData.userCount || roomData.users || 0;

              return (
                <div key={roomName || index} className="activeItem">
                  <div>
                    <strong>Room: {roomName}</strong>
                  </div>
                  <div>Participants: {userCount}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextContainer;
