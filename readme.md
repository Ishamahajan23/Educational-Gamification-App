# Educational Gamification App

## Introduction

The Educational Gamification App is an interactive learning platform that transforms traditional educational content into engaging, game-like experiences. Students can earn points, unlock achievements, and compete with peers while mastering various subjects. The platform combines educational content with gaming mechanics to enhance motivation, retention, and overall learning outcomes.

## Project Type

Fullstack

## Deployed App

Frontend: https://educational-gamification-app-1.onrender.com  
Backend: https://educational-gamification-app.onrender.com
Database: MongoDB Atlas

## Directory Structure

```
Educational-Gamification-App/
├─ backend/
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ middleware/
│  └─ config/
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ context/
│  │  └─ utils/
│  ├─ public/
│  └─ package.json
└─ docs/
```

## Video Walkthrough of the project


## Video Walkthrough of the codebase



## Features

- **User Authentication**: Secure registration and login system with role-based access
- **Gamified Learning Modules**: Interactive lessons with points, badges, and progress tracking
- **Achievement System**: Unlock badges and rewards for completing challenges
- **Leaderboards**: Competitive rankings to motivate students
- **Progress Analytics**: Detailed statistics on learning progress and performance
- **Quiz Engine**: Dynamic quizzes with immediate feedback and explanations


## Design Decisions & Assumptions

- **Microlearning Approach**: Content is broken into small, digestible modules to maintain engagement
- **Point-Based Reward System**: Uses a balanced point economy to avoid gaming addiction while maintaining motivation
- **Progressive Difficulty**: Assumes users prefer gradually increasing challenge levels
- **Mobile-First Design**: Prioritizes mobile experience as primary platform for students
- **Real-Time Updates**: Implements WebSocket connections for live leaderboard updates
- **Modular Architecture**: Separates game mechanics from educational content for easy scaling

## Installation & Getting started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm start
```

### Database Setup

```bash
npm run seed
```

## Usage

1. **Student Registration**: Create an account and complete profile setup
3. **Complete Modules**: Engage with interactive lessons and earn points
4. **Track Progress**: Monitor achievements and statistics in the dashboard
5. **Compete**: Participate in leaderboards and challenges

## Credentials

**Demo Account:**

- Email: ishamahajan2325@gmail.com
- Password: isha123

## APIs Used

- **OpenAI API**: For generating dynamic quiz questions and explanations
- **SendGrid**: Email notifications and progress reports
- **Google Analytics**: User behavior tracking and engagement metrics

## API Endpoints

### Authentication

- `POST /user/signup` - Create new user account
- `POST /user/login` - User login
- `POST /user/logout` - User logout
- `POST /user/forgot-password` -  forget password
- `POST /user/reset-password/:token` - reset password

### User Management

- `GET /user-status/status` - Get user profile
- `PUT /user-status/points` - Update user profile
- `POST /user-status/badges` - update user badges
- `POST /user-status/trophies` - update user trophies
- `GET /user-status/leaderboard`- get leaderboard data
- `GET /profile/get-profile` - get user profile data
- `PUT /profile//update-profile` - update user profile


### Quiz 
- `GET /quiz/math` - get math quiz questions
- `GET /quiz/science` - get math science questions
- `GET /quiz/geography` - get math geography questions


## Technology Stack

**Frontend:**

- React.js - Component-based UI framework
- Material-UI - Component library and design system
- Socket.io-client - Real-time updates

**Backend:**

- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - NoSQL database
- Mongoose - MongoDB object modeling
- JWT - Authentication tokens
- Socket.io - WebSocket implementation
- Bcrypt - Password hashing
- nodemailer - Send email to user

**DevOps & Deployment:**

- Render - Frontend deployment
- Render - Backend deployment
- MongoDB Atlas - Cloud database
- GitHub Actions - CI/CD pipeline
