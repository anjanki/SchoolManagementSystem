# System Architecture & Implementation Guide

## 🎯 Project Overview

**School Management System** is a complete, enterprise-grade full-stack application for managing all aspects of school operations. It includes student management, attendance tracking, results management, fee collection, and administrative analytics.

**Status**: 70% complete with full backend, partially complete frontend
**Backend**: 100% complete and production-ready
**Frontend**: Core infrastructure complete, 7 management components ready for implementation

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│        Angular Frontend (SPA)           │
│  Standalone Components + TypeScript     │
│        (Port 4200)                      │
└──────────────────┬──────────────────────┘
                   │
        HTTP REST API (JSON)
                   │
┌──────────────────▼──────────────────────┐
│      Express.js Backend API             │
│  Routes → Controllers → Services        │
│        (Port 5000)                      │
└──────────────────┬──────────────────────┘
                   │
        Mongoose ODM + Queries
                   │
┌──────────────────▼──────────────────────┐
│   MongoDB Database Instance             │
│  9 Collections with Relationships       │
└─────────────────────────────────────────┘
```

### Request/Response Flow

```
Browser Request
     ↓
[AuthInterceptor] → Adds JWT Token
     ↓
HTTP Request → Express Middleware
     ↓
[authMiddleware] → Validates Token
     ↓
[authorize] → Checks Role Permissions
     ↓
Route Handler → Controller Function
     ↓
Database Query → Mongoose Model
     ↓
Response with {success, data, message}
     ↓
[Auth Guard] → Checks Route Permission
     ↓
Display to User
```

---

## 📦 Data Models & Relationships

### User Model
```
┌─ User
│  ├─ _id: ObjectId
│  ├─ firstName: String
│  ├─ lastName: String
│  ├─ email: String (unique)
│  ├─ password: String (bcrypt hashed)
│  ├─ role: String (ADMIN | STUDENT)
│  ├─ phone: String
│  ├─ status: String
│  ├─ createdAt: Date
│  └─ updatedAt: Date
```

### Student Model
```
┌─ Student
│  ├─ _id: ObjectId
│  ├─ userId: ObjectId → User
│  ├─ studentId: String (unique - auto-generated)
│  ├─ firstName: String
│  ├─ lastName: String
│  ├─ className: String
│  ├─ section: String
│  ├─ rollNumber: String
│  ├─ email: String
│  ├─ phone: String
│  ├─ dateOfBirth: Date
│  ├─ gender: String
│  ├─ fatherName: String
│  ├─ motherName: String
│  ├─ address: String
│  ├─ academicYear: String
│  └─ [Other fields...]
```

### Related Models
- **Admission** → Creates Student + User on approval
- **Attendance** → References Student + date + status
- **Result** → References Student + exam + marks
- **Fee** → References Student + payment tracking
- **Notice** → Created by User (Admin)
- **Teacher** → Separate entity
- **Exam** → Scheduled exams for classes

---

## 🔐 Authentication & Authorization

### Step-by-Step Login Flow

1. **User enters credentials** on login page
2. **Frontend calls** `/api/auth/admin-login` or `/api/auth/student-login`
3. **Backend validates**:
   - Email exists in database
   - Password matches hashed version
   - User role matches endpoint
4. **Backend generates JWT token** containing:
   - User ID
   - Email
   - Role
   - Issued At time
   - Expiration (7 days)
5. **Frontend stores token** in localStorage
6. **Frontend redirects** to dashboard
7. **Subsequent API calls**:
   - AuthInterceptor adds token to Authorization header
   - Backend verifies token signature
   - Backend checks token expiration
   - Backend validates user permissions
8. **Logout clears** token from localStorage

### Token Structure
```
Header.Payload.Signature

Payload contains:
{
  "id": "user_mongo_id",
  "email": "admin@school.com",
  "role": "ADMIN",
  "iat": 1692345600,
  "exp": 1693004000
}
```

---

## 🛣️ API Routing Architecture

### Authentication Routes
```
POST   /api/auth/admin-login       → adminLogin()
POST   /api/auth/student-login     → studentLogin()
GET    /api/auth/verify-token      → verifyToken() [Protected]
```

### Student CRUD Routes
```
GET    /api/students               → getAllStudents() [Protected, Admin]
GET    /api/students/:id           → getStudentById() [Protected]
POST   /api/students               → createStudent() [Protected, Admin]
PUT    /api/students/:id           → updateStudent() [Protected, Admin]
DELETE /api/students/:id           → deleteStudent() [Protected, Admin]
GET    /api/student/dashboard      → getStudentDashboard() [Protected, Student]
```

### Admission Routes
```
POST   /api/admissions             → createAdmission() [Public]
GET    /api/admissions             → getAllAdmissions() [Protected, Admin]
GET    /api/admissions/:id         → getAdmissionById() [Protected, Admin]
PUT    /api/admissions/:id/approve → approveAdmission() [Protected, Admin]
PUT    /api/admissions/:id/reject  → rejectAdmission() [Protected, Admin]
```

### Other Routes
```
/api/teachers              → Teacher CRUD
/api/attendance            → Attendance CRUD
/api/results               → Results CRUD
/api/fees                  → Fee CRUD & Payment
/api/notices               → Notice CRUD
/api/admin/dashboard/stats → Admin Analytics
```

---

## 🎨 Frontend Component Structure

### Standalone Components Pattern

Each component is standalone with:
```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule, FormsModule, ...],
  templateUrl: './component-name.html',
  styleUrl: './component-name.css'
})
export class ComponentNameComponent { }
```

### Service Dependency Injection

```typescript
constructor(
  private apiService: ApiService,
  private authService: AuthService,
  private router: Router
) { }
```

### Routing with Role Guards

```typescript
{
  path: 'admin/students',
  component: StudentManagementComponent,
  canActivate: [AuthGuard],
  data: { roles: ['ADMIN'] }
}
```

---

## 🔍 Search, Filter, Sort, Pagination

### Query Parameter Structure

```
GET /api/students?page=1&limit=10&search=John&className=10A&status=Active&sort=name:asc
```

### Backend Processing
```javascript
// Extract parameters
const { page = 1, limit = 10, search, className, status, sort } = req.query;

