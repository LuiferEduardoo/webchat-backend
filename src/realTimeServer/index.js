const { Server } = require("socket.io");
const authMiddleware = require('./auth');
const statusEvents = require('./onlineStatus/events');
const messageHandlers = require('./messageHandlers');

module.exports = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  // Middleware de autenticación
  io.use(authMiddleware);

  io.on("connection", async (socket) => {
    if (!socket.user?.sub) return;
    
    // Configurar manejadores de estado en línea
    const { handleConnection, handleStatusRequest, handleDisconnect } = statusEvents(io, socket);
    
    // Eventos principales
    await handleConnection();
    
    socket.on("disconnect", handleDisconnect);

    // Manejadores de mensajes (simplificado)
    socket.on("sendMessage", messageHandlers.handlePrivateMessage(socket));
    socket.on("sendGroupMessage", messageHandlers.handleGroupMessage(io, socket));
    
    // Room handlers
    socket.on("joinRoom", ({ groupId }) => {
      socket.join(groupId);
    });
  });
};