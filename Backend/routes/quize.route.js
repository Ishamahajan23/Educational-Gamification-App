const express = require("express");
const mongoose = require("mongoose");
const quizRoute = express.Router();
const MathQuizModel = require("../model/mathQuiz.model");
const ScienceQuizModel = require("../model/sciencequiz.model");
const GeographyQuizModel = require("../model/geographyquiz.model");

quizRoute.get("/math", async(req, res)=>{
    try {
        const quizzes = await MathQuizModel.find();
        res.status(200).json({
            message: "Math quizzes fetched successfully",
            quizzes: quizzes
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching math quizzes",
            error: err.message
        });
    }
})

quizRoute.get("/science", async(req, res)=>{
    try {
        const quizzes = await ScienceQuizModel.find();
        res.status(200).json({
            message: "Science quizzes fetched successfully",
            quizzes: quizzes
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching science quizzes",
            error: err.message
        });
    }
})

quizRoute.get("/geography", async(req, res)=>{
    try {
        const quizzes = await GeographyQuizModel.find();
        res.status(200).json({
            message: "Geography quizzes fetched successfully",
            quizzes: quizzes
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching geography quizzes",
            error: err.message
        });
    }
})

module.exports = quizRoute;