const MessageModel = require('../models/Message');

class Message { 
  async getMessagesByUserId(req, res) {
    try {
      const messages = await MessageModel.find({ receiverId: req.params.id, senderId: req.user.sub  }).populate('senderId', 'name');
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getMessagesByGroupId(req, res) {
    try {
      const messages = await MessageModel.find({ groupId: req.params.id, senderId: req.user.sub }).populate('senderId', 'name');
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = Message;