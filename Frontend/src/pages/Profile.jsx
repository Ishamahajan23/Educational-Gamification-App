import React, { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [userStats, setUserStats] = useState(null);

  const [editableData, setEditableData] = useState({});
  const userData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const res = await fetch(
        "https://educational-gamification-app.onrender.com/user-status/status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await res.json();
      console.log(data);

      const userData = data.userStatus
        ? {
            name: data.userStatus.userId.username,
            email: data.userStatus.userId.email || "",
            points: data.userStatus.points,
            rank: data.userStatus.rank,
            badges: data.userStatus.badges,
            trophies: data.userStatus.trophies,
          }
        : data;

      setUser(userData);

      const totalQuizzes =
        userData.badges?.length + userData.trophies?.length || 0;
      const averageScore =
        totalQuizzes > 0 ? Math.round(userData.points / totalQuizzes / 10) : 0;

      setUserStats({
        rank: userData.rank,
        totalQuizzes: totalQuizzes,
        averageScore: Math.min(averageScore, 100),
        totalPoints: userData.points,
        globalRank: userData.rank,
      });

      setEditableData({
        name: userData.name || "",
        email: userData.email || "",
        bio: "",
        favoriteSubject: "",
        learningGoal: "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data");
      setLoading(false);
    }
  };

  useEffect(() => {
    userData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        `https://educational-gamification-app.onrender.com/profile/get-profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const profileData = await response.json();
        setEditableData((prev) => ({
          ...prev,
          bio: profileData.bio || "",
          favoriteSubject: profileData.favoriteSubject || "",
          learningGoal: profileData.learningGoal || "",
        }));
      } else {
        throw new Error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setError("Failed to load user profile");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `https://educational-gamification-app.onrender.com/profile/update-profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bio: editableData.bio,
            favoriteSubject: editableData.favoriteSubject,
            learningGoal: editableData.learningGoal,
          }),
        }
      );

      if (response.ok) {
        const updatedProfile = await response.json();
        setEditableData((prev) => ({
          ...prev,
          bio: updatedProfile.bio || "",
          favoriteSubject: updatedProfile.favoriteSubject || "",
          learningGoal: updatedProfile.learningGoal || "",
        }));
        setIsEditing(false);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#B3E0EF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B3E0EF] to-[#C97E2A] p-6">
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {editableData.name}
              </h1>
              <p className="text-xl text-indigo-600 font-semibold mb-1">
                {userStats?.rank || "Beginner"}
              </p>
              <p className="text-gray-600 text-lg">{editableData.email}</p>
            </div>

            <div className="flex flex-col gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className=" bg-[#C97E2A] text-white px-6 py-3 rounded-lg hover:bg-[#B4DDE8] hover:text-[#C97E2A] transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className=" bg-[#C97E2A] text-white px-4 py-2 rounded hover:bg-[#B4DDE8] hover:text-[#C97E2A] transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Learning Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#B3E0EF] text-[#CA7F2A] p-6 rounded-xl text-center hover:transform hover:scale-105 transition-transform">
              <div className="text-3xl font-bold mb-2">
                {userStats?.totalQuizzes || 0}
              </div>
              <div className="text-sm opacity-90">Quizzes Completed</div>
            </div>
            <div className="bg-[#B3E0EF] text-[#CA7F2A] p-6 rounded-xl text-center hover:transform hover:scale-105 transition-transform">
              <div className="text-3xl font-bold mb-2">
                {userStats?.averageScore || 0}%
              </div>
              <div className="text-sm opacity-90">Average Score</div>
            </div>
            <div className="bg-[#B3E0EF] text-[#CA7F2A] p-6 rounded-xl text-center hover:transform hover:scale-105 transition-transform">
              <div className="text-3xl font-bold mb-2">
                {userStats?.totalPoints || 0}
              </div>
              <div className="text-sm opacity-90">Total Points</div>
            </div>
            <div className="bg-[#B3E0EF] text-[#CA7F2A] p-6 rounded-xl text-center hover:transform hover:scale-105 transition-transform">
              <div className=" text-md md:text-3xl font-bold mb-2 text-center">
                #{userStats?.globalRank || 0}
              </div>
              <div className="text-sm opacity-90">Global Rank</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Personal Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editableData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none min-h-[100px] resize-vertical"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-700">
                    {editableData.bio || "No bio available"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Favorite Subject
                </label>
                {isEditing ? (
                  <select
                    value={editableData.favoriteSubject}
                    onChange={(e) =>
                      handleInputChange("favoriteSubject", e.target.value)
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                    <option value="Literature">Literature</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-700">
                    {editableData.favoriteSubject ||
                      "No favorite subject selected"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Learning Goal
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableData.learningGoal}
                    onChange={(e) =>
                      handleInputChange("learningGoal", e.target.value)
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    placeholder="What do you want to achieve?"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-700">
                    {editableData.learningGoal || "No learning goal set"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Achievements
            </h2>
            <div className="space-y-4">
              {
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
                    <div className="text-2xl">🏆</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Quiz Master
                      </h3>
                      <p className="text-sm text-gray-600">
                        Completed 10 quizzes with 90%+ score
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Perfect Score
                      </h3>
                      <p className="text-sm text-gray-600">
                        Achieved 100% on Mathematics quiz
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
                    <div className="text-2xl">⚡</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Speed Learner
                      </h3>
                      <p className="text-sm text-gray-600">
                        Completed quiz in under 30 seconds
                      </p>
                    </div>
                  </div>
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
