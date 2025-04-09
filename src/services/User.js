const UserModel = require("../models/User");
const bcrypt = require("bcrypt");

class User {
  async getUserLogin(id, res) {
    try {
      const user = await UserModel.findOne({ _id: id }, { password: 0, email: 0, googleId: 0 });
      return res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getUserById(id, res) {
    try {
      const user = await UserModel.findOne({ _id: id }, { password: 0, email: 0, googleId: 0 });
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      return res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getUsers(res) {
    try {
      const users = await UserModel.find({}, { password: 0, email: 0, googleId: 0 });
      return res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateUser(id, userData, res) {
    try {
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      if (user.googleId && userData.email && userData.email !== user.email) {
        return res.status(400).json({ error: "No puedes actualizar el email de un usuario creado con Google" });
      }
  
      const dataToUpdate = {};
  
      if (userData.email && userData.email !== user.email) {
        dataToUpdate.email = userData.email;
      }
  
      if (userData.currentPassword && userData.newPassword) {
        const passwordMatch = await bcrypt.compare(userData.currentPassword, user.password);
        if (!passwordMatch) {
          return res.status(400).json({ error: "La contraseña actual no es correcta" });
        }
        dataToUpdate.password = await bcrypt.hash(userData.newPassword, 10);
      }
  
      if (userData.name) {
        dataToUpdate.name = userData.name;
      }
  
      if (userData.username) {
        dataToUpdate.username = userData.username;
      }
  
      await UserModel.updateOne({ _id: id }, { $set: dataToUpdate });
  
      res.status(200).json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }  
}

module.exports = User;