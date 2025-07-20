const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/user.route");
const userStatusRoute = require("./routes/userStatus.route");
const quizRoute = require("./routes/Quize.route");
const profileRoute = require("./routes/profile.routes");


const connectDB = require("./configs/db");
require("dotenv").config();

const app = express();
connectDB();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/user", userRoute);
app.use("/user-status", userStatusRoute);
app.use("/quiz", quizRoute);
app.use("/profile", profileRoute);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
