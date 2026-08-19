require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import models
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admission = require('../models/Admission');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Fee = require('../models/Fee');
const Notice = require('../models/Notice');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-management-system';
    await mongoose.connect(mongoURI);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Teacher.deleteMany({}),
      Admission.deleteMany({}),
      Attendance.deleteMany({}),
      Result.deleteMany({}),
      Fee.deleteMany({}),
      Notice.deleteMany({})
    ]);
    console.log('✓ Cleared existing data');

    // Create Admin User
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@school.com',
      password: 'Admin@123',
      role: 'ADMIN'
    });
    console.log('✓ Admin created: admin@school.com / Admin@123');

    // Create Sample Teachers
    const teachers = await Teacher.insertMany([
      {
        teacherId: 'TCH000001',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@school.com',
        phone: '9876543210',
        gender: 'Male',
        qualification: 'B.Tech in Physics',
        subject: 'Physics',
        department: 'Science',
        joinDate: new Date('2020-01-15'),
        experience: 4,
        status: 'Active'
      },
      {
        teacherId: 'TCH000002',
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@school.com',
        phone: '9876543211',
        gender: 'Female',
        qualification: 'M.Sc in Chemistry',
        subject: 'Chemistry',
        department: 'Science',
        joinDate: new Date('2019-07-20'),
        experience: 5,
        status: 'Active'
      },
      {
        teacherId: 'TCH000003',
        firstName: 'Arjun',
        lastName: 'Patel',
        email: 'arjun.patel@school.com',
        phone: '9876543212',
        gender: 'Male',
        qualification: 'B.A in English',
        subject: 'English',
        department: 'Humanities',
        joinDate: new Date('2021-06-10'),
        experience: 2,
        status: 'Active'
      }
    ]);
    console.log('✓ Teachers created');

    // Create Student Users and Profiles
    const studentUsers = [];
    const students = [];

    for (let i = 1; i <= 5; i++) {
      const user = await User.create({
        firstName: `Student${i}`,
        lastName: `User${i}`,
        email: `student${i}@school.com`,
        password: 'Student@123',
        role: 'STUDENT'
      });
      studentUsers.push(user);

      const student = await Student.create({
        userId: user._id,
        studentId: `STU${String(i).padStart(6, '0')}`,
        firstName: `Student${i}`,
        lastName: `User${i}`,
        email: `student${i}@school.com`,
        phone: `987654321${i}`,
        dateOfBirth: new Date(`2010-0${Math.min(i, 9)}-15`),
        gender: i % 2 === 0 ? 'Female' : 'Male',
        className: i <= 2 ? '10A' : i <= 4 ? '9A' : '8A',
        section: 'A',
        rollNumber: String(i),
        admissionDate: new Date(`2023-04-01`),
        address: `Address ${i}, School Road`,
        city: 'Delhi',
        state: 'Delhi',
        pinCode: '110001',
        fatherName: `Father ${i}`,
        fatherOccupation: 'Engineer',
        motherName: `Mother ${i}`,
        motherOccupation: 'Teacher',
        previousSchool: 'Central School',
        previousClass: 'IX',
        previousPercentage: 75 + i * 2,
        status: 'Active',
        academicYear: '2026-27'
      });
      students.push(student);
    }
    console.log('✓ Students created');

    // Create Admissions
    const admissions = await Admission.insertMany([
      {
        applicationId: 'ADM000001',
        firstName: 'Mohit',
        lastName: 'Singh',
        email: 'mohit.admission@school.com',
        applyingClass: '6A',
        phone: '9999999001',
        fatherName: 'Rajesh Singh',
        motherName: 'Sunita Singh',
        previousSchool: 'St. Mary School',
        previousClass: '5',
        previousPercentage: 80,
        status: 'PENDING',
        academicYear: '2026-27'
      },
      {
        applicationId: 'ADM000002',
        firstName: 'Anjali',
        lastName: 'Verma',
        email: 'anjali.admission@school.com',
        applyingClass: '7A',
        phone: '9999999002',
        fatherName: 'Vikram Verma',
        motherName: 'Deepa Verma',
        previousSchool: 'Delhi Public School',
        previousClass: '6',
        previousPercentage: 85,
        status: 'APPROVED',
        studentId: students[0]._id,
        approvalDate: new Date(),
        academicYear: '2026-27'
      }
    ]);
    console.log('✓ Admissions created');

    // Create Attendance Records
    const attendanceRecords = [];
    for (let i = 0; i < 10; i++) {
      attendanceRecords.push({
        studentId: students[0]._id,
        className: students[0].className,
        section: 'A',
        date: new Date(new Date().getTime() - i * 86400000),
        status: Math.random() > 0.2 ? 'Present' : 'Absent',
        markedBy: adminUser._id
      });
    }
    await Attendance.insertMany(attendanceRecords);
    console.log('✓ Attendance records created');

    // Create Results
    const results = await Result.insertMany([
      {
        studentId: students[0]._id,
        className: '10A',
        academicYear: '2026-27',
        exam: 'Unit Test 1',
        subject: 'Physics',
        marksObtained: 85,
        maximumMarks: 100,
        remarks: 'Good performance'
      },
      {
        studentId: students[0]._id,
        className: '10A',
        academicYear: '2026-27',
        exam: 'Unit Test 1',
        subject: 'Chemistry',
        marksObtained: 78,
        maximumMarks: 100,
        remarks: 'Average performance'
      },
      {
        studentId: students[1]._id,
        className: '10A',
        academicYear: '2026-27',
        exam: 'Unit Test 1',
        subject: 'Physics',
        marksObtained: 92,
        maximumMarks: 100,
        remarks: 'Excellent performance'
      }
    ]);
    console.log('✓ Results created');

    // Create Fee Records
    const fees = await Fee.insertMany([
      {
        studentId: students[0]._id,
        className: '10A',
        section: 'A',
        academicYear: '2026-27',
        month: 'April',
        totalFee: 5000,
        paidAmount: 5000,
        status: 'PAID',
        paidDate: new Date(),
        paymentMethod: 'Bank Transfer'
      },
      {
        studentId: students[1]._id,
        className: '10A',
        section: 'A',
        academicYear: '2026-27',
        month: 'April',
        totalFee: 5000,
        paidAmount: 0,
        status: 'PENDING',
        dueDate: new Date(new Date().getTime() + 15 * 86400000)
      },
      {
        studentId: students[2]._id,
        className: '9A',
        section: 'A',
        academicYear: '2026-27',
        month: 'April',
        totalFee: 4500,
        paidAmount: 2500,
        status: 'PARTIAL'
      }
    ]);
    console.log('✓ Fee records created');

    // Create Notices
    const notices = await Notice.insertMany([
      {
        title: 'Unit Test Schedule for Class 10',
        description: 'Unit tests for class 10 will be held from 1st to 15th May 2026. Syllabus and study materials are available on the school portal.',
        category: 'Academic',
        published: true,
        publishedDate: new Date(),
        createdBy: adminUser._id
      },
      {
        title: 'Summer Vacation Notice',
        description: 'School will remain closed for summer vacation from 1st June to 15th July 2026. Classes will resume on 16th July 2026.',
        category: 'Holiday',
        published: true,
        publishedDate: new Date(),
        createdBy: adminUser._id
      },
      {
        title: 'Annual Sports Day',
        description: 'Annual Sports Day will be held on 25th April 2026. All students are requested to participate in various events.',
        category: 'Events',
        published: true,
        publishedDate: new Date(),
        expiryDate: new Date(new Date().getTime() + 30 * 86400000),
        createdBy: adminUser._id
      }
    ]);
    console.log('✓ Notices created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Demo Credentials:');
    console.log('   Admin Email: admin@school.com');
    console.log('   Admin Password: Admin@123');
    console.log('\n   Student Email: student1@school.com');
    console.log('   Student Password: Student@123');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
