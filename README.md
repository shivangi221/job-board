# 💼 NextGen Careers - Full-Stack MERN Job Board Application

NextGen Careers is a fully responsive, full-stack Job Board platform designed to connect employers with job seekers. Built using the **MERN Stack** (MongoDB, Express.js, React, Node.js), it features secure role-based navigation and a live interactive search system.

---

## 🚀 Key Architectural Features
- **Adaptive Split-Grid Layout:** Seamlessly transitions from a dual-column authentication portal to an open workspace view based on login states.
- **Dynamic Live Search Pipeline:** Utilizes an active query stream to update matching available openings instantly from MongoDB on every keystroke.
- **Role-Based Workspaces:** Restricts access to sensitive components, unlocking the job deployment panel exclusively for verified Employer profiles.
- **Interactive Micro-Interactions:** Modern UI styling featuring smoothly animated hover states, micro-elevations, and structural notification feedback banners.

---

## 🛠️ Technological Stack

*   **Frontend:** React (Vite), Context API, Inline CSS Architecture, Axios HTTP Client.
*   **Backend:** Node.js, Express.js REST API Architecture.
*   **Database:** MongoDB via Mongoose Object Modeling.
*   **Security:** JSON Web Tokens (JWT) for secure user sessions and role validation.

---

## 📦 Project Setup & Installation

### Prerequisite Engine
Ensure you have [Node.js](https://nodejs.org/) and a local instance of [MongoDB](https://www.mongodb.com/try/download/community) running on your system.

### 1. Configuration of the Backend Server
```bash
# Move into the server module
cd backend

# Install operational dependencies
npm install


PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/jobboard
JWT_SECRET=your_system_secret_key_here

Backend
node server.js



Frontend

# Move into the user interface module
cd frontend

# Install operational dependencies
npm install

# Start the local development server
npm run dev
