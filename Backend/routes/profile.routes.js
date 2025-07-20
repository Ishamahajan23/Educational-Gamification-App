const express = require("express");
const jwt = require("jsonwebtoken");
const profileRoute = express.Router();

const profileModel = require("../model/userprofile.model");

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

profileRoute.use(verifyToken);

profileRoute.get("/get-profile", async (req, res) => {
  try {
    const userId = req.userId;
    let profileData = await profileModel.findOne({ userId });

    if (!profileData) {
      profileData = await profileModel.create({
        userId,
        bio: "",
        favoriteSubject: "",
        learningGoal: "",
        avatar: "",
      });
    }

    res.status(200).json(profileData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

profileRoute.put("/update-profile", async (req, res) => {
  try {
    const userId = req.userId;
    const { bio, favoriteSubject, learningGoal, avatar } = req.body;

    const updatedProfile = await profileModel.findOneAndUpdate(
      { userId },
      { bio, favoriteSubject, learningGoal, avatar },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = profileRoute;
