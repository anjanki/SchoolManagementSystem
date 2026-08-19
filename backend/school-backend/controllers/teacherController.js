const Teacher = require('../models/Teacher');

// Create teacher
exports.createTeacher = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, gender, dateOfBirth, qualification, subject, department, joinDate, experience } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required'
      });
    }

    // Check if email already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Generate teacher ID
    const count = await Teacher.countDocuments();
    const teacherId = `TCH${String(count + 1).padStart(6, '0')}`;

    const teacher = new Teacher({
      teacherId,
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      qualification,
      subject,
      department,
      joinDate,
      experience,
      status: 'Active'
    });

    await teacher.save();

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: { teacher }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const { subject, status, search, sort, page = 1, limit = 10 } = req.query;

    let query = {};

    if (subject) query.subject = subject;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { teacherId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let sortQuery = { createdAt: -1 };
    if (sort) {
      const [field, order] = sort.split(':');
      sortQuery = { [field]: order === 'desc' ? -1 : 1 };
    }

    const teachers = await Teacher.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Teacher.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Teachers fetched successfully',
      data: {
        teachers,
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

// Get teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Teacher fetched successfully',
      data: { teacher }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Teacher updated successfully',
      data: { teacher }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
