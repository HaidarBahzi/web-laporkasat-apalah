//server.js

const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//New imports
const http = require("http").Server(app);
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const date = new Date();

app.use(cors());

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

//Add this before the app.get() block
socketIO.on("connection", (socket) => {
  console.log(`: ${socket.id} user just connected!`);

  socket.on("disconnect", () => {
    console.log(": A user disconnected");
  });
});

app.post("/notification/add", async (req, res) => {
  const { user_id, title, message } = req.body;

  if (!user_id || !title || !message) {
    return res.status(422).json({ message: "failed to send notification" });
  }

  const realtime = socketIO.emit("notification", { user_id, title, message });

  const query = await prisma.notification.create({
    data: {
      notif_id: uuidv4(),
      user_mail: user_id,
      notif_title: title,
      notif_description: message,
      notif_tgl_send: date.toISOString(),

      created_at: date.toISOString(),
    },
  });

  if (!realtime || !query) {
    return res.status(500).json({ message: "failed to send notification" });
  }

  return res.status(200).json({ message: "succes to send notification" });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
