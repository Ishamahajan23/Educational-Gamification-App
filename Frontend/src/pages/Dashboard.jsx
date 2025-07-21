import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SpotlightCard from "../../reactbits/SpotlightCard/SpotlightCard"
import Loader from "../components/Loader";

const Dashboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  useEffect(() => {

    if (location.state?.fromQuiz) {
      fetchUserData();
    }
  }, [location.state]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);

      const userResponse = await fetch(
        "https://educational-gamification-app.onrender.com/user-status/status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user status");
      }

      const userData = await userResponse.json();
      setUserInfo({
        username: userData.userStatus.userId.username,
        points: userData.userStatus.points,
        badges: userData.userStatus.badges,
        trophies: userData.userStatus.trophies,
        rank: userData.userStatus.rank,
      });
      const leaderboardResponse = await fetch(
        "https://educational-gamification-app.onrender.com/user-status/leaderboard?limit=10",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!leaderboardResponse.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const leaderboardData = await leaderboardResponse.json();
      setLeaderboard(
        leaderboardData.leaderboard.map((user) => ({
          username: user.userId.username,
          points: user.points,
          badges: user.badges,
          trophies: user.trophies,
        }))
      );

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching data:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#B3E0EF] to-[#E8F4F8] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#B3E0EF] to-[#E8F4F8] flex items-center justify-center">
        <div className="text-2xl font-semibold text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#B3E0EF] to-[#E8F4F8] flex items-center justify-center">
        <div className="text-2xl font-semibold text-[#8B5C1B]">
          No user data available
        </div>
      </div>
    );
  }

  const playSoundAndStart = (game) => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);

    setTimeout(() => {
      navigate(`/quiz/${game}`, { state: { fromQuiz: true } });
    }, 300);
  };

  return (
    <SpotlightCard className="custom-spotlight-card" spotlightColor="#C97E2A">
  
        <div className="flex justify-between items-center mb-8 md:flex-row flex-col ">
          <h1 className="text-4xl font-bold text-[#8B5C1B] text-center flex-1">
            🎮 Game Dashboard
          </h1>
          <button
            onClick={fetchUserData}
            className="bg-[#82576C] text-white px-4 py-2 rounded-lg hover:bg-[#CB8029] transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>

        {/* User Stats */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-6 mb-8 border border-[#B3E0EF]">
          <h2 className="text-2xl font-semibold text-[#8B5C1B] mb-4">
            👤 Your Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-[#B3E0EF] rounded-lg">
              <h3 className="text-lg font-semibold text-[#8B5C1B]">Username</h3>
              <p className="text-[#336422] font-mono">{userInfo.username}</p>
            </div>
            <div className="text-center p-4 bg-[#B3E0EF] rounded-lg">
              <h3 className="text-lg font-semibold text-[#8B5C1B]">Points</h3>
              <p className="text-2xl font-bold text-[#CB8029]">
                {userInfo.points}
              </p>
            </div>
            <div className="text-center p-4 bg-[#B3E0EF] rounded-lg">
              <h3 className="text-lg font-semibold text-[#8B5C1B]">Rank</h3>
              <p className="text-xl text-[#336422]">🏅 {userInfo.rank}</p>
            </div>
            <div className="text-center p-4 bg-[#B3E0EF] rounded-lg">
              <h3 className="text-lg font-semibold text-[#8B5C1B]">Badges</h3>
              <p className="text-xl text-[#336422]">
                🎖️ {userInfo.badges.length}
              </p>
            </div>
            <div className="text-center p-4 bg-[#B3E0EF] rounded-lg">
              <h3 className="text-lg font-semibold text-[#8B5C1B]">Trophies</h3>
              <p className="text-xl text-[#CB8029]">
                🏆 {userInfo.trophies.length}
              </p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-6 mb-8 border border-[#B3E0EF]">
          <h2 className="text-2xl font-semibold text-[#8B5C1B] mb-4">
            🏆 Leaderboard
          </h2>
          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <div
                key={user.username}
                className={`flex justify-between items-center p-4 rounded-lg transition-all duration-300 ${
                  user.username === userInfo.username
                    ? "bg-[#CB8029] text-white shadow-md"
                    : "bg-[#EAF7FB] hover:bg-[#B3E0EF]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : "🏅"}
                  </span>
                  <span className="font-semibold">
                    #{index + 1} {user.username}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-bold">XP: {user.points}</span>
                  <span>🎖️ {user.badges.length}</span>
                  <span>🏆 {user.trophies.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Games Grid */}

        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-6 border border-[#B3E0EF]">
          <h2 className="text-2xl font-semibold text-[#8B5C1B] mb-6">
            🎯 Available Games
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                name: "Math Quiz",
                icon: "🧮",
                difficulty: "Easy",
                points: 50,
                gamename: "math",
              },
              {
                name: "Science Challenge",
                icon: "🔬",
                difficulty: "Medium",
                points: 100,
                gamename: "science",
              },
              {
                name: "Geography Quiz",
                icon: "🌍",
                difficulty: "Easy",
                points: 50,
                gamename: "geography",
              },
            ].map((game) => (
              <div
                key={game.name}
                className="bg-white rounded-xl shadow-md p-6 border border-[#B3E0EF] hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{game.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-[#8B5C1B]">
                    {game.name}
                  </h3>
                  <p className="text-[#336422] mb-2">
                    Difficulty: {game.difficulty}
                  </p>
                  <p className="text-[#CB8029] font-bold mb-4">
                    Points: {game.points}
                  </p>
                  <button
                    onClick={() => playSoundAndStart(game.gamename)}
                    className="bg-[#82576C] text-white px-6 py-3 rounded-full hover:bg-[#CB8029] transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    🎮 Start Game
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
    </SpotlightCard>
  );
};

export default Dashboard;
