import bodyParser from "body-parser";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import {
  messageSocketHandler,
  authenticateSocket,
} from "./routes/messageRoutes.js";
import { notificationSocketHandler } from "./middlewares/notificationSocketHandler.js";
import app from "./app.js";

dotenv.config();
connectDB();

const server = http.createServer(app);

<<<<<<< HEAD
const PORT = process.env.PORT || 3003;
=======
const PORT = process.env.PORT || 5006;
>>>>>>> 8bd6e3c91f17b61bca9fa5e2cc75c61181fbd107

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  },
  transports: ["websocket", "polling"],
});
app.set("io", io);
io.use((socket, next) => {
  authenticateSocket(socket, next);
});

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  messageSocketHandler(socket, io);

  notificationSocketHandler(socket, io);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
