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
      .sort({ createdAt: 1 })
      .populate("senderId", "name picture");
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getConversationsWithLastMessage(userId, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("ID de usuario inválido");
      }
  
      const userObjectId = new mongoose.Types.ObjectId(userId);
  
      const pipeline = [
        {
          $match: {
            $or: [
              { senderId: userObjectId },
              { receiverId: userObjectId }
            ]
          }
        },
        { $sort: { timestamp: -1 } },
        {
          $addFields: {
            conversationWith: {
              $cond: [
                { $eq: ["$senderId", userObjectId] },
                "$receiverId",
                "$senderId"
              ]
            }
          }
        },
        {
          $group: {
            _id: "$conversationWith",
            lastMessage: { $first: "$$ROOT" },
            messageCount: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        {
          $project: {
            userId: "$_id",
            username: "$user.username",
            name: "$user.name",
            picture: "$user.picture",
            isOnline: "$user.isOnline",
            lastMessage: {
              id: "$lastMessage._id",
              content: "$lastMessage.message",
              timestamp: "$lastMessage.timestamp",
              senderId: "$lastMessage.senderId",
              receiverId: "$lastMessage.receiverId"
            },
            messageCount: 1
          }
        },
        { $sort: { "lastMessage.timestamp": -1 } }
      ];
  
      const result = await MessageModel.aggregate(pipeline);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  
}

module.exports = Message;
