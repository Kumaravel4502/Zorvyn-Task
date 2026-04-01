const Record = require('../models/Record');

// @desc    Get all active user's records or all records for admin (with filtering/pagination)
// @route   GET /api/records
// @access  Private
exports.getRecords = async (req, res, next) => {
  try {
    let query;

    // Build query based on role
    // Viewer can only see their own records. Admin/Analyst can see all records unless they filter.
    // Wait, let's keep it simple: Everyone can see all records based on requirements except Viewer who shouldn't edit.
    // Actually, "Analyst: Can view records and access insights". Let's say Records belong to users.
    // For this assignment, let's let Viewer see all records, Admin manage all records, Analyst view all records.
    
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query object
    query = Record.find(reqQuery).populate('createdBy', 'username email');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-date'); // Default sort by newest date
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Record.countDocuments(reqQuery);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const records = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }

    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: records.length,
      pagination,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single record
// @route   GET /api/records/:id
// @access  Private
exports.getRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id).populate('createdBy', 'username email');

    if (!record) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new record
// @route   POST /api/records
// @access  Private (Admin, Analyst)
exports.createRecord = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const record = await Record.create(req.body);

    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update record
// @route   PUT /api/records/:id
// @access  Private (Admin, Analyst)
exports.updateRecord = async (req, res, next) => {
  try {
    let record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }

    // Make sure user is Admin or the creator of the record
    if (record.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to update this record' });
    }

    record = await Record.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete record
// @route   DELETE /api/records/:id
// @access  Private (Admin)
exports.deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }

    await record.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
