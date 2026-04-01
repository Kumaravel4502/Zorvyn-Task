const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    
    // Only allow valid roles
    if (!['Viewer', 'Analyst', 'Admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role specified' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status
// @route   PUT /api/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status specified' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { status }, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
