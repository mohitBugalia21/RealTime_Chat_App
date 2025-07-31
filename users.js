const users = [];
const rooms = {};

const updateRoomList = (room) => {
  const userCount = users.filter((user) => user.room === room).length;
  if (userCount > 0) {
    rooms[room] = userCount;
  } else {
    delete rooms[room];
  }
};

// FIXED: Return format that matches client expectations
const getActiveRooms = () => {
  return Object.keys(rooms).map((roomName) => ({
    room: roomName, // Client expects 'room' property
    name: roomName, // Also provide 'name' for flexibility
    userCount: rooms[roomName], // Client expects 'userCount'
    users: rooms[roomName], // Also provide 'users' count for flexibility
  }));
};

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (existingUser) {
    return { error: "Username is taken" };
  }

  const user = { id, name, room };
  users.push(user);
  updateRoomList(room);

  console.log(`👤 User added: ${name} to room: ${room}`);
  console.log(`📊 Current users:`, users.length);
  console.log(`🏠 Active rooms:`, Object.keys(rooms));

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    const user = users.splice(index, 1)[0];
    updateRoomList(user.room);

    console.log(`👤 User removed: ${user.name} from room: ${user.room}`);
    console.log(`📊 Current users:`, users.length);
    console.log(`🏠 Active rooms:`, Object.keys(rooms));

    return user;
  }
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  const roomUsers = users.filter((user) => user.room === room);

  console.log(
    `👥 Users in room ${room}:`,
    roomUsers.map((u) => u.name)
  );

  return roomUsers;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getActiveRooms,
  updateRoomList,
};
