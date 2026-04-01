const Record = require('../models/Record');

// @desc    Get dashboard summary statistics
// @route   GET /api/dashboard/summary
// @access  Private
exports.getDashboardSummary = async (req, res, next) => {
  try {
    // 1. Total Income, Expenses, and Net Balance
    const totalsAggregation = await Record.aggregate([
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;

    totalsAggregation.forEach(item => {
      if (item._id === 'income') totalIncome = item.totalAmount;
      if (item._id === 'expense') totalExpenses = item.totalAmount;
    });

    const netBalance = totalIncome - totalExpenses;

    // 2. Category-wise Totals (Expenses only for standard dashboard)
    const categoryTotals = await Record.aggregate([
      { $match: { type: 'expense' } },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // 3. Recent Activity (Last 5 records)
    const recentActivity = await Record.find()
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'username')
      .select('-__v');

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalIncome,
          totalExpenses,
          netBalance
        },
        categoryTotals,
        recentActivity
      }
    });

  } catch (error) {
    next(error);
  }
};
