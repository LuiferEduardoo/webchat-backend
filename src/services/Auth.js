const jwt = require("jsonwebtoken");
const passport = require("passport");

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
}

module.exports = Auth;