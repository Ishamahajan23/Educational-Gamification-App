const mongoose = require("mongoose");

const profileSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "Learning enthusiast exploring new topics every day!",
      maxlength: 500,
    },
    favoriteSubject: {
      type: String,
      enum: [
        "Mathematics",
        "Science",
        "History",
        "Geography",
        "Literature",
        "Physics",
        "Chemistry",
        "Biology",
      ],
      default: "Mathematics",
    },
    learningGoal: {
      type: String,
      default: "Master problem-solving skills",
      maxlength: 200,
    },
    avatar: {
      type: String,
      default: null,
    },
    stats: {
      totalQuizzes: {
        type: Number,
        default: 0,
      },
      averageScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      totalPoints: {
        type: Number,
        default: 0,
      },
      rank: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced", "Expert", "Master"],
        default: "Beginner",
      },
      globalRank: {
        type: Number,
        default: 0,
      },
    },
    achievements: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        icon: {
          type: String,
          required: true,
        },
        earnedAt: {
          type: Date,
          default: Date.now,
        },
        category: {
          type: String,
          enum: ["quiz", "score", "speed", "streak", "participation"],
          required: true,
        },
      },
    ],
    preferences: {
      notifications: {
        type: Boolean,
        default: true,
      },
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "light",
      },
    },
  },
  {
    timestamps: true,
  }
);

const UserProfileModel = mongoose.model("UserProfile", profileSchema);
module.exports = UserProfileModel;
