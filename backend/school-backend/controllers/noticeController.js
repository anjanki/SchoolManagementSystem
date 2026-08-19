const Notice = require('../models/Notice');

// Create notice
exports.createNotice = async (req, res) => {
  try {
    const { title, description, category, expiryDate } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const notice = new Notice({
      title,
      description,
      category: category || 'General',
      expiryDate,
      createdBy: req.user.id,
      published: false
    });

    await notice.save();

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: { notice }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all notices
exports.getAllNotices = async (req, res) => {
  try {
    const { category, published, search, page = 1, limit = 10 } = req.query;

    let query = { published: published === 'true' || published === true };

    if (category) query.category = category;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notices = await Notice.find(query)
      .populate('createdBy', 'firstName lastName email')
      .sort({ publishedDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notice.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Notices fetched successfully',
      data: {
        notices,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get notice by ID
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('createdBy', 'firstName lastName email');

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notice fetched successfully',
      data: { notice }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Publish notice
exports.publishNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        published: true,
        publishedDate: new Date()
      },
      { new: true }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notice published successfully',
      data: { notice }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update notice
exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notice updated successfully',
      data: { notice }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete notice
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
