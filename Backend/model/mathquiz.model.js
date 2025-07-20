const mongoose = require("mongoose");
const mathQuizSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true },
    subject: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "MathQuiz",
  }
);
const MathQuizModel = mongoose.model("MathQuiz", mathQuizSchema);
module.exports = MathQuizModel;