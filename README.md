# FSD_Exp6: JWT Authentication & Role-Based Authorization (RBAC)

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)
![Express.js](https://img.shields.io/badge/Express.js-v4.19-blue)
![React](https://img.shields.io/badge/React-v18-cyan)
![Vite](https://img.shields.io/badge/Vite-v5-purple)
![MongoDB](https://img.shields.io/badge/MongoDB-v8%2Fv9-brightgreen)
![JWT](https://img.shields.io/badge/JWT-Stateless-orange)
![License](https://img.shields.io/badge/License-ISC-lightgrey)

> **Experiment 6 – Full Stack Development (FSD) Laboratory**  
> Implementation of JSON Web Token (JWT) Authentication and Role-Based Authorization in an **Event Management System** using the MERN stack (MongoDB, Express.js, React, Node.js).

---

## 🌟 Key Features

- **Stateless JWT Authentication**: Secure user registration and login issuing signed JSON Web Tokens (`HS256`).
- **Cryptographic Password Hashing**: Passwords are automatically salted and hashed using `bcryptjs` (10 rounds) before persistence.
- **Bearer Token Authorization**: REST API endpoints protected using standard `Authorization: Bearer <token>` headers.
- **Role-Based Access Control (RBAC)**:
  - `user`: Can view events, register, create new events, and view their own profile.
  - `admin`: Has administrative privileges, access to the admin dashboard, platform analytics, event moderation, and user management.
- **React Frontend Integration**:
  - Global `AuthContext` with automatic token verification and persistence in `localStorage`.
  - Dynamic Navbar displaying authenticated user details and role badges (`[ADMIN]` / `[USER]`).
  - Protected routes (`<ProtectedRoute>`) requiring valid session authentication.
  - Role-guarded routes (`<AdminRoute>`) redirecting unauthorized users to a dedicated `403 Forbidden` screen.
  - 1-Click demo credential autofill for instant testing and evaluation.
- **Automated Test Suite**: Pre-configured test runner (`test-auth.js`) validating 8 comprehensive authentication and authorization scenarios.
- **Postman Collection Included**: Ready-to-import Postman collection with environment variables and automated test assertions.

---

## 🏗️ Project Architecture

```
FSD_Exp6/
├── backend/
│   ├── models/
│   │   ├── User.js               # Mongoose schema, bcrypt pre-save hash, JWT generation
│   │   └── Event.js              # Event Management System model
│   ├── middleware/
│   │   └── authMiddleware.js     # protect (Bearer token verify), adminOnly (RBAC 403)
│   ├── controllers/
│   │   ├── authController.js     # register, login, getMe (current user profile)
│   │   ├── eventController.js    # getEvents, createEvent, deleteEvent
│   │   └── adminController.js    # admin dashboard statistics, user management
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth (register, login, me)
│   │   ├── eventRoutes.js        # /api/events (public view, protected create/delete)
│   │   └── adminRoutes.js        # /api/admin (protected + adminOnly)
│   ├── .env.example              # Template environment variables
│   ├── server.js                 # Express application & MongoDB connection
│   ├── seed.js                   # Pre-populates Admin and User demo accounts
│   ├── view-users.js             # Utility to inspect MongoDB users collection
│   ├── test-auth.js              # Automated test suite for all 8 test scenarios
│   └── Event_Management_Auth_RBAC.postman_collection.json  # Importable Postman collection
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state, token persistence, login/logout
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Dynamic navbar (User pill, [ADMIN]/[USER] badge)
│   │   │   ├── ProtectedRoute.jsx# Guards routes requiring authenticated JWT
│   │   │   └── AdminRoute.jsx    # Guards routes requiring role === 'admin'
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero, session state inspector, architecture pills
│   │   │   ├── Login.jsx         # Sign in with 1-click Admin/User demo autofill
│   │   │   ├── Register.jsx      # Sign up with role selector ('user' or 'admin')
│   │   │   ├── Events.jsx        # Explore events with category filters & delete action
│   │   │   ├── CreateEvent.jsx   # Protected event submission form
│   │   │   ├── AdminDashboard.jsx# Admin stats, live JWT inspector, user list
│   │   │   └── Unauthorized.jsx  # 403 Forbidden screen explaining RBAC restriction
│   │   ├── App.jsx               # React Router route definitions
│   │   └── index.css             # Polished UI styles
│   └── vite.config.js            # Vite config with backend API proxy (/api -> :5000)
│
├── EXPERIMENT_6_REPORT.md        # Comprehensive lab report with theory & code snippets
├── EXPERIMENT_6_REPORT.html      # Printable HTML report (Ctrl + P for formatted PDF)
└── package.json                  # Root npm runner scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally on `mongodb://127.0.0.1:27017`

### 2. Installation
Clone the repository:
```bash
git clone https://github.com/kirteexh/FSD_Exp6.git
cd FSD_Exp6
```

Install backend dependencies:
```bash
cd backend
npm install
```

Install frontend dependencies:
```bash
cd ../frontend
npm install
cd ..
```

---

## ⚙️ Configuration

In `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/event_management_exp6
JWT_SECRET=supersecretjwtkey_event_management_2026_secure!
JWT_EXPIRE=24h
```

---

## 🏃 Running the Application

### Step 1: Seed the Database
Populate demo Admin and User accounts along with sample events:
```bash
cd backend
node seed.js
```

**Pre-configured Demo Accounts:**
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@eventhub.com` | `Admin@123` |
| **User** | `john@eventhub.com` | `User@123` |

### Step 2: Start the Backend Server
```bash
cd backend
node server.js
```
The server will start on **`http://localhost:5000`**.

### Step 3: Start the React Frontend
In a new terminal:
```bash
cd frontend
npm run dev
```
Open your browser at **`http://localhost:3000`**.

---

## 🧪 Testing & Verification

### Automated Test Suite
Run the built-in test suite to verify all 8 core authentication and RBAC scenarios:
```bash
cd backend
node test-auth.js
```

**Test Output:**
```text
===============================================================
🧪 STARTING EXPERIMENT 6 AUTHENTICATION & RBAC TEST SUITE
===============================================================
✅ PASS: Test 1 - User Registration (POST /api/auth/register) -> 201 Created
✅ PASS: Test 2 - User Login (POST /api/auth/login) -> 200 OK
✅ PASS: Test 3 - Successful Token Verification (GET /api/auth/me) -> 200 OK
✅ PASS: Test 4 - Invalid Login Credentials -> 401 Unauthorized
✅ PASS: Test 5 - Protected Endpoint Without Token -> 401 Unauthorized
✅ PASS: Test 6 - Normal User Accessing Admin Endpoint -> 403 Forbidden
✅ PASS: Test 7 - Admin User Accessing Admin Endpoint -> 200 OK
✅ PASS: Test 8 - MongoDB Users Collection Inspection -> OK
===============================================================
🎉 ALL 8 TESTS PASSED SUCCESSFULLY!
===============================================================
```

### Postman Testing
Import [`backend/Event_Management_Auth_RBAC.postman_collection.json`](./backend/Event_Management_Auth_RBAC.postman_collection.json) directly into Postman to execute all requests with automated token extraction and variable management.

---

## 📑 API Endpoints Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Protected | Verify token & return current user profile |
| `GET` | `/api/events` | Public | Retrieve all events |
| `POST` | `/api/events` | Protected | Create a new event |
| `DELETE`| `/api/events/:id` | Protected / Admin | Delete event (Creator or Admin only) |
| `GET` | `/api/admin/dashboard`| Admin Only | Retrieve system analytics & stats |
| `GET` | `/api/admin/users` | Admin Only | Retrieve registered users list |
| `DELETE`| `/api/admin/users/:id` | Admin Only | Delete user account |

---

## 📄 License
This project is licensed under the ISC License.
