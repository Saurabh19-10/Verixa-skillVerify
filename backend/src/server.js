import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./config/db.js";


connectDB();

const PORT = process.env.PORT || 5050;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);

    io.emit("online-users", [...onlineUsers.keys()]);
  });

  socket.on("send-message", (message) => {
    const receiverSocket = onlineUsers.get(
      message.receiver
    );

    if (receiverSocket) {
      io.to(receiverSocket).emit(
        "receive-message",
        message
      );
    }
  });

  socket.on("typing", ({ receiver, sender }) => {
    const receiverSocket =
      onlineUsers.get(receiver);

    if (receiverSocket) {
      io.to(receiverSocket).emit("typing", sender);
    }
  });

  socket.on("stop-typing", ({ receiver }) => {
    const receiverSocket =
      onlineUsers.get(receiver);

    if (receiverSocket) {
      io.to(receiverSocket).emit(
        "stop-typing"
      );
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("online-users", [...onlineUsers.keys()]);

    console.log("Disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});