// Build filter object
const filter = {};
if (search) filter.$text = { $search: search };
if (className) filter.className = className;
if (status) filter.status = status;

// Execute query
const students = await Student
  .find(filter)
  .sort(parseSortString(sort))
  .limit(limit * 1)
  .skip((page - 1) * limit)
  .lean();

// Return with pagination metadata
return {
  data: students,
  pagination: {
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
    totalRecords,
    limit
  }
};
```

### Frontend Usage

```typescript
loadStudents(): void {
  const params = {
    page: this.currentPage,
    limit: this.pageSize,
    search: this.searchTerm || undefined,
    className: this.selectedClass !== 'All' ? this.selectedClass : undefined,
    status: this.selectedStatus !== 'All' ? this.selectedStatus : undefined
  };
  
  this.apiService.getStudents(params).subscribe(response => {
    this.students = response.data.students;
    this.totalPages = response.data.pagination.totalPages;
  });
}
```

---

## 📊 Data Processing Examples

### Auto-Calculated Grade (Results)

```javascript
// In Result model - pre-save hook
schema.pre('save', function(next) {
  const percentage = (this.marksObtained / this.maximumMarks) * 100;
  
  if (percentage >= 90) this.grade = 'A+';
  else if (percentage >= 80) this.grade = 'A';
  else if (percentage >= 70) this.grade = 'B';
  else if (percentage >= 60) this.grade = 'C';
  else if (percentage >= 50) this.grade = 'D';
  else this.grade = 'F';
  
  next();
});
```

### Attendance Statistics

```javascript
// Calculate from attendance records
const presentDays = await Attendance.countDocuments({
  studentId, status: 'Present', date: { $lte: today }
});
const totalDays = await Attendance.countDocuments({
  studentId, date: { $lte: today }
});
const attendancePercentage = (presentDays / totalDays) * 100;
```

### Fee Status Auto-Update

```javascript
// Before saving payment
schema.pre('save', function(next) {
  const paidAmount = this.paidAmount;
  const totalFee = this.totalFee;
  
  if (paidAmount === 0) this.status = 'PENDING';
  else if (paidAmount < totalFee) this.status = 'PARTIAL';
  else this.status = 'PAID';
  
  next();
});
```

---

## 🛡️ Security Implementation

### Password Hashing
```javascript
// In User model
schema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Verification during login
const isPasswordValid = await user.comparePassword(inputPassword);
```

### JWT Token Verification
```javascript
// Middleware
const token = req.headers.authorization?.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
```

### Role-Based Authorization
```javascript
// Middleware
authorize(['ADMIN'])(req, res, next) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
}
```

### CORS Protection
```javascript
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true
};
app.use(cors(corsOptions));
```

---

## 🚀 Building & Deployment

### Frontend Build
```bash
# Development build
ng build --configuration development

# Production build with optimization
ng build --configuration production
```

### Backend with PM2 (Production)
```bash
npm install -g pm2

pm2 start server.js --name "school-api"
pm2 save
pm2 startup
```

### Environment-Specific Configuration
```
Development:
  NODE_ENV=development
  MONGODB_URI=mongodb://localhost:27017/school-dev
  
Staging:
  NODE_ENV=staging
  MONGODB_URI=mongodb://staging-server/school-staging
  
Production:
  NODE_ENV=production
  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/school-prod
  JWT_SECRET=production-secret-key
