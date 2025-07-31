const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  updateRoomList,
  getActiveRooms,
} = require("./users");

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const getCurrentTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

app.use(cors());
app.use(router);

io.on("connect", (socket) => {
  console.log("New client connected !!");

  socket.on("join", ({ name, room }, callback = () => {}) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) {
      if (typeof callback === "function") {
        return callback(error);
      }
      return;
    }

    socket.join(user.room);

    // Send welcome message - FIXED: using 'text' instead of 'message'
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}.`,
      time: getCurrentTime(),
    });

    // Broadcast join message - FIXED: using 'text' instead of 'message'
    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has joined!`,
      time: getCurrentTime(),
    });

    // Send room data to all users in the room
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    // Send active rooms to all clients
    const activeRooms = getActiveRooms();
    io.emit("activeRooms", activeRooms);

    // FIXED: Send room list (same as active rooms for now)
    io.emit("roomList", activeRooms);

    console.log(`✅ ${user.name} joined room: ${user.room}`);
    callback();
  });

  socket.on("sendMessage", (messageData, callback = () => {}) => {
    const user = getUser(socket.id);

    if (user && user.room) {
      // FIXED: Handle both old format (string) and new format (object)
      let messageText, messageTime;

      if (typeof messageData === "string") {
        messageText = messageData;
        messageTime = getCurrentTime();
      } else if (messageData && typeof messageData === "object") {
        messageText = messageData.text || messageData.message;
        messageTime = messageData.time || getCurrentTime();
      }

      // FIXED: Send message with correct property name 'text'
      const messageToSend = {
        user: user.name,
        text: messageText,
        time: messageTime,
      };

      io.to(user.room).emit("message", messageToSend);

      console.log(`📨 Message from ${user.name}: ${messageText}`);
    }

    // Update room data
    if (user && user.room) {
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }

    // Send updated active rooms
    const activeRooms = getActiveRooms();
    io.emit("activeRooms", activeRooms);
    io.emit("roomList", activeRooms);

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      // FIXED: Send disconnect message with time
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left.`,
        time: getCurrentTime(),
      });

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      const activeRooms = getActiveRooms();
      io.emit("activeRooms", activeRooms);
      io.emit("roomList", activeRooms);

      console.log(`❌ ${user.name} disconnected`);
    }
  });
});

server.listen(process.env.PORT || 3001, () => {
  console.log("🚀 Server is running on port 3001 !");
});
