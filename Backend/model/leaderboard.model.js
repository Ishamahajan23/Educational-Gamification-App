const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    rank: {
      type: String,
      default: "Beginner",
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    },
    badges: [
      {
        type: String,
        trim: true,
        enum: ["First Win", "Speed Master", "Quiz Expert"],
      },
    ],
    trophies: [
      {
        type: String,
        trim: true,
        enum: ["Gold Trophy", "Silver Trophy", "Bronze Trophy"],
      },
    ],
    totalTrophies: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);
leaderboardSchema.index({ points: -1 });
const LeaderboardModel = mongoose.model("Leaderboard", leaderboardSchema);

module.exports = LeaderboardModel;
