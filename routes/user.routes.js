const express = require('express');
const { getUsers, updateUserRole, updateUserStatus } = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes below require Admin
router.use(protect);
router.use(authorize('Admin'));

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', updateUserStatus);

module.exports = router;
