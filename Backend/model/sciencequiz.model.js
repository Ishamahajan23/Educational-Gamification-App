const mongoose = require("mongoose");
const scienceQuizSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true },
    subject: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "ScienceQuiz",
  }
);
const ScienceQuizModel = mongoose.model("ScienceQuiz", scienceQuizSchema);
module.exports = ScienceQuizModel;