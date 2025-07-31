import React from "react";
import "./RoomList.css";

const RoomList = ({ rooms }) => {
  // Ensure rooms is an array
  const safeRooms = Array.isArray(rooms) ? rooms : [];

  return (
    <div className="roomList">
      <h3>Available Rooms</h3>
      {safeRooms.length > 0 ? (
        <ul>
          {safeRooms.map((roomData, index) => {
            // Handle different possible room data structures
            const roomName =
              roomData.room || roomData.name || `Room ${index + 1}`;
            const userCount = roomData.userCount || roomData.users || 0;

            return (
              <li key={roomName || index}>
                <span className="room-name">#{roomName}</span>
                <span className="user-count">({userCount} users)</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="no-rooms">No active rooms available</p>
      )}
    </div>
  );
};

export default RoomList;
