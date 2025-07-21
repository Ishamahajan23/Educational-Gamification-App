import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import Loader from "../components/Loader";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "https://educational-gamification-app.onrender.com/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        login(data.user || { email: formData.email }, data.access_token);
        navigate("/dashboard");
      } else {
        setError("Login failed. Please check your credentials.");
      }
      setLoading(false);
    } catch (err) {
      setError("An error occurred. Please try again.", err);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResetMessage("");

    try {
      const response = await fetch(
        "https://educational-gamification-app.onrender.com/user/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      if (response.ok) {
        setResetMessage("Password reset link sent to your email!");
        setForgotEmail("");
      } else {
        const errorData = await response.json();
        setError(
          errorData.message || "Failed to send reset email. Please try again."
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.",err);
    }
    setLoading(false);
  };

  const toggleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
    setError("");
    setResetMessage("");
    setForgotEmail("");
  };

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
        <Paper
          sx={{
            p: 4,
            width: 400,
            borderRadius: 2,
            height: forgotPassword ? "50vh" : "60vh",
          }}
        >
          <Typography variant="h4" gutterBottom>
            {forgotPassword ? "Reset Password" : "Login"}
          </Typography>
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}
          {resetMessage && (
            <Typography color="success.main" gutterBottom>
              {resetMessage}
            </Typography>
          )}

          {forgotPassword ? (
            <form onSubmit={handleForgotPassword}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
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
                Send Reset Link
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={toggleForgotPassword}
                sx={{ mb: 2 }}
              >
                Back to Login
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
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
                Login
              </Button>
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                <Button variant="text" onClick={toggleForgotPassword}>
                  Forgot Password?
                </Button>
              </Typography>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Don't have an account? <Link to="/signup">Sign up</Link>
              </Typography>
            </form>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Login;
