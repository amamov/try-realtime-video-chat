const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
const { v4: uuidV4 } = require("uuid");

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join_room", (roomId, userId) => {
    console.log(roomId, userId);

    socket.join(roomId);
    io.to(roomId).emit("user_connected", userId);
    // socket.to(roomId).broadcast.emit("user_connected", userId);

    socket.on("disconnect", () => {
      io.to(roomId).emit("user_disconnected", userId);
    });
  });
});

server.listen(3000, () => {
  console.log(`http://localhost:${PORT}`);
});
