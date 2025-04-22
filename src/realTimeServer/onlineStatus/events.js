const statusManager = require('./manager');
const Group = require("../../models/Group");

module.exports = (io, socket) => {
  // Evento de conexión
  const handleConnection = async () => {
    const userId = socket.user.sub;
    
    // Unir a sala personal
    socket.join(userId);
    
    // Registrar conexión
    const isNewConnection = await statusManager.userConnected(userId, socket.id);
    
    if (isNewConnection) {
      // Cargar relaciones y notificar
      const relatedUsers = await statusManager.loadUserRelationships(userId);
      relatedUsers.forEach(relatedId => {
        socket.to(relatedId).emit('user-status-changed', {
          userId,
          status: 'online'
        });
      });
    }
    
    // Unir a grupos
    const groups = await Group.find({ members: userId });
    groups.forEach(group => socket.join(group._id.toString()));
  };


  // Evento de desconexión
  const handleDisconnect = async () => {
    const userId = socket.user.sub;
    await statusManager.userDisconnected(userId, socket.id);
  };

  return {
    handleConnection,
    handleDisconnect
  };
};