```

---

## 🧪 Testing Strategy

### Unit Testing (Services)
```typescript
describe('AuthService', () => {
  it('should login admin', () => {
    authService.adminLogin(email, password).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data.token).toBeDefined();
    });
  });
});
```

### E2E Testing (User Flows)
```typescript
describe('Admin Student Management', () => {
  it('should create a new student', () => {
    cy.visit('/admin/students');
    cy.get('[data-test="create-btn"]').click();
    cy.get('[data-test="name-input"]').type('John Doe');
    cy.get('[data-test="submit-btn"]').click();
    cy.get('[data-test="success-toast"]').should('be.visible');
  });
});
```

---

## 📈 Performance Optimization

### Database Indexes
```javascript
// Indexed fields for faster queries
Student.collection.createIndex({ email: 1 });
Student.collection.createIndex({ className: 1, section: 1 });
Student.collection.createIndex({ studentId: 1 });
Attendance.collection.createIndex({ studentId: 1, date: 1 });
```

### Frontend Lazy Loading
```typescript
const routes: Routes = [
  { path: 'admin', component: AdminLayout, children: [
    { path: 'students', loadComponent: () => 
      import('./student-management').then(m => m.StudentManagementComponent)
    }
  ]}
];
```

### API Response Caching
```typescript
getStudents(params): Observable<any> {
  return this.http.get('/api/students', { params }).pipe(
    shareReplay(1)  // Cache for same request parameters
  );
}
```

---

## 🐛 Error Handling Strategy

### Backend Error Response
```json
{
  "success": false,
  "message": "Student not found",
  "error": {
    "code": "NOT_FOUND",
    "statusCode": 404
  }
}
```

### Frontend Error Handling
```typescript
this.apiService.getStudents(params).subscribe({
  next: (response) => {
    if (response.success) {
      this.students = response.data;
    }
  },
  error: (error) => {
    const message = error.error?.message || 'An error occurred';
    this.showErrorToast(message);
  }
});
```

---

## 📝 Logging & Monitoring

### Backend Logging
```javascript
console.log(`[${new Date().toISOString()}] ${method} ${path}`);
console.error(`[ERROR] ${error.message}`);
```

### Frontend Error Tracking
```typescript
// Could integrate with Sentry
console.error('API Error:', error);
// Report to monitoring service
```

---

## 🎓 Code Examples

### Creating a New Management Component

1. **TypeScript (component.ts)**
```typescript
@Component({
  selector: 'app-fees-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fees-management.html',
  styleUrl: './fees-management.css'
})
export class FeesManagementComponent implements OnInit {
  fees: any[] = [];
  loading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadFees();
  }

  loadFees(): void {
    this.loading = true;
    this.apiService.getFees({}).subscribe({
      next: (response) => {
        this.fees = response.data.fees;
        this.loading = false;
      }
    });
  }

  recordPayment(feeId: string, amount: number): void {
    this.apiService.recordFeePayment(feeId, { paidAmount: amount }).subscribe({
      next: () => {
        alert('Payment recorded successfully');
        this.loadFees();
      }
    });
  }
}
```

2. **HTML (component.html)**
```html
<div class="management-container">
  <h1>Fee Management</h1>
  
  <div *ngIf="loading" class="loading">Loading...</div>
  
  <div *ngIf="!loading" class="fee-table">
    <table>
      <thead>
        <tr>
          <th>Student</th>
          <th>Total Fee</th>
          <th>Paid Amount</th>
          <th>Pending</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let fee of fees">
          <td>{{ fee.studentName }}</td>
          <td>{{ fee.totalFee }}</td>
          <td>{{ fee.paidAmount }}</td>
          <td>{{ fee.totalFee - fee.paidAmount }}</td>
          <td><span class="badge">{{ fee.status }}</span></td>
          <td>
            <button (click)="recordPayment(fee._id, fee.totalFee - fee.paidAmount)">
              💳 Payment
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

3. **CSS (component.css)**
```css
.management-container {
  padding: 20px;
}

.fee-table {
  background: white;
  border-radius: 12px;
  overflow: auto;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f9fafb;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
}

td {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: #d1fae5;
  color: #047857;
}
```

---

## 📋 Checklist for Extending the System

- [ ] Backend endpoint created
- [ ] Service method added
- [ ] TypeScript component created
- [ ] HTML template created
- [ ] CSS styling added
- [ ] Route added to routing module
- [ ] AuthGuard applied if needed
- [ ] Input validation added
- [ ] Error handling tested
- [ ] Responsive design verified
- [ ] API integration tested
- [ ] Documentation updated

---

## 🔗 Key Files Reference

| Purpose | File |
|---------|------|
| Backend Entry | `backend/school-backend/server.js` |
| Database Connection | `backend/school-backend/config/database.js` |
| Auth Controller | `backend/school-backend/controllers/authController.js` |
| Student Model | `backend/school-backend/models/Student.js` |
| Auth Middleware | `backend/school-backend/middleware/authMiddleware.js` |
| API Service | `frontend/src/app/core/services/api.service.ts` |
| Auth Guard | `frontend/src/app/core/guards/auth.guard.ts` |
| Routes Config | `frontend/src/app/app.routes.ts` |
| Student Management | `frontend/src/app/features/admin/student-management/` |
| Admin Dashboard | `frontend/src/app/features/admin/dashboard/` |

---

This architecture ensures scalability, security, maintainability, and performance. All components follow Angular best practices and Express.js conventions.
