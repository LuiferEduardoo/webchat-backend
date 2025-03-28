const GroupModel = require("../models/Group");

class Group {
  async getGroup(id, res) {
    try {
      const group = await GroupModel.findById(id).populate("members", { password: 0, email: 0, googleId: 0 });
      if (!group) {
        return res.status(404).json({ error: "Grupo no encontrado" });
      }
      return  res.status(200).json(group);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener el grupo" });
    }
  }

  async getGroupsByUser(userId, res) {
    try {
      const groups = await GroupModel.find({ members: userId }).populate("members", { password: 0, email: 0, googleId: 0 });
      return  res.status(200).json(groups);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los grupos del usuario" });
    }
  }

  async create(req, createdBy, res) {
    try {
      const { name, members } = req.body;
      const group = new GroupModel({ name, members: [...members, req.user.sub], createdBy });
      await group.save();
      return res.status(200).json(group);
    } catch (error) {
      return res.status(500).json({ error: "Error al crear el grupo" });
    }
  }

  async update(id, userId, req, res) {
    try {
      const { name, description, members } = req.body;
      const findGroup = await GroupModel.findById(id);
      if(findGroup.createdBy.toString() !== userId) {
        return res.status(401).json({ error: "No tienes permiso para eliminar este grupo" });
      }
      const group = await GroupModel.findByIdAndUpdate(id, { name, description, members }, { new: true });
      if (!group) {
        return res.status(404).json({ error: "Grupo no encontrado" });
      }
      return res.status(200).json(group);
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar el grupo" });
    }
  }

  async delete(id, userId, res) {
    try {
      const findGroup = await GroupModel.findById(id);
      if(findGroup?.createdBy?.toString() !== userId) {
        return res.status(401).json({ error: "No tienes permiso para eliminar este grupo" });
      }
      const group = await GroupModel.findByIdAndDelete(id);
      if (!group) {
        return res.status(404).json({ error: "Grupo no encontrado" });
      }
      return res.status(200).json(group);
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar el grupo" });
    }
  }
}

module.exports = Group;