const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { generateToken } = require("../config/passport");
const User =  require("../models/User");

class Auth {
  async callback (req, res) {
    try {
      const token = jwt.sign({ sub: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("access_token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",  
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.writeHead(302, { Location: process.env.FRONTEND_URI});
      res.end();
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async register (req, res, next) {
    try {
      const { email, password, name } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: "El usuario ya existe" });
      }
      user = new User({
        email,
        password: await bcrypt.hash(password, 10),
        name,
      });
      await user.save();
      return res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async login (req, res) {
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      const isValid = await bcrypt.compare(password, user?.password || "");
      if (!user && !isValid) {
        return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
      }
      const token = generateToken(user);
      res.cookie("access_token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ message: "Inicio de sesión exitoso" });
    } catch(err) {
      console.error(err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = Auth;