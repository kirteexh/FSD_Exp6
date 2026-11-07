# EXPERIMENT NO. 6

**Title:** Implementation of JWT Authentication and Role-Based Authorization  
**Course:** Full Stack Development (FSD) Laboratory  
**Name:** Kirteesh Rakshe  
**Class:** D15A  
**Roll No.:** 43  
**Date:** November 7, 2026  

---

## 1. Aim
To implement user authentication using JSON Web Tokens (JWT) and role-based authorization in a web application using React, Node.js, Express.js, and MongoDB.

---

## 2. Problem Statement
Implement a secure authentication system in the **Event Management System** application. Develop user registration and login functionality, securely store passwords using cryptographic hashing, generate and verify JWT tokens, and implement role-based access control (RBAC) to restrict access to protected routes and administrative operations. Integrate authentication with the React frontend and test the functionality using Postman.

---

## 3. Theory Questions & Detailed Answers

### Q1. What is JWT? Explain its structure and purpose.
**Answer:**  
A **JSON Web Token (JWT)** is an open, industry-standard (RFC 7519) compact and self-contained method for securely transmitting information between parties as a JSON object. This information is digitally signed, ensuring it can be verified and trusted.

A JWT consists of three parts separated by dots (`.`):
$$\text{JWT} = \text{Header} . \text{Payload} . \text{Signature}$$

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3...Iiwicm9sZSI6InVzZXIifQ.Signature_String
└───────────────┬──────────────────┘ └──────────────────────┬─────────────────┘ └────────┬────────┘
             Header                                      Payload                      Signature
