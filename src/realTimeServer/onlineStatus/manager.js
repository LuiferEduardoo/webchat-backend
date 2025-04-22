const User = require("../../models/User");
const Group = require("../../models/Group");
const Message = require("../../models/Message");

class OnlineStatusManager {
  constructor() {
    this.onlineUsers = new Map();
    this.userRelationships = new Map();
  }

  async updateDatabaseStatus(userId, isOnline) {
    try {
      await User.findByIdAndUpdate(
        userId,
        { isOnline },
        { new: true }
      );
    } catch (error) {
      console.error(`Error actualizando estado de ${userId}:`, error);
    }
  }

  async userConnected(userId, socketId) {
    await this.updateDatabaseStatus(userId, true);
    
    // Registrar conexión
    if (!this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, {
        sockets: new Set([socketId]),
        lastSeen: new Date(),
        status: 'online'
      });
      return true; // Indica que es nueva conexión
    }
    
    this.onlineUsers.get(userId).sockets.add(socketId);
    this.onlineUsers.get(userId).lastSeen = new Date();
    return false;
  }

  async userDisconnected(userId, socketId) {
    if (!this.onlineUsers.has(userId)) return;

    const userData = this.onlineUsers.get(userId);
    userData.sockets.delete(socketId);

    if (userData.sockets.size === 0) {
      // Actualización inmediata a "away" en DB
      userData.status = 'away';
      await this.updateDatabaseStatus(userId, false);

      // Timer para limpiar completamente
      userData.disconnectTimer = setTimeout(async () => {
        if (this.onlineUsers.has(userId)) {
          const user = this.onlineUsers.get(userId);
          if (user.sockets.size === 0) {
            this.onlineUsers.delete(userId);
          }
        }
      }, 300000); // 5 minutos
    }
  }

  async forceDisconnect(userId) {
    if (!this.onlineUsers.has(userId)) return;

    const userData = this.onlineUsers.get(userId);
    
    // Cancelar timer si existe
    if (userData.disconnectTimer) {
      clearTimeout(userData.disconnectTimer);
    }
    
    // Limpiar y actualizar DB
    this.onlineUsers.delete(userId);
    await this.updateDatabaseStatus(userId, false);
    
    return true;
  }

  async loadUserRelationships(userId) {
    // Implementa según tu DB (ejemplo simplificado)
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    });
    
    const relatedUsers = new Set();
    messages.forEach(msg => {
      if (msg.senderId.toString() !== userId) relatedUsers.add(msg.senderId.toString());
      if (msg.receiverId && msg.receiverId.toString() !== userId) relatedUsers.add(msg.receiverId.toString());
    });
    
    this.userRelationships.set(userId, relatedUsers);
    return Array.from(relatedUsers);
  }
}

module.exports = new OnlineStatusManager();