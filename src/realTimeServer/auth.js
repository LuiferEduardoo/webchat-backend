const jsonwebtoken = require("jsonwebtoken");

module.exports = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Unauthorized"));

  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new Error("Token expired"));
    }
    next(new Error("Unauthorized"));
  }
};