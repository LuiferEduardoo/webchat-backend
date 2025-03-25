const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null }, // Para mensajes de grupo
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Para mensajes privados
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", MessageSchema);