```

1. **Header:** Contains token metadata, typically the token type (`JWT`) and the cryptographic signing algorithm used (such as `HMAC SHA256` or `RSA`).
   ```json
   {
     "alg": "HS256",
     "typ": "JWT"
   }
   ```
2. **Payload (Claims):** Contains the claims or statements about an entity (typically the user) and additional metadata (such as subject, issuer, and expiration time).
   ```json
   {
     "id": "6aeeb8d7a12a64886f4f41e5",
     "role": "admin",
     "iat": 1794029800,
     "exp": 1794116200
   }
   ```
3. **Signature:** Calculated by taking the base64-encoded header, the base64-encoded payload, a secret key, and passing them into the specified algorithm:
   $$\text{Signature} = \text{HMAC-SHA256}(\text{base64UrlEncode}(\text{header}) + "." + \text{base64UrlEncode}(\text{payload}), \text{secret})$$

**Purpose:**  
JWTs enable **stateless authentication**. Because the token contains all necessary user information and is tamper-proof due to the signature, the backend server does not need to store session states in memory or a database for every active user.

---

### Q2. Differentiate between authentication and authorization.

| Parameter | Authentication (AuthN) | Authorization (AuthZ) |
| :--- | :--- | :--- |
| **Definition** | Verifies **who** the user is (identity confirmation). | Verifies **what** permissions/resources the user can access. |
| **Process** | Validates user credentials (e.g., email + password, biometric, OTP). | Evaluates roles, policies, and privileges of an authenticated entity. |
| **Occurrence** | Always occurs **first** before authorization. | Occurs **after** successful authentication. |
| **Data Transmitted** | Passwords, tokens, credentials. | Roles, permissions, access control lists (ACLs). |
| **HTTP Status Failure** | `401 Unauthorized` | `403 Forbidden` |
| **Example** | Submitting email and password on `/api/auth/login`. | Restricting access to `/api/admin/dashboard` to users with `role: "admin"`. |

---

### Q3. Why are passwords hashed? What is the purpose of bcrypt?
**Answer:**  
Passwords must never be stored in plain text. If a database is breached or leaked, plain text passwords expose user accounts across multiple services. 

- **Hashing** is a one-way mathematical function that converts plain text into an irreversible fixed-length string. A hashed password cannot be mathematically decrypted back into the original plain text.
- **bcrypt** is a password-hashing function designed specifically for secure credential storage based on the Blowfish cipher:
  1. **Built-in Salt Generation:** bcrypt generates a random unique string (salt) concatenated with the password before hashing, which defends against precomputed rainbow table attacks.
  2. **Work Factor / Key Stretching:** bcrypt includes an adjustable cost factor (rounds). By default, 10 rounds make computing hashes computationally intensive for attackers attempting brute-force attacks, while remaining fast enough for genuine user logins.

---

### Q4. Explain the purpose of JWT signing and verification.
**Answer:**  
- **JWT Signing:** Performed by the authentication server when the user logs in. The server creates the signature using a private server-side secret key (`JWT_SECRET`). This ensures cryptographic authenticity: nobody without the secret key can generate a valid signature.
- **JWT Verification:** Performed on every protected incoming request. The server extracts the token, splits the header and payload, reapplies the secret key to compute the expected signature, and checks if it matches the received signature.
  - If the payload is modified by an attacker (e.g., changing `"role": "user"` to `"role": "admin"`), the computed signature will mismatch, and the request is immediately rejected.
  - The verification also checks expiration (`exp`) to reject expired tokens.

---

### Q5. What is middleware in Express.js? Explain its role in JWT authentication.
**Answer:**  
In Express.js, **middleware** is a function that has access to the request object (`req`), response object (`res`), and the `next` function in the application's request-response cycle.

```
Request ──> [Middleware 1: CORS] ──> [Middleware 2: protect (JWT)] ──> [Middleware 3: adminOnly] ──> Route Handler
```

**Role in JWT Authentication:**
1. Intercepts incoming HTTP requests to protected routes.
2. Extracts the JWT token from the `Authorization: Bearer <token>` header.
3. Invokes `jwt.verify(token, secret)` to validate the token's cryptographic integrity and expiration.
4. Retrieves the user record from the database and attaches it to `req.user`.
5. Calls `next()` if valid, allowing the request to proceed to the controller; otherwise, immediately terminates the cycle with a `401 Unauthorized` or `403 Forbidden` response.

---

### Q6. What is the purpose of Bearer Token in the Authorization header?
**Answer:**  
The **Bearer Token** scheme is part of the HTTP Authorization standard (RFC 6750). The term "Bearer" denotes that the bearer (holder) of the token is granted access to the protected resource without having to provide separate cryptographic proof of possession of a client key.

Format:
```http
Authorization: Bearer <jwt_token_string>
```
Using the standard header keeps authentication credentials distinct from request payload parameters, enables cross-origin resource sharing (CORS), conforms to RESTful architecture, and avoids exposing credentials in URL query strings.

---

### Q7. Differentiate between HTTP status codes 401 and 403.

| Feature | 401 Unauthorized | 403 Forbidden |
| :--- | :--- | :--- |
| **Meaning** | Unauthenticated / Invalid Authentication | Authenticated but Unauthorized |
| **Cause** | Missing token, malformed token, expired token, or incorrect credentials. | The identity is verified, but user role does not possess required privileges. |
| **Action** | Client should log in or provide valid credentials. | Client identity is known, but access is strictly disallowed regardless of retry. |
| **Example** | Requesting `/api/auth/me` without any Authorization header. | A user with role `"user"` attempting to access `/api/admin/dashboard`. |

---

### Q8. What is role-based access control (RBAC)?
**Answer:**  
**Role-Based Access Control (RBAC)** is a security paradigm that restricts system access based on the roles assigned to individual users within an organization or application.

Instead of assigning granular permissions to each user individually:
1. Permissions are assigned to specific **Roles** (e.g., `user`, `admin`, `organizer`).
2. Users are assigned one or more **Roles**.
3. Access decisions are enforced by checking if the user's active role includes the required permissions for that specific route or action.

In this Event Management System:
- **`user` role:** Can view events, register for events, create new events, and view their own profile.
- **`admin` role:** Can perform all regular user operations plus access the administrative dashboard, view all registered users, delete any event, and manage user accounts.

---

## 4. Key Source Code Snippets

### 4.1 Configuration of JWT Secret and Expiry in `.env`
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/event_management_exp6
JWT_SECRET=supersecretjwtkey_event_management_2026_secure!
JWT_EXPIRE=24h
```

---

### 4.2 Creation of the User Model Using Mongoose (`backend/models/User.js`)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
```

---

### 4.3 Password Hashing & JWT Generation (`backend/models/User.js`)
```javascript
// Pre-save hook: Hash password using bcrypt before persisting to MongoDB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT signed token with payload and expiration
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};
```

---

### 4.4 JWT Verification & Authentication Middleware (`backend/middleware/authMiddleware.js`)
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token verification failed or expired'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no Bearer token provided in Authorization header'
    });
  }
};
```

---

### 4.5 Role-Based Authorization Middleware (`backend/middleware/authMiddleware.js`)
```javascript
// Restricts route access strictly to administrator users
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Access denied. Admin privileges required.'
    });
  }
};

// General RBAC middleware for supporting arbitrary role permissions
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, adminOnly, authorize };
```

---

### 4.6 Creation of Authentication Routes (`backend/routes/authRoutes.js`)
```javascript
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes for user onboarding and session establishment
router.post('/register', register);
router.post('/login', login);

// Protected route: Retrieves authenticated user info and verifies token
router.get('/me', protect, getMe);

module.exports = router;
```

---

