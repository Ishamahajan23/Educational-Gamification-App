import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:3000/user/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successful! Redirecting to login...");
        setNewPassword("");
        setConfirmPassword("");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setError("Network error. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#B3E0EF",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
        </div>

        <div className="p-6">
          {/* Alert Messages */}
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

          {!error && token && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 transition duration-200"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {!token && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Invalid reset link</p>
              <button
                onClick={() => navigate("/settings")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Request New Reset Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
