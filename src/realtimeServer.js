const jsonwebtoken = require("jsonwebtoken");

const Message = require("./models/Message");
const User = require("./models/User");

module.exports = (httpServer) => {
  const { Server } = require("socket.io");
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        socket.user = decoded;
        return next();
      }
      next(new Error("Unauthorized"));
    } else {
      next(new Error("Unauthorized"));
    }
  });
};
