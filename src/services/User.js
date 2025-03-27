const UserModel = require("../models/User");

class User {
  async getUserLogin(id, res) {
    try {
      const user = await UserModel.findOne({ _id: id }, { password: 0, email: 0, googleId: 0 });
      return res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getUsers(res) {
    try {
      const users = await UserModel.find({}, { password: 0, email: 0, googleId: 0 });
      return res.status(201).json(users);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = User;