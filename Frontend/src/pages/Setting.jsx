import React, { useState } from "react";

const Setting = () => {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "https://educational-gamification-app.onrender.com/user/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: forgotPasswordEmail }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Password reset email sent successfully! Please check your email."
        );
        setForgotPasswordEmail("");
      } else {
        setError(data.message || "Failed to send reset email");
      }
    } catch (err) {
      setError("Network error. Please try again.",err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B3E0EF] to-[#C97E2A] p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Forgot Password</h1>
        </div>

        <div className="p-6">
          {message && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email to reset password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C97E2A] text-white px-4 py-2 rounded hover:bg-[#B4DDE8] hover:text-[#C97E2A] disabled:opacity-50 transition duration-200"
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setting;
