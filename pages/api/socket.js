// pages/api/socket.js
import { Server } from "socket.io";

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    io.on("connection", (socket) => {
      // Handle WebSocket events here
    });
    res.socket.server.io = io;
  }

  res.end();
}
