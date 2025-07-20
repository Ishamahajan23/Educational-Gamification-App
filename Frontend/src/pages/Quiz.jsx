import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Quiz = ({ subject = "General" }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allQuestions, setAllQuestions] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const { game } = useParams();
  const navigate = useNavigate();

  async function fetchQuestions() {
    try {
      const response = await fetch(
        `https://educational-gamification-app.onrender.com/quiz/${game}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      console.log(data.quizzes);
      return data.quizzes || [];
    } catch (error) {
      console.error("Error fetching questions:", error);
      return [];
    }
  }

  const getRandomQuestions = (questionPool) => {
    if (questionPool.length === 0) return [];
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(5, questionPool.length));
  };

  useEffect(() => {
    const loadQuestions = async () => {
      const fetchedQuestions = await fetchQuestions();
      if (fetchedQuestions.length === 0) {
        setLoading(false);
        return;
      }
      setAllQuestions(fetchedQuestions);
      setQuestions(getRandomQuestions(fetchedQuestions));
      setStartTime(Date.now());
      setTimerActive(true);
      setLoading(false);
    };
    loadQuestions();
  }, [game]);

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => {
          if (timeLeft <= 1) {
            setShowResult(true);
            setTimerActive(false);
            awardBadgesAndTrophies(score, questions.length);
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else if (!timerActive || showResult) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, showResult, score, questions.length]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const updatePoints = async (newScore) => {
    try {
      const response = await fetch(
        `https://educational-gamification-app.onrender.com/quiz/points`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ points: newScore, operation: "add" }),
        }
      );
      console.log("Points updated:", newScore);
      if (!response.ok) {
        throw new Error("Failed to update points");
      }
      return true;
    } catch (error) {
      console.error("Error updating points:", error);
      return false;
    }
  };

  const updateBadges = async (badges) => {
    try {
      const response = await fetch(
        `https://educational-gamification-app.onrender.com/quiz/badges`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ badges }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update badges");
      }
      console.log("Badges updated:", badges);
      return true;
    } catch (error) {
      console.error("Error updating badges:", error);
      return false;
    }
  };

  const updateTrophies = async (trophies) => {
    try {
      const response = await fetch(
        `https://educational-gamification-app.onrender.com/quiz/trophies`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ trophies }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update trophies");
      }
      console.log("Trophies updated:", trophies);
      return true;
    } catch (error) {
      console.error("Error updating trophies:", error);
      return false;
    }
  };

  const awardBadgesAndTrophies = async (finalScore, totalQuestions) => {
    const badges = [];
    const trophies = [];
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
    const scorePercentage =
      (finalScore / (totalQuestions * (game === "science" ? 20 : 10))) * 100;

    const hasCompletedQuiz = localStorage.getItem(`completed_${game}`);
    if (!hasCompletedQuiz && scorePercentage >= 60) {
      badges.push("First Win");
      localStorage.setItem(`completed_${game}`, "true");
    }

    if (timeTaken < 30 && scorePercentage >= 80) {
      badges.push("Speed Master");
    }

    if (scorePercentage === 100) {
      badges.push("Quiz Expert");
    }

    if (scorePercentage >= 90) {
      trophies.push("Gold Trophy");
    } else if (scorePercentage >= 70) {
      trophies.push("Silver Trophy");
    } else if (scorePercentage >= 50) {
      trophies.push("Bronze Trophy");
    }

    if (badges.length > 0) {
      await updateBadges(badges);
    }
    if (trophies.length > 0) {
      await updateTrophies(trophies);
    }

    return { badges, trophies };
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correct) {
      if (game === "math") {
        const newScore = score + 10;
        setScore(newScore);
        updatePoints(10);
      } else if (game === "science") {
        const newScore = score + 20;
        setScore(newScore);
        updatePoints(20);
      } else if (game === "geography") {
        const newScore = score + 10;
        setScore(newScore);
        updatePoints(10);
      }
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      setShowResult(true);
      setTimerActive(false);
      awardBadgesAndTrophies(score, questions.length);
    }
  };

  const handleQuitGame = () => {
    if (
      window.confirm(
        "Are you sure you want to quit the game? Your progress will be lost."
      )
    ) {
      setTimerActive(false);
      navigate("/dashboard");
      setCurrentQuestion(0);
      setSelectedAnswer("");
      setScore(0);
      setShowResult(false);
    }
  };

  const handleBackToDashboard = async () => {
    await updatePoints(score);
    navigate("/dashboard");
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);
    setShowResult(false);
    setTimeLeft(300);
    setTimerActive(true);
    setStartTime(Date.now());
    setQuestions(getRandomQuestions(allQuestions));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-5 bg-blue-100 min-h-screen font-sans">
        
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-5 bg-blue-100 min-h-screen font-sans">
        <div className="bg-white rounded-2xl p-10 text-center shadow-lg">
          <h2 className="text-orange-600 mb-8 text-4xl font-bold">
            No Questions Available
          </h2>
          <p className="text-gray-600 mb-8">
            Sorry, no questions are available for this quiz category.
          </p>
          <button
            className="bg-gray-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-700 transition-all duration-300"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-4xl mx-auto p-5 bg-blue-100 min-h-screen font-sans">
        <div className="bg-white rounded-2xl p-10 text-center shadow-lg">
          <h2 className="text-orange-600 mb-8 text-4xl font-bold">
            Quiz Complete!
          </h2>
          {timeLeft === 0 && (
            <p className="text-red-600 mb-4 text-lg font-semibold">
              Time's up! Quiz automatically submitted.
            </p>
          )}
          <div className="mb-8">
            <span className="text-2xl text-gray-600 mr-4">Final Score:</span>
            <span className="text-5xl font-bold text-orange-600">{score}</span>
          </div>
          <div className="flex justify-center gap-5 flex-col sm:flex-row">
            <button
              className="bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-orange-700 hover:-translate-y-1 transition-all duration-300"
              onClick={restartQuiz}
            >
              Take Another Quiz
            </button>
            <button
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
              onClick={handleBackToDashboard}
            >
              Back to Dashboard
            </button>
            <button
              className="bg-gray-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-700 transition-all duration-300"
              onClick={handleQuitGame}
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-blue-100 font-sans md:p-2.5 min-h-screen bg-gradient-to-br from-[#B3E0EF] to-[#E8F4F8] p-6">
      <div className="flex justify-between items-center mb-8 p-5 bg-white rounded-xl shadow-md flex-col gap-4 md:flex-row md:gap-0 text-center md:text-left">
        <h1 className="text-orange-600 text-3xl font-bold m-0">
          {subject} Quiz
        </h1>
        <div className="flex gap-5 items-center">
          <div
            className={`text-xl font-bold px-4 py-2 rounded-lg ${
              timeLeft <= 60
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            Time: {formatTime(timeLeft)}
          </div>
          <span className="text-xl font-bold text-orange-600">
            Score: {score}
          </span>
          <button
            className="bg-red-600 text-white px-5 py-2.5 rounded-md hover:bg-red-700 transition-colors duration-300 text-base cursor-pointer border-none"
            onClick={handleQuitGame}
          >
            Quit Game
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center mb-8 p-5 md:p-2.5">
        {questions.map((_, index) => (
          <div key={index} className="flex items-center relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                index <= currentQuestion
                  ? index < currentQuestion
                    ? "bg-green-500 text-white"
                    : "bg-orange-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            {index < questions.length - 1 && (
              <div
                className={`w-15 h-0.5 mx-2.5 md:w-8 ${
                  index < currentQuestion ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-5">
          <span className="text-lg text-orange-600 font-bold">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm">
            {questions[currentQuestion].subject}
          </span>
        </div>

        <h2 className="text-2xl mb-8 text-gray-800 leading-relaxed md:text-xl">
          {questions[currentQuestion].question}
        </h2>

        <div className="flex flex-col gap-4 mb-8">
          {questions[currentQuestion].options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedAnswer === option
                  ? "border-orange-600 bg-white shadow-lg shadow-orange-200"
                  : "border-gray-300 bg-gray-50 hover:border-orange-600 hover:bg-white"
              }`}
              onClick={() => handleAnswerSelect(option)}
            >
              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold mr-4 text-sm">
                {String.fromCharCode(65 + index)}
              </div>
              <span className="text-lg text-gray-800">{option}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            className={`px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300 ${
              selectedAnswer
                ? "bg-orange-600 text-white hover:bg-orange-700 hover:-translate-y-1 cursor-pointer"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
          >
            {currentQuestion === questions.length - 1
              ? "Finish Quiz"
              : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
