const User = require('../models/User');
const Event = require('../models/Event');

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Protected & Admin Only
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });
    const totalEvents = await Event.countDocuments();

    res.status(200).json({
      success: true,
      message: 'Admin authorization verified. Access granted to administrative dashboard.',
      data: {
        stats: {
          totalUsers,
          adminCount,
          userCount,
          totalEvents
        },
        requestedBy: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role
        }
      }
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin dashboard statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Get all users list
 * @route   GET /api/admin/users
 * @access  Protected & Admin Only
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users list',
      error: error.message
    });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Protected & Admin Only
 */
const deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot delete their own account'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: `User '${user.name}' deleted successfully`
    });
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  deleteUser
};

