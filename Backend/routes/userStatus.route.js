const express = require("express");
const leaderboardModel = require("../model/leaderboard.model");
const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const { leaderboardSocket } = require("../socket");

const userStatusRoute = express.Router();

const verifyToken = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Authorization header missing",
      });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid or expired token",
      err: err.message,
    });
  }
};

const calculateRank = (points) => {
  if (points >= 2000) return "Expert";
  if (points >= 1000) return "Advanced";
  if (points >= 500) return "Intermediate";
  return "Beginner";
};

userStatusRoute.get("/status", verifyToken, async (req, res) => {
  try {
    let userStatus = await leaderboardModel
      .findOne({ userId: req.userId })
      .populate("userId", "username email");

    if (!userStatus) {
      userStatus = await leaderboardModel.create({
        userId: req.userId,
        points: 0,
        rank: "Beginner",
        badges: [],
        trophies: [],
        totalTrophies: 0,
      });
      await userStatus.populate("userId", "username email");
    }

    userStatus.rank = calculateRank(userStatus.points);
    await userStatus.save();

    await leaderboardSocket.broadcastLeaderboard();

    res.status(200).json({
      message: "User status retrieved successfully",
      userStatus,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving user status",
      err: err.message,
    });
  }
});

userStatusRoute.put("/points", verifyToken, async (req, res) => {
  try {
    const { points, operation = "add" } = req.body;

    if (typeof points !== "number") {
      return res.status(400).json({
        message: "Points must be a number",
      });
    }

    let userStatus = await leaderboardModel.findOne({ userId: req.userId });

    if (!userStatus) {
      userStatus = await leaderboardModel.create({
        userId: req.userId,
        points: 0,
        rank: "Beginner",
        badges: [],
        trophies: [],
        totalTrophies: 0,
      });
    }

    if (operation === "add") {
      userStatus.points += points;
    } else if (operation === "subtract") {
      userStatus.points = Math.max(0, userStatus.points - points);
    } else if (operation === "set") {
      userStatus.points = Math.max(0, points);
    }

    userStatus.rank = calculateRank(userStatus.points);

    await userStatus.save();
    await userStatus.populate("userId", "username email");

    await leaderboardSocket.broadcastLeaderboard();

    res.status(200).json({
      message: "Points updated successfully",
      userStatus,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating points",
      err: err.message,
    });
  }
});

userStatusRoute.post("/badges", verifyToken, async (req, res) => {
  try {
    const { badge } = req.body;

    if (!badge) {
      return res.status(400).json({
        message: "Badge name is required",
      });
    }

    let userStatus = await leaderboardModel.findOne({ userId: req.userId });

    if (!userStatus) {
      userStatus = await leaderboardModel.create({
        userId: req.userId,
        points: 0,
        rank: "Beginner",
        badges: [],
        trophies: [],
        totalTrophies: 0,
      });
    }

    if (!userStatus.badges.includes(badge)) {
      userStatus.badges.push(badge);
      await userStatus.save();
    }

    await userStatus.populate("userId", "username email");

    res.status(200).json({
      message: "Badge added successfully",
      userStatus,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error adding badge",
      err: err.message,
    });
  }
});

userStatusRoute.post("/trophies", verifyToken, async (req, res) => {
  try {
    const { trophy } = req.body;

    if (!trophy) {
      return res.status(400).json({
        message: "Trophy name is required",
      });
    }

    let userStatus = await leaderboardModel.findOne({ userId: req.userId });

    if (!userStatus) {
      userStatus = await leaderboardModel.create({
        userId: req.userId,
        points: 0,
        rank: "Beginner",
        badges: [],
        trophies: [],
        totalTrophies: 0,
      });
    }

    if (!userStatus.trophies.includes(trophy)) {
      userStatus.trophies.push(trophy);
      userStatus.totalTrophies = userStatus.trophies.length;
      await userStatus.save();
    }

    await userStatus.populate("userId", "username email");

    res.status(200).json({
      message: "Trophy added successfully",
      userStatus,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error adding trophy",
      err: err.message,
    });
  }
});

userStatusRoute.get("/leaderboard", async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await leaderboardModel
      .find({})
      .populate("userId", "username email")
      .sort({ points: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      message: "Leaderboard retrieved successfully",
      leaderboard,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving leaderboard",
      err: err.message,
    });
  }
});

module.exports = userStatusRoute;