### 4.7 Integration of Authentication APIs in React (`frontend/src/context/AuthContext.jsx`)
```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Verify JWT on application startup
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${storedToken}` }
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setUser(data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!token && !!user, isAdmin: user?.role === 'admin', login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

### 4.8 Implementation of Protected & Role-Based Frontend Routes
#### `ProtectedRoute.jsx`
```javascript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Verifying session...</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};
```

#### `AdminRoute.jsx`
```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <div>Verifying administrator privileges...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/unauthorized" replace />;

  return children;
};
```

#### Route Definitions (`App.jsx`)
```jsx
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/events" element={<Events />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/unauthorized" element={<Unauthorized />} />

  {/* Protected User Route */}
  <Route path="/create-event" element={
    <ProtectedRoute>
      <CreateEvent />
    </ProtectedRoute>
  } />

  {/* Protected Admin Route */}
  <Route path="/admin" element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  } />
</Routes>
```

---

## 5. Screenshots & Execution Evidence Guide

### A. Postman Authentication Testing

| No. | Test Scenario | Method & Endpoint | Request Body / Headers | Expected Status & Result |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **User Registration** | `POST /api/auth/register` | Body (JSON): `name, email, password, role: "user"` | **`201 Created`**: Returns user profile and generated JWT token. |
| **2** | **User Login** | `POST /api/auth/login` | Body (JSON): `email: "john@eventhub.com", password: "User@123"` | **`200 OK`**: Returns valid JWT Bearer token and user object. |
| **3** | **Successful Token Verification** | `GET /api/auth/me` | Header: `Authorization: Bearer <user_token>` | **`200 OK`**: Successfully returns authenticated user profile. |
| **4** | **Invalid Login Credentials** | `POST /api/auth/login` | Body (JSON): correct email, invalid password | **`401 Unauthorized`**: Returns `"Invalid login credentials"`. |
| **5** | **Access Protected Endpoint Without Token** | `GET /api/auth/me` | No Authorization header | **`401 Unauthorized`**: Returns `"Not authorized, no Bearer token provided"`. |
| **6** | **Access Admin Endpoint using Normal User Token** | `GET /api/admin/dashboard` | Header: `Authorization: Bearer <user_token>` | **`403 Forbidden`**: Returns `"Forbidden: Access denied. Admin privileges required."` |

---

### B. Role-Based Authorization Testing

| No. | Test Scenario | Method & Endpoint | Request Details | Expected Status & Result |
| :--- | :--- | :--- | :--- | :--- |
| **7** | **Successful Access to Admin Endpoint using Admin Token** | `GET /api/admin/dashboard` | Header: `Authorization: Bearer <admin_token>` | **`200 OK`**: Access granted. Returns admin analytics, registered users count, and events summary. |
| **8** | **MongoDB Users Collection Inspection** | Query in mongosh / MongoDB Compass | `db.users.find({}, { password: 0 })` | Shows registered user records with distinct roles (`admin` and `user`), with password field hidden. |

---

### C. Frontend Integration Testing

| No. | Feature Screen | URL Route | Demonstration |
| :--- | :--- | :--- | :--- |
| **9** | **Registration Page** | `http://localhost:3000/register` | Input form for Full Name, Email, Password, and Role selection. |
| **10** | **Login Page** | `http://localhost:3000/login` | Login form with quick demo autofill buttons for Admin and User accounts. |
| **11** | **Updated Navbar after Login** | `http://localhost:3000/events` | Navbar displays user's name, role badge (`[USER]` or `[ADMIN]`), and Logout button. |
| **12** | **Access Restriction for Admin Page** | `http://localhost:3000/admin` | When accessed as standard user, application displays **403 Forbidden: Access Restricted** screen. |
| **13** | **Admin Dashboard for Admin User** | `http://localhost:3000/admin` | When accessed with Admin account, displays analytics cards, decoded JWT inspector, and user management table. |

---

## 6. How to Run the Project

### Prerequisites
1. **Node.js** (v18+)
2. **MongoDB** service running on `127.0.0.1:27017`

### Step 1: Start Backend Server
```bash
cd backend
npm install
node seed.js    # Pre-seeds admin and demo user accounts
node server.js  # Starts Express server on http://localhost:5000
```

### Step 2: Run Automated Auth Test Suite
In the backend folder:
```bash
node test-auth.js
```
This tests all 8 required scenarios and displays pass/fail status and HTTP responses.

### Step 3: Start React Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 7. Conclusion
In this experiment, a complete JWT-based authentication and role-based authorization (RBAC) system was successfully designed, implemented, and verified in the Event Management System using the MERN stack. Password security was guaranteed using salted bcrypt hashing, stateless token management was established via JSON Web Tokens, and fine-grained access control was enforced on both backend API routes and React frontend routes. All test cases were verified using automated scripts, Postman, and browser interfaces.

