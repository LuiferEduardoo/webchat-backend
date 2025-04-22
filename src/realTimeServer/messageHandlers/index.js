const Message = require("../../models/Message");
const statusManager = require('../onlineStatus/manager');

const handlePrivateMessage = (socket) => async ({ receiverId, message }) => {
  try {
    const newMessage = new Message({
      senderId: socket.user.sub,
      receiverId,
      message
    });
    
    await newMessage.save();
    
    // Emitir mensaje
    socket.to(receiverId).emit("newMessage", newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const handleGroupMessage = (io, socket) => async ({ groupId, message: messageContent }) => {
  try {
    const newMessage = new Message({
      senderId: socket.user.sub,
      groupId,
      message: messageContent
    });
    
    await newMessage.save();
    
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "name picture")
      .exec();
    
    io.to(groupId).emit("newGroupMessage", populatedMessage);
  } catch (error) {
    console.error("Error sending group message:", error);
  }
};

module.exports = {
  handlePrivateMessage,
  handleGroupMessage
};