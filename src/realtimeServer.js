module.exports = (httpServer) => {
  const { Server } = require("socket.io");
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(socket.id);
  });
};
