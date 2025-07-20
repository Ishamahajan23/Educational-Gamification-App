const mongoose = require("mongoose");
const geographyQuizSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true },
    subject: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "GeographyQuiz",
  }
);
const GeographyQuizModel = mongoose.model("GeographyQuiz", geographyQuizSchema);
module.exports = GeographyQuizModel;