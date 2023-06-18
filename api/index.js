const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => console.log("db connection succeefully"));

const port = 8000 || process.env.PORT;

const server = app.listen(port, () => {
  console.log(`app is running on port${port}...`);
});

let users = [];

const adduser = (userId, socketId) => {
  !users.some(
    (user) => user.userId === userId && users.push({ userId, socketId })
  );
};

const removeuser = (socketId) => {
  users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const io = require("socket.io")(server, {
  pingTimeout: 6000,
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://donia-engahmedelmitwalli1-gmailcom.vercel.app",
  },
});

io.on("connection", (socket) => {
  console.log("auser connected.");
  socket.on("addUser", (userId) => {
    adduser(userId, socket.id);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, recieverId, conversationId, text }) => {
    const user = getUser(recieverId);
    console.log(senderId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
        conversationId,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeuser(socket.id);
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION");

  server.close(() => process.exit(1));
});
