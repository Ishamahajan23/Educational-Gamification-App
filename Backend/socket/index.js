const leaderboardSocket = require("./leaderboard.socket");

const initializeSocket = (io) => {
  leaderboardSocket.initialize(io);

  io.on("connection", (socket) => {
    leaderboardSocket.handleConnection(socket);
  });

  console.log("Socket.IO initialized successfully");
};

module.exports = {
  initializeSocket,
  leaderboardSocket,
};
