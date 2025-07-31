import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";

import "./Chat.css";
import TextContainer from "../TextContainer/TextContainer";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import RoomList from "../RoomList/RoomList";

const ENDPOINT = "http://localhost:3001";

let socket;

const Chat = () => {
  const location = useLocation();
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [activeRooms, setActiveRooms] = useState([]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT, { transports: ["websocket"] });

    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    // Socket event listeners
    socket.on("message", (message) => {
      console.log("Received message:", message); // Debug log
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("roomData", ({ users }) => {
      console.log("Received room data:", users); // Debug log
      setUsers(users || []);
    });

    socket.on("roomList", (roomList) => {
      console.log("Received room list:", roomList); // Debug log
      setAvailableRooms(roomList || []);
    });

    socket.on("activeRooms", (rooms) => {
      console.log("Received active rooms:", rooms); // Debug log
      setActiveRooms(rooms || []);
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [location.search]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message.trim()) {
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const messageData = {
        user: name,
        text: message.trim(),
        time: currentTime,
      };

      console.log("Sending message:", messageData); // Debug log

      socket.emit("sendMessage", messageData, () => {
        setMessage("");
      });
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} activeRooms={activeRooms} />
      <RoomList rooms={availableRooms} />
    </div>
  );
};

export default Chat;
