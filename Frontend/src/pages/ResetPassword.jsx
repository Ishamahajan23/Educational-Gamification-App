import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import Loader from "../components/Loader";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://educational-gamification-app-1.onrender.com/user/reset-password/${token}`,
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
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Reset password error:", err);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
          p: 2,
          height: "80vh",
        }}
      >
        <Paper sx={{ p: 4, width: 400, borderRadius: 2, textAlign: "center" }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Password reset successful!
          </Alert>
          <Typography variant="body1" gutterBottom>
            Your password has been successfully reset.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirecting to login page in 3 seconds...
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{ mt: 2 }}
            style={{ backgroundColor: "#C97E2A", color: "white" }}
          >
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        p: 2,
        height: "80vh",
      }}
    >
      {loading ? (
        <Loader />
      ) : (
        <Paper sx={{ p: 4, width: 400, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Reset Password
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{ backgroundColor: "#C97E2A", color: "white" }}
            >
              Reset Password
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Remember your password? <Link to="/login">Back to Login</Link>
            </Typography>
          </form>
        </Paper>
      )}
    </Box>
  );
};

export default ResetPassword;
