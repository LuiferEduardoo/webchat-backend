const jsonwebtoken = require("jsonwebtoken");

const Message = require("./models/Message");
const User = require("./models/User");
const Group = require("./models/Group");

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
      try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        return next();
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return next(new Error("Token expired"));
        }
        return next(new Error("Unauthorized"));
      }
    } else {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    // Unirse a una sala
    if (socket.user && socket.user.sub) {
      try {
        await User.findByIdAndUpdate(socket.user.sub, { isOnline: true });
        socket.join(socket.user.sub);

        // Join all groups the user is a member of
        await Group.find({ members: socket.user.sub }).then((groups) => {
          groups.forEach((group) => {
            socket.join(group._id.toString());
          });
        }
        );
      } catch (error) {
        console.error("Error al actualizar el estado del usuario:", error);
      }
    }
    socket.on("joinRoom", ({ groupId }) => {
      socket.join(groupId);
    });

    // Enviar mensaje privado
    socket.on("sendMessage", async ({ receiverId, message }) => {
      const newMessage = new Message({ senderId: socket.user.sub, receiverId, message });
      await newMessage.save();
      io.to(receiverId).emit("newMessage", newMessage);
    });

    // Enviar mensaje a un grupo
    socket.on("sendGroupMessage", async ({ groupId, message: messageContent }) => {
      const newMessage = new Message({ 
        senderId: socket.user.sub, 
        groupId, 
        message: messageContent 
      });
      
      await newMessage.save();
      
      const populatedMessage = await Message.findById(newMessage._id)
        .populate("senderId", "name picture") // Ajusta los campos que necesites
        .exec();
      
      io.to(groupId).emit("newGroupMessage", populatedMessage);
    });

    // Obtener mensajes de un usuario o grupo
    socket.on("getMessages", async ({ userId, groupId }) => {
      let messages;
      if (groupId) {
        messages = await Message.find({ groupId }).populate("senderId");
      } else {
        messages = await Message.find({
          $or: [{ senderId: userId }, { receiverId: userId }],
        }).populate("senderId receiverId");
      }
      socket.emit("messages", messages);
    });

    socket.on("disconnect", async () => {
      try {
        if (socket.user && socket.user.sub) {
          await User.findByIdAndUpdate(socket.user.sub, { isOnline: false });
        }
      } catch (error) {
        console.error("Error al actualizar el estado del usuario:", error);
      }
    });
  });
};
