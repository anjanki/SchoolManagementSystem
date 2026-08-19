# School Management System

A complete, production-quality full-stack School Management System built with Angular, Node.js, Express.js, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Directory Structure](#directory-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Seeding the Database](#seeding-the-database)
- [Demo Credentials](#demo-credentials)
- [API Documentation](#api-documentation)
- [Features Overview](#features-overview)
- [Project Workflow](#project-workflow)
- [Database Models](#database-models)
- [Security Features](#security-features)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

---

## 🎯 Features

### Admin Features
- **Dashboard Analytics**: Real-time KPI cards and charts
- **Student Management**: Add, edit, delete, search, filter, sort, and paginate students
- **Admission Management**: Process and approve/reject admission applications
- **Teacher Management**: Manage teacher profiles
- **Attendance Management**: Mark and track student attendance
- **Results Management**: Create and publish exam results
- **Fee Management**: Track fee collection and payments
- **Notice Management**: Create and publish school notices
- **Reports**: Attendance and fee collection reports

### Student Features
- **Dashboard**: View personal information and quick stats
- **Attendance Tracking**: View attendance records and percentages
- **Results**: View exam results and grades
- **Fees**: Track fee payments and due amounts
- **Profile Management**: View and manage profile information

### System-Wide Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin and Student roles with specific permissions
- **Search & Filtering**: Advanced search and filtering capabilities
- **Pagination**: Efficient data pagination
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Input Validation**: Frontend and backend validation
- **Error Handling**: Comprehensive error handling and user-friendly messages

---

## 💻 Technology Stack

### Frontend
- **Angular 21+**: Modern Angular framework with standalone components
- **TypeScript**: Type-safe programming language
- **RxJS**: Reactive programming library
- **HTML5 & CSS3**: Markup and styling
- **Angular Router**: Client-side routing
- **Angular Forms**: Reactive forms

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing and verification
- **Helmet**: HTTP security headers
- **CORS**: Cross-Origin Resource Sharing

---

## 🏗️ Project Architecture

```
┌─────────────────────┐
│   Angular Frontend  │
│   (localhost:4200)  │
└──────────┬──────────┘
           │
           │ HTTP REST API
           │
┌──────────▼──────────┐
│   Express.js API    │
│   (localhost:5000)  │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│     MongoDB         │
│  (School Database)  │
└─────────────────────┘
```

### Authentication Flow

```
┌────────────────┐
│  Login Page    │
└────────┬───────┘
         │
         ▼
┌────────────────────┐     ┌─────────────────┐
│ Verify Credentials │────▶│ Generate JWT    │
│ Check Password     │     │ Token           │
└────────────────────┘     └────────┬────────┘
                                    │
                                    ▼
                           ┌─────────────────┐
                           │ Store Token in  │
                           │ localStorage    │
                           └────────┬────────┘
                                    │
                                    ▼
                           ┌─────────────────┐
                           │ Route Guard     │
                           │ Validates Token │
                           └────────┬────────┘
                                    │
                                    ▼
                           ┌─────────────────┐
                           │ Dashboard       │
                           │ Authorized User │
                           └─────────────────┘
```

---

## 📁 Directory Structure

```
SchoolManagementSystem/
│
├── backend/
│   └── school-backend/
│       ├── config/
│       │   └── database.js                # MongoDB connection
│       ├── controllers/
│       │   ├── authController.js          # Authentication
│       │   ├── adminController.js         # Admin dashboard
│       │   ├── studentController.js       # Student CRUD
│       │   ├── admissionController.js     # Admission workflow
│       │   ├── attendanceController.js    # Attendance management
│       │   ├── resultController.js        # Results management
│       │   ├── feeController.js           # Fee management
│       │   ├── noticeController.js        # Notices
│       │   └── teacherController.js       # Teachers
│       ├── middleware/
│       │   ├── authMiddleware.js          # JWT validation
│       │   └── authorize.js               # Role-based access
│       ├── models/
│       │   ├── User.js                    # User schema
│       │   ├── Student.js                 # Student schema
│       │   ├── Admission.js               # Admission schema
│       │   ├── Teacher.js                 # Teacher schema
│       │   ├── Attendance.js              # Attendance schema
│       │   ├── Result.js                  # Result schema
│       │   ├── Fee.js                     # Fee schema
│       │   ├── Notice.js                  # Notice schema
│       │   └── Exam.js                    # Exam schema
│       ├── routes/
│       │   ├── authRoutes.js              # Auth endpoints
│       │   ├── studentRoutes.js           # Student endpoints
│       │   ├── admissionRoutes.js         # Admission endpoints
│       │   ├── teacherRoutes.js           # Teacher endpoints
│       │   ├── attendanceRoutes.js        # Attendance endpoints
│       │   ├── resultRoutes.js            # Result endpoints
│       │   ├── feeRoutes.js               # Fee endpoints
│       │   ├── noticeRoutes.js            # Notice endpoints
│       │   └── adminRoutes.js             # Admin dashboard endpoints
│       ├── seed/
│       │   └── seedDatabase.js            # Database seeding
│       ├── .env                           # Environment variables
│       ├── .env.example                   # Environment template
│       ├── server.js                      # Main server file
│       └── package.json                   # Dependencies
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/
│   │   │   │   │   └── auth.guard.ts      # Route protection
│   │   │   │   ├── interceptors/
│   │   │   │   │   └── auth.interceptor.ts # JWT injection
│   │   │   │   ├── models/
│   │   │   │   │   └── student.model.ts   # TypeScript interfaces
│   │   │   │   └── services/
│   │   │   │       ├── auth.service.ts    # Authentication
│   │   │   │       ├── api.service.ts     # HTTP requests
│   │   │   │       └── student.service.ts # Student operations
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── admin-login/       # Admin login page
│   │   │   │   │   └── student-login/     # Student login page
│   │   │   │   ├── admin/
│   │   │   │   │   ├── dashboard/         # Admin dashboard
│   │   │   │   │   ├── student-management/# Student management
│   │   │   │   │   ├── admission-management/# Admissions
│   │   │   │   │   ├── teacher-management/# Teachers
│   │   │   │   │   ├── attendance-management/# Attendance
│   │   │   │   │   ├── result-management/ # Results
│   │   │   │   │   ├── fee-management/    # Fees
│   │   │   │   │   └── notice-management/ # Notices
│   │   │   │   └── student/
│   │   │   │       ├── dashboard/         # Student dashboard
│   │   │   │       ├── profile/           # Profile page
│   │   │   │       ├── attendance/        # Attendance view
│   │   │   │       ├── results/           # Results view
│   │   │   │       └── fees/              # Fees view
│   │   │   ├── shared/
│   │   │   │   └── components/            # Reusable components
│   │   │   ├── app.routes.ts              # Route configuration
│   │   │   ├── app.ts                     # Root component
│   │   │   └── app.css                    # Global styles
│   │   ├── index.html                     # HTML entry point
│   │   ├── main.ts                        # Bootstrap file
│   │   └── styles.css                     # Global styles
│   ├── angular.json                       # Angular config
│   ├── tsconfig.json                      # TypeScript config
│   └── package.json                       # Dependencies
│
└── README.md                              # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v7 or higher) - Comes with Node.js
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### Recommended
- **Postman** - For API testing - [Download](https://www.postman.com/)
- **MongoDB Compass** - MongoDB GUI - [Download](https://www.mongodb.com/products/compass)
- **VS Code** - Code editor - [Download](https://code.visualstudio.com/)

---

## 🚀 Installation

### Step 1: Clone or Prepare the Repository

```bash
cd SchoolManagementSystem
```

### Step 2: Install Backend Dependencies

```bash
cd backend/school-backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../../frontend
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

1. Create a `.env` file in `backend/school-backend/`:

```bash
cp .env.example .env
```

2. Update `.env` with your settings:

```
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:4200
NODE_ENV=development
SEED_ADMIN_PASSWORD=<set-locally-for-seeding>
SEED_STUDENT_PASSWORD=<set-locally-for-seeding>
ADMISSION_DEFAULT_PASSWORD=<set-locally-for-admission-approval>
```

### MongoDB Setup

1. **Local MongoDB**:
   - Start MongoDB:
     ```bash
     mongod
     ```

2. **MongoDB Atlas (Cloud)**:
   - Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get connection string
   - Update `MONGODB_URI` in `.env`

---

## 🏃 Running the Application

### Terminal 1: Start MongoDB

```bash
mongod
```

### Terminal 2: Start Backend Server

```bash
cd backend/school-backend
npm run dev
```

Expected output:
```
✓ Server running on http://localhost:5000
✓ MongoDB connected successfully
```

### Terminal 3: Start Frontend Development Server

```bash
cd frontend
ng serve
```

Or:

```bash
npm start
```

Expected output:
```
Application bundle generation complete. [X.XXX seconds] - MM:SS:SS PM
✔ Compiled successfully.
```

### Access the Application

- **Admin Login**: [http://localhost:4200/admin-login](http://localhost:4200/admin-login)
- **Student Login**: [http://localhost:4200/student-login](http://localhost:4200/student-login)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🌱 Seeding the Database

Seed the database with demo data:

```bash
cd backend/school-backend
npm run seed
```

This will create:
- 1 Admin user
- 3 Teachers
- 5 Students
- 2 Admissions (pending & approved)
- Sample attendance records
- Sample results
- Sample fees
- Sample notices

---

## 🔐 Local Development Credentials

### Admin Login
- **Email**: `admin@school.com`
- **Password**: Use the locally configured seed password.

### Student Login
- **Email**: `student1@school.com`
- **Password**: Use the locally configured seed password.

---

## 📡 API Documentation

### Authentication Endpoints

#### Admin Login
```
POST /api/auth/admin-login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "<set-locally>"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "...",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@school.com",
      "role": "ADMIN"
    }
  }
}
```

#### Student Login
```
POST /api/auth/student-login
```

#### Verify Token
```
GET /api/auth/verify-token
Authorization: Bearer <token>
```

---

### Student Management Endpoints

#### Get All Students (with pagination, search, filter)
```
GET /api/students?page=1&limit=10&search=&className=10A&status=Active&sort=name:asc
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "data": {
    "students": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 50,
      "limit": 10
    }
  }
}
```

#### Get Student by ID
```
GET /api/students/:id
Authorization: Bearer <token>
```

#### Create Student
```
POST /api/students
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "userId": "...",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@school.com",
  "className": "10A",
  "section": "A",
  "rollNumber": "1"
}
```

#### Update Student
```
PUT /api/students/:id
Authorization: Bearer <admin_token>
Content-Type: application/json
```

#### Delete Student
```
DELETE /api/students/:id
Authorization: Bearer <admin_token>
```

---

### Admission Management Endpoints

#### Submit Admission Application
```
POST /api/admissions
Content-Type: application/json

{
  "firstName": "Rahul",
  "lastName": "Singh",
  "email": "rahul@example.com",
  "applyingClass": "6A",
  "phone": "9876543210",
  "fatherName": "Rajesh Singh",
  "motherName": "Priya Singh"
}
```

#### Get All Admissions
```
GET /api/admissions?status=PENDING&page=1&limit=10
Authorization: Bearer <admin_token>
```

#### Approve Admission
```
PUT /api/admissions/:id/approve
Authorization: Bearer <admin_token>

Response: Creates student account + updates admission status to APPROVED
```

#### Reject Admission
```
PUT /api/admissions/:id/reject
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "rejectionReason": "Marks below required threshold"
}
```

---

### Attendance Endpoints

#### Mark Attendance
```
POST /api/attendance
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "studentId": "...",
  "date": "2026-08-18",
  "status": "Present"
}
```

#### Get Student Attendance
```
GET /api/attendance/student/:studentId?page=1&limit=10&fromDate=2026-08-01&toDate=2026-08-31
Authorization: Bearer <token>
```

#### Get All Attendance
```
GET /api/attendance?className=10A&date=2026-08-18&page=1
Authorization: Bearer <admin_token>
```

---

### Results Endpoints

#### Create Result
```
POST /api/results
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "studentId": "...",
  "exam": "Unit Test 1",
  "subject": "Physics",
  "marksObtained": 85,
  "maximumMarks": 100
}
```

#### Get Student Results
```
GET /api/results/student/:studentId?page=1&limit=10
Authorization: Bearer <token>
```

#### Get All Results
```
GET /api/results?className=10A&exam=Unit%20Test%201&page=1
Authorization: Bearer <admin_token>
```

---

### Fee Endpoints

#### Create Fee Record
```
POST /api/fees
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "studentId": "...",
  "month": "April",
  "totalFee": 5000
}
```

#### Get Student Fees
```
GET /api/fees/student/:studentId
Authorization: Bearer <token>
```

#### Record Payment
```
PUT /api/fees/:id/payment
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "paidAmount": 5000,
  "paymentMethod": "Bank Transfer",
  "transactionId": "TXN12345"
}
```

---

### Notice Endpoints

#### Get Published Notices
```
GET /api/notices?published=true&category=Academic&page=1
```

#### Create Notice (Admin only)
```
POST /api/notices
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Unit Tests Scheduled",
  "description": "Unit tests will be held from...",
  "category": "Academic",
  "expiryDate": "2026-09-01"
}
```

#### Publish Notice
```
PUT /api/notices/:id/publish
Authorization: Bearer <admin_token>
```

---

### Admin Dashboard Endpoints

#### Get Dashboard Statistics
```
GET /api/admin/dashboard/stats
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "data": {
    "kpis": {
      "totalStudents": 120,
      "totalTeachers": 25,
      "pendingAdmissions": 5,
      "approvedAdmissions": 45,
      "attendancePercentage": "94",
      "totalFeePaid": 450000,
      "totalFeePending": 50000
    },
    "charts": {
      "studentsByClass": [...],
      "admissionStatus": [...]
    }
  }
}
```

---

## 🎨 Features Overview

### Search Functionality

Search works across multiple fields:
- Student name
- Student ID
- Email
- Phone number

Example:
```
GET /api/students?search=Rahul
```

### Filtering

Multiple filters can be applied simultaneously:
```
GET /api/students?className=10A&section=A&status=Active&academicYear=2026-27
```

### Sorting

Sort by any field:
```
GET /api/students?sort=name:asc
GET /api/students?sort=createdAt:desc
```

### Pagination

Standard pagination with offset and limit:
```
GET /api/students?page=2&limit=20
```

Response includes:
```json
{
  "pagination": {
    "currentPage": 2,
    "totalPages": 5,
    "totalRecords": 100,
    "limit": 20
  }
}
```

---

## 🔄 Project Workflow

### Admission Workflow

```
1. Student submits admission form at /admission
   ↓
2. Validation checks (required fields, duplicate email)
   ↓
3. Data saved to Admission collection with status = PENDING
   ↓
4. Admin sees pending admission in dashboard
   ↓
5. Admin reviews and clicks APPROVE or REJECT
   ↓
   ├─→ APPROVE: 
   │   • Creates User account
   │   • Creates Student profile
   │   • Updates admission status
   │   • Generates Student ID
   │   ↓
   │   Student can now login
   │
   └─→ REJECT:
       • Updates admission status
       • Records rejection reason

```

### Authentication Workflow

```
1. User enters credentials
   ↓
2. Backend validates email & password
   ↓
3. Backend verifies user role (ADMIN/STUDENT)
   ↓
4. Backend generates JWT token (valid for 7 days)
   ↓
5. Frontend stores token in localStorage
   ↓
6. All subsequent requests include token in Authorization header
   ↓
7. AuthInterceptor automatically adds token to requests
   ↓
8. Backend validates token on protected routes
   ↓
9. AuthGuard prevents unauthorized access to routes
```

---

## 📊 Database Models

### User Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (bcrypt hashed),
  role: String (ADMIN | STUDENT),
  phone: String,
  status: String (Active | Inactive),
  createdAt: Date,
  updatedAt: Date
}
```

### Student Schema
```javascript
{
  userId: ObjectId (ref: User),
  studentId: String (unique),
  firstName: String,
  lastName: String,
  email: String,
  className: String,
  section: String,
  rollNumber: String,
  dateOfBirth: Date,
  gender: String,
  bloodGroup: String,
  phone: String,
  address: String,
  fatherName: String,
  motherName: String,
  status: String,
  academicYear: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Admission Schema
```javascript
{
  applicationId: String (unique),
  firstName: String,
  lastName: String,
  email: String,
  applyingClass: String,
  status: String (PENDING | APPROVED | REJECTED),
  approvedBy: ObjectId (ref: User),
  approvalDate: Date,
  rejectionReason: String,
  studentId: ObjectId (ref: Student),
  createdAt: Date,
  updatedAt: Date
}
```

Similar schemas exist for:
- **Attendance**: Track daily attendance
- **Result**: Exam results with grades
- **Fee**: Fee collection tracking
- **Notice**: School announcements
- **Teacher**: Teacher profiles
- **Exam**: Exam scheduling

---

## 🔒 Security Features

1. **JWT Authentication**: Token-based authentication
2. **Password Hashing**: bcrypt (10 rounds)
3. **Role-Based Access Control**: Admin vs Student permissions
4. **HTTP Security Headers**: Helmet.js
5. **CORS Configuration**: Restricted to frontend URL
6. **Input Validation**: Both frontend and backend
7. **Environment Variables**: Sensitive data in .env
8. **Error Handling**: No stack traces exposed to users
9. **Token Expiration**: 7-day token validity
10. **Route Guards**: Angular route protection

---

## 📦 Deployment

### Backend Deployment (Heroku)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set \
  MONGODB_URI=your_mongodb_uri \
  JWT_SECRET=<your-jwt-secret> \
  NODE_ENV=production

# Deploy
git push heroku main
```

### Frontend Deployment (Netlify)

```bash
# Build
ng build --configuration production

# Deploy
netlify deploy --prod --dir dist/frontend
```

### Database (MongoDB Atlas)

1. Create cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Get connection string
4. Update environment variables in deployed backend

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
mongod
```

### Cannot GET /api/health
```
Error: Cannot GET /api/health
```
**Solution**: Backend is not running. Start it:
```bash
cd backend/school-backend
npm run dev
```

### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**: Ensure `CLIENT_URL` in `.env` matches frontend URL

### Token Invalid/Expired
```
Error: Invalid or expired token
```
**Solution**: Login again to get a new token

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: 
- Change port in `.env`
- Or kill the process using the port

### No Students Appearing
**Solution**: Ensure database is seeded
```bash
npm run seed
```

---

## 🚀 Future Improvements

### Phase 2
- [ ] Export data to PDF/Excel
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Parent portal
- [ ] Teacher attendance
- [ ] Time-table management
- [ ] Online leave application
- [ ] Homework tracking
- [ ] Library management
- [ ] Hostel management

### Phase 3
- [ ] Real-time notifications (Socket.io)
- [ ] Mobile app (React Native/Flutter)
- [ ] Video conferencing
- [ ] Online assignments
- [ ] Automated reports
- [ ] AI-based analytics
- [ ] Biometric attendance
- [ ] RFID card system

### Phase 4
- [ ] Payment gateway integration
- [ ] Scholarship management
- [ ] Sports management
- [ ] Transport management
- [ ] Inventory management
- [ ] Maintenance tracking
- [ ] Alumni portal
- [ ] Placement tracking

---

## 📝 Development Notes

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Testing
- Unit tests for services
- Integration tests for controllers
- E2E tests for flows
- Use Jasmine for testing

### Git Workflow
```bash
git checkout -b feature/feature-name
git add .
git commit -m "feat: add feature description"
git push origin feature/feature-name
# Create Pull Request
```

---

## 📄 License

This project is provided for educational purposes.

---

## 📞 Support

For issues, questions, or contributions:
1. Check existing GitHub issues
2. Create detailed bug reports
3. Follow coding standards
4. Test changes thoroughly

---

## ✅ Project Completion Checklist

- ✅ Backend API complete with all endpoints
- ✅ Database models and relationships
- ✅ Authentication system (JWT + bcrypt)
- ✅ Authorization (RBAC)
- ✅ Admin dashboard
- ✅ Admin student management
- ✅ Admin admission management
- ✅ Search, filter, sort, pagination
- ✅ Student dashboards
- ✅ Attendance management
- ✅ Results management
- ✅ Fee management
- ✅ Notice management
- ✅ Seed data
- ✅ Responsive design
- ✅ Input validation
- ✅ Error handling
- ✅ Documentation

---

## 🎓 Learning Outcomes

By studying this project, you will learn:

1. **Full-stack development** with Angular & Node.js
2. **RESTful API design** and best practices
3. **Database design** with MongoDB & Mongoose
4. **Authentication & Authorization** patterns
5. **Search, filtering, sorting, pagination** implementations
6. **Error handling** and validation strategies
7. **CORS and security** best practices
8. **Responsive web design**
9. **Component-based architecture**
10. **Real-world project structure**

---

**Created with ❤️ for educational purposes**

Last Updated: August 18, 2026
Version: 1.0.0
