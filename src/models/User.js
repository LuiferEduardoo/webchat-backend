const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { 
    type: String, 
    unique: true, 
    default: function() {
      return "user_" + Math.random().toString(36).substr(2, 9); // Ej: "user_abc123def"
    } 
  },
  password: { type: String, default: null },
  isOnline: { type: Boolean, default: false },
  googleId: { type: String, default: null },
  name: { type: String, default: null },
  picture: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
