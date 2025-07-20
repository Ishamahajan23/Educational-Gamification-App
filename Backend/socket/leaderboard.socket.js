const leaderboardModel = require("../model/leaderboard.model");

class LeaderboardSocket {
  constructor() {
    this.io = null;
  }

  initialize(socketInstance) {
    this.io = socketInstance;
  }
  async broadcastLeaderboard() {
    try {
      const leaderboard = await leaderboardModel
        .find({})
        .populate("userId", "username email")
        .sort({ points: -1 })
        .limit(10);

      if (this.io) {
        this.io.emit("leaderboard_update", {
          message: "Leaderboard updated",
          leaderboard,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Error broadcasting leaderboard:", err);
    }
  }

  handleConnection(socket) {
    console.log(`User connected: ${socket.id}`);

    this.sendCurrentLeaderboard(socket);

    socket.on("get_leaderboard", () => {
      this.sendCurrentLeaderboard(socket);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  }
  async sendCurrentLeaderboard(socket) {
    try {
      const leaderboard = await leaderboardModel
        .find({})
        .populate("userId", "username email")
        .sort({ points: -1 })
        .limit(10);

      socket.emit("leaderboard_update", {
        message: "Current leaderboard",
        leaderboard,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error sending leaderboard:", err);
    }
  }
}

module.exports = new LeaderboardSocket();
