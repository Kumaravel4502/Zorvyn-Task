const express = require('express');
const {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord
} = require('../controllers/record.controller');

const { protect, authorize } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

router.use(protect); // All record routes are protected

// Viewers can only read
router.route('/')
  .get(getRecords)
  .post(
    authorize('Admin', 'Analyst'),
    [
      body('amount', 'Amount is required and must be a number').isNumeric(),
      body('type', 'Type is required and must be either "income" or "expense"').isIn(['income', 'expense']),
      body('category', 'Category is required').notEmpty(),
      body('date', 'Date must be a valid date').optional().isISO8601()
    ],
    validate,
    createRecord
  );

router.route('/:id')
  .get(getRecord)
  .put(authorize('Admin', 'Analyst'), updateRecord)
  .delete(authorize('Admin'), deleteRecord);

module.exports = router;
