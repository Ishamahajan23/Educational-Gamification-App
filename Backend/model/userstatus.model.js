const mongoose = require("mongoose");

const userStatusSchema = new mongoose.Schema(
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
      min: 1,
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
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userStatusSchema.index({ points: -1 });

const UserStatusModel = mongoose.model("UserStatus", userStatusSchema);

module.exports = UserStatusModel;
