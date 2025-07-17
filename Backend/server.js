const express = require("express");
const userRoute = require("./routes/user.route");
const connectDB = require("./configs/db");
require("dotenv").config();

const app = express();
connectDB();
app.use(express.json());

app.use("/user", userRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
