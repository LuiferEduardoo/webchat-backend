const express = require("express");
const { createServer } = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const { initialize } = require('./config/passport');

const router = require("./routes");

const realtimeServer = require("./realtimeServer");

dotenv.config();

const app = express();
const httpServer = createServer(app);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use(initialize);
app.set("port", process.env.PORT || 3000);

app.use(cors());
app.use(express.json());
router(app);

httpServer.listen(app.get("port"));

realtimeServer(httpServer);
