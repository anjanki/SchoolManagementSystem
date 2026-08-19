const Admission = require('../models/Admission');
const User = require('../models/User');
const Student = require('../models/Student');

// Create admission application
exports.createAdmission = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      bloodGroup,
      applyingClass,
      email,
      phone,
      address,
      city,
      state,
      pinCode,
      fatherName,
      fatherOccupation,
      motherName,
      motherOccupation,
      guardianName,
      guardianPhone,
      guardianEmail,
      guardianOccupation,
      previousSchool,
      previousClass,
      previousPercentage,
      board,
      academicYear
    } = req.body;

    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Validation
    if (!firstName || !lastName || !email || !applyingClass) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing'
      });
    }

    // Check if email already has pending or approved admission
    const existingAdmission = await Admission.findOne({
      userId: req.user.id,
      status: { $in: ['PENDING', 'APPROVED'] }
    });

    if (existingAdmission) {
      return res.status(409).json({
        success: false,
        message: 'An admission application already exists for this email'
      });
    }

    // Generate application ID
    const applicationId = `ADM${Date.now().toString().slice(-8)}`;

    const admission = new Admission({
      applicationId,
      userId: req.user.id,
      studentId: student._id,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      bloodGroup,
      applyingClass,
      email,
      phone,
      address,
      city,
      state,
      pinCode,
      fatherName,
      fatherOccupation,
      motherName,
      motherOccupation,
      guardianName,
      guardianPhone,
      guardianEmail,
      guardianOccupation,
      previousSchool,
      previousClass,
      previousPercentage,
      board,
      academicYear,
      status: 'PENDING'
    });

    await admission.save();

    res.status(201).json({
      success: true,
      message: 'Admission application submitted successfully',
      data: { admission }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get applications belonging to the authenticated student
exports.getStudentAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { admissions } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentAdmissionById = async (req, res) => {
  try {
    const admission = await Admission.findOne({ _id: req.params.id, userId: req.user.id });
    if (!admission) return res.status(404).json({ success: false, message: 'Admission not found' });
    res.status(200).json({ success: true, data: { admission } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStudentAdmission = async (req, res) => {
  try {
    const admission = await Admission.findOne({ _id: req.params.id, userId: req.user.id });
    if (!admission) return res.status(404).json({ success: false, message: 'Admission not found' });
    if (admission.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Only pending admissions can be updated' });
    }
    Object.assign(admission, req.body);
    await admission.save();
    res.status(200).json({ success: true, message: 'Admission updated successfully', data: { admission } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all admissions
exports.getAllAdmissions = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    
    let query = {};

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { applicationId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const admissions = await Admission.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Admission.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Admissions fetched successfully',
      data: {
        admissions,
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

// Get admission by ID
exports.getAdmissionById = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admission fetched successfully',
      data: { admission }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Approve admission
exports.approveAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    const admission = await Admission.findById(id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    if (admission.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Only pending admissions can be approved'
      });
    }

    // Check if student account already exists
    let student = await Student.findOne({ email: admission.email });

    if (!student) {
      if (!process.env.ADMISSION_DEFAULT_PASSWORD) {
        return res.status(500).json({
          success: false,
          message: 'Admission account password is not configured on the server'
        });
      }

      // Create user account
      const user = new User({
        firstName: admission.firstName,
        lastName: admission.lastName,
        email: admission.email,
        password: process.env.ADMISSION_DEFAULT_PASSWORD,
        role: 'STUDENT',
        status: 'Active'
      });

      await user.save();

      // Create student profile
      const studentCount = await Student.countDocuments();
      const studentId = `STU${String(studentCount + 1).padStart(6, '0')}`;

      student = new Student({
        userId: user._id,
        studentId,
        firstName: admission.firstName,
        lastName: admission.lastName,
        email: admission.email,
        phone: admission.phone,
        dateOfBirth: admission.dateOfBirth,
        gender: admission.gender,
        bloodGroup: admission.bloodGroup,
        className: admission.applyingClass,
        fatherName: admission.fatherName,
        motherName: admission.motherName,
        address: admission.address,
        city: admission.city,
        state: admission.state,
        pinCode: admission.pinCode,
        previousSchool: admission.previousSchool,
        previousClass: admission.previousClass,
        previousPercentage: admission.previousPercentage,
        academicYear: admission.academicYear,
        status: 'Active'
      });

      await student.save();
    }

    // Update admission
    admission.status = 'APPROVED';
    admission.approvedBy = req.user.id;
    admission.approvalDate = new Date();
    admission.reviewedAt = new Date();
    admission.studentId = student._id;

    await admission.save();

    res.status(200).json({
      success: true,
      message: 'Admission approved successfully',
      data: { admission, student }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reject admission
exports.rejectAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const admission = await Admission.findById(id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    if (admission.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Only pending admissions can be rejected'
      });
    }

    admission.status = 'REJECTED';
    admission.rejectionReason = rejectionReason || '';
    admission.approvedBy = req.user.id;
    admission.approvalDate = new Date();
    admission.reviewedAt = new Date();

    await admission.save();

    res.status(200).json({
      success: true,
      message: 'Admission rejected successfully',
      data: { admission }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
