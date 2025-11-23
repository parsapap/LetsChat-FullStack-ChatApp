import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

// used to store typing users per chat
const typingUsers = {}; // {chatId: {userId: true}}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle typing indicators
  socket.on("typing", ({ chatId, userId }) => {
    if (!typingUsers[chatId]) {
      typingUsers[chatId] = {};
    }
    typingUsers[chatId][userId] = true;

    // Notify all users in the chat except the sender
    socket.broadcast.emit("userTyping", { chatId, userId });
  });

  socket.on("stopTyping", ({ chatId, userId }) => {
    if (typingUsers[chatId]) {
      delete typingUsers[chatId][userId];

      // If no one is typing in this chat, clean up
      if (Object.keys(typingUsers[chatId]).length === 0) {
        delete typingUsers[chatId];
      }
    }

    // Notify all users in the chat except the sender
    socket.broadcast.emit("userStopTyping", { chatId, userId });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];

    // Clean up typing status on disconnect
    Object.keys(typingUsers).forEach(chatId => {
      if (typingUsers[chatId][userId]) {
        delete typingUsers[chatId][userId];
        socket.broadcast.emit("userStopTyping", { chatId, userId });
      }
    });

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
