import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

// Public components
import { AdminLoginComponent } from './features/auth/admin-login/admin-login';
import { StudentLoginComponent } from './features/auth/student-login/student-login';
import { LoginEntryComponent } from './features/auth/login-entry/login-entry';
import { StudentRegistrationComponent } from './features/auth/student-registration/student-registration';

// Admin components
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard';
import { StudentManagementComponent } from './features/admin/student-management/student-management';
import {
  TeacherManagementComponent,
  AttendanceManagementComponent,
  ResultManagementComponent,
  FeeManagementComponent,
  NoticeManagementComponent
} from './features/admin/components';
import { AdminAdmissionManagementComponent } from './features/admin/admissions/admin-admissions';

// Student components
import {
  StudentProfileComponent,
  StudentAttendanceComponent,
  StudentResultsComponent,
  StudentFeesComponent
} from './features/student/components';
import { StudentPortalDashboardComponent } from './features/student/student-dashboard/student-dashboard';
import { StudentAdmissionComponent } from './features/student/admission/student-admission';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Public routes
  {
    path: 'login',
    component: LoginEntryComponent
  },

  {
    path: 'admin-login',
    component: AdminLoginComponent
  },

  {
    path: 'student-login',
    component: StudentLoginComponent
  },

  {
    path: 'login/student',
    component: StudentLoginComponent
  },

  {
    path: 'register/student',
    component: StudentRegistrationComponent
  },

  // Admin routes
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'students',
        component: StudentManagementComponent
      },
      {
        path: 'admissions',
        component: AdminAdmissionManagementComponent
      },
      {
        path: 'teachers',
        component: TeacherManagementComponent
      },
      {
        path: 'attendance',
        component: AttendanceManagementComponent
      },
      {
        path: 'results',
        component: ResultManagementComponent
      },
      {
        path: 'fees',
        component: FeeManagementComponent
      },
      {
        path: 'notices',
        component: NoticeManagementComponent
      }
    ]
  },

  // Student routes
  {
    path: 'student',
    canActivate: [AuthGuard],
    data: { roles: ['STUDENT'] },
    children: [
      {
        path: 'dashboard',
        component: StudentPortalDashboardComponent
      },
      {
        path: 'profile',
        component: StudentProfileComponent
      },
      {
        path: 'attendance',
        component: StudentAttendanceComponent
      },
      {
        path: 'results',
        component: StudentResultsComponent
      },
      {
        path: 'fees',
        component: StudentFeesComponent
      },
      {
        path: 'admission',
        component: StudentAdmissionComponent
      },
      {
        path: 'notices',
        component: StudentFeesComponent
      }
    ]
  },

  // Catch-all
  {
    path: '**',
    redirectTo: 'login'
  }
];