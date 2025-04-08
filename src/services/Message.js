const mongoose = require("mongoose");

const MessageModel = require("../models/Message");

class Message {
  async getMessagesByUserId(req, res) {
    try {
      const messages = await MessageModel.find({
        $or: [
          {
            receiverId: req.params.id,
            senderId: req.user.sub
          },
          {
            receiverId: req.user.sub,
            senderId: req.params.id
          }
        ]
      })
      .sort({ createdAt: 1 })
      .populate("senderId", "name")
      .populate("receiverId", "name"); // Opcional: si quieres también info del receptor
      
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getMessagesByGroupId(req, res) {
    try {
      const messages = await MessageModel.find({
        groupId: req.params.id,
      })
      .sort({ createdAt: -1 })
      .populate("senderId", "name picture");
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getSendersWithLastMessage(receiverId, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(receiverId)) {
        throw new Error("ID de receptor inválido");
      }

      const pipeline = [
        { $match: { receiverId: new mongoose.Types.ObjectId(receiverId) } },
        { $sort: { timestamp: -1 } }, // Ordenamos primero por timestamp en orden descendente
        {
          $group: {
            _id: "$senderId",
            lastMessage: { $first: "$$ROOT" }, // Tomamos el mensaje más reciente de cada sender
            messageCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "users", // Asegurar que coincide con el nombre de la colección en MongoDB
            localField: "_id",
            foreignField: "_id",
            as: "sender",
          },
        },
        { $unwind: "$sender" }, // Convertimos el array de `sender` en objeto
        {
          $project: {
            senderId: "$_id",
            senderUsername: "$sender.username",
            senderName: "$sender.name",
            senderPicture: "$sender.picture",
            senderIsOnline: "$sender.isOnline",
            lastMessage: {
              id: "$lastMessage._id",
              content: "$lastMessage.message",
              timestamp: "$lastMessage.timestamp",
            },
            messageCount: 1,
          },
        },
        { $sort: { "lastMessage.timestamp": -1 } }, // Ordenamos por el último mensaje de cada usuario
      ];

      const result = await MessageModel.aggregate(pipeline);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = Message;
