const express = require("express");
const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";
var jwt = require("jsonwebtoken");
const userRoute = express.Router();

userRoute.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        res.status(500).json({
          message: "something went wrong",
          err: err.message,
        });
      } else {
        await userModel.create({ username, email, password: hash });
        res.status(200).json({
          message: "sign up success",
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
      err: err.message,
    });
  }
});

userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    let hash = user.password;
    bcrypt.compare(password, hash, function (err, result) {
      if (result) {
        var token = jwt.sign(
          {
            userId: user._id,
            email: user.email,
          },
          process.env.JWT_SECRET_KEY
        );

        res.status(200).json({
          message: "login successful",
          access_token: token,
        });
      } else {
        res.status(500).json({
          message: "login failed",
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
      err: err.message,
    });
  }
});

// userRoute.get("/users", async (req, res) => {
//   try {
//     if (!req.headers.authorization) {
//       return res.status(401).json({
//         message: "Authorization header missing",
//       });
//     }

//     let token = req.headers.authorization.split(" ")[1];
//     var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     res.status(200).json({
//       message: "users successful",
//       userId: decoded.userId,
//       email: decoded.email,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "something went wrong",
//       err: err.message,
//     });
//   }
// });

userRoute.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found with this email",
      });
    }

    const resetToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        type: "password_reset",
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ishamahajan933@gmail.com",
        pass: process.env.APP_PASS,
      },
    });
    const resetURL = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/user/reset-password/${resetToken}`;

    const mailOptions = {
      from: "ishamahajan933@gmail.com",
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.username},</p>
        <p>You have requested to reset your password. Please click the link below to reset your password:</p>
        <p><a href="${resetURL}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>Or copy and paste this link in your browser:</p>
        <p>${resetURL}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this password reset, please ignore this email.</p>
        <br>
        <p>Best regards,<br>Your App Team</p>
      `,
    };


    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Password reset email sent successfully",
      note: "Please check your email for reset instructions",
    });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({
      message: "Failed to send password reset email",
      err: err.message,
    });
  }
});

userRoute.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        message: "New password is required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.type !== "password_reset") {
      return res.status(400).json({
        message: "Invalid token type",
      });
    }

    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
      if (err) {
        return res.status(500).json({
          message: "Error hashing password",
          err: err.message,
        });
      }

      await userModel.findByIdAndUpdate(decoded.userId, { password: hash });

      res.status(200).json({
        message: "Password reset successful",
      });
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({
        message: "Reset token has expired",
      });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({
        message: "Invalid reset token",
      });
    }

    res.status(500).json({
      message: "something went wrong",
      err: err.message,
    });
  }
});

module.exports = userRoute;
