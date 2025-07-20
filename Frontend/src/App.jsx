import "./App.css";
import Header from "./components/Header";
import { Home } from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";
import NotFound from "./components/NotFound";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Setting from "./pages/Setting";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/quiz/:game" element={ 
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          } />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route

          path="/setting"
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/reset-password/:token"
          element={<ResetPassword />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
