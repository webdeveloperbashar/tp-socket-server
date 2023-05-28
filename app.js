const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with the allowed origin(s)
    methods: ["GET", "POST"], // Allowed HTTP methods
  },
});

// Enable CORS for the Express app as well
const corsOptions = {
    origin: [
      "http://localhost:3000",
    ],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
app.use(cors(corsOptions));

app.get("/", (req, res)=>{
    res.send("<h2>Hello Taskplanet socket server.....<h2/>")
})

// Socket.io event handling
io.on("connection", (socket) => {
  console.log("A client connected");

  // -------------------------- tic tac toe -----------------------------
  socket.on("player-join", async (data) => {
    socket.join(data.roomId);
    io.to(data.roomId).emit("paired-players", data?.members);
  });

  socket.on("player-move", (data) => {
    io.to(data.roomId).emit("player-move-frontend", data);
  });

  socket.on("game-end", (data) => {
    io.emit("game-end", data);
  });
});

// Start the server
const port = 8000; // or any other port you want to use
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
