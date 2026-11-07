const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: protect
 * Purpose: Authenticates incoming requests by verifying the JWT Bearer token
 * Returns: 401 Unauthorized if token is missing, invalid, or expired
 */
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and follows the 'Bearer <token>' pattern
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Extract the token part after 'Bearer '
      token = req.headers.authorization.split(' ')[1];

      // Verify the JWT signature using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database excluding password field
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists'
        });
      }

      // Attach user object to the request
      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
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

/**
 * Middleware: adminOnly
 * Purpose: Restricts access to routes to users with role === 'admin'
 * Returns: 403 Forbidden if user is authenticated but not an admin
 */
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

/**
 * Middleware: authorize(...roles)
 * Purpose: General role-based access control (RBAC) middleware for multiple roles
 */
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

