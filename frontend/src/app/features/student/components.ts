import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="student-dashboard">
      <div class="page-header">
        <h1>Student Dashboard</h1>
        <p>Welcome to your learning portal</p>
      </div>
      
      <div class="dashboard-grid">
        <div class="card">
          <h3>📅 Attendance</h3>
          <p class="stat">94%</p>
          <p class="subtext">Current attendance rate</p>
        </div>
        <div class="card">
          <h3>📖 My Class</h3>
          <p class="stat">10A</p>
          <p class="subtext">Section A</p>
        </div>
        <div class="card">
          <h3>📊 Latest Result</h3>
          <p class="stat">A</p>
          <p class="subtext">Last exam grade</p>
        </div>
        <div class="card">
          <h3>💰 Fees</h3>
          <p class="stat">PAID</p>
          <p class="subtext">Current fee status</p>
        </div>
      </div>

      <div class="section">
        <h2>Upcoming Exams</h2>
        <div class="placeholder">Upcoming exams coming soon...</div>
      </div>

      <div class="section">
        <h2>Latest Notices</h2>
        <div class="placeholder">Latest notices coming soon...</div>
      </div>
    </div>
  `,
  styles: [`
    .student-dashboard { padding: 20px; }
    .page-header { margin-bottom: 30px; }
    .page-header h1 { margin: 0; font-size: 28px; color: #172033; }
    .page-header p { margin: 8px 0 0; color: #64748b; }
    .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
    .card h3 { margin: 0 0 12px; font-size: 16px; color: #172033; }
    .stat { margin: 0; font-size: 28px; font-weight: 700; color: #2563eb; }
    .subtext { margin: 4px 0 0; font-size: 12px; color: #94a3b8; }
    .section { background: white; padding: 24px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
    .section h2 { margin: 0 0 20px; font-size: 18px; color: #172033; }
    .placeholder { padding: 40px; text-align: center; color: #94a3b8; }
  `]
})
export class StudentDashboardComponent {}

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <div>
          <p class="eyebrow">Student portal</p>
          <h1>My Profile</h1>
          <p class="muted">Your information from the school records.</p>
        </div>
        <span *ngIf="profile" class="student-id">{{ profile.studentId }}</span>
      </div>
      <div *ngIf="loading" class="state">Loading profile...</div>
      <div *ngIf="!loading && errorMessage" class="state error-state">
        <p>Unable to load profile.</p>
        <button type="button" (click)="loadProfile()">Retry</button>
      </div>
      <div *ngIf="!loading && !errorMessage && profile" class="profile-grid">
        <section class="profile-card">
          <h2>Personal information</h2>
          <dl>
            <div><dt>Full name</dt><dd>{{ profile.firstName }} {{ profile.lastName }}</dd></div>
            <div><dt>Date of birth</dt><dd>{{ profile.dateOfBirth | date:'mediumDate' }}</dd></div>
            <div><dt>Gender</dt><dd>{{ profile.gender || 'Not provided' }}</dd></div>
            <div><dt>Blood group</dt><dd>{{ profile.bloodGroup || 'Not provided' }}</dd></div>
          </dl>
        </section>
        <section class="profile-card">
          <h2>Contact information</h2>
          <dl>
            <div><dt>Email</dt><dd>{{ profile.email }}</dd></div>
            <div><dt>Phone</dt><dd>{{ profile.phone || 'Not provided' }}</dd></div>
          </dl>
        </section>
        <section class="profile-card">
          <h2>Address</h2>
          <dl>
            <div><dt>Address</dt><dd>{{ profile.address || 'Not provided' }}</dd></div>
            <div><dt>City</dt><dd>{{ profile.city || 'Not provided' }}</dd></div>
            <div><dt>State</dt><dd>{{ profile.state || 'Not provided' }}</dd></div>
            <div><dt>PIN code</dt><dd>{{ profile.pinCode || 'Not provided' }}</dd></div>
          </dl>
        </section>
        <section class="profile-card">
          <h2>Academic information</h2>
          <dl>
            <div><dt>Student ID</dt><dd>{{ profile.studentId }}</dd></div>
            <div><dt>Class</dt><dd>{{ profile.className || 'Not assigned' }}</dd></div>
            <div><dt>Section</dt><dd>{{ profile.section || 'Not assigned' }}</dd></div>
            <div><dt>Admission status</dt><dd>{{ admissionStatus }}</dd></div>
          </dl>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .profile-container { min-height: 100vh; padding: 34px; box-sizing: border-box; background: #f5f7fb; color: #172033; }
    .profile-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 26px; }
    .eyebrow { margin: 0 0 5px; color: #2563eb; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    h1 { margin: 0; } h2 { margin: 0 0 18px; font-size: 18px; } .muted { color: #64748b; }
    .student-id { padding: 9px 12px; border-radius: 8px; color: #1d4ed8; background: #dbeafe; font-weight: 700; }
    .profile-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; max-width: 1000px; }
    .profile-card { padding: 22px; border: 1px solid #e2e8f0; border-radius: 12px; background: white; box-shadow: 0 3px 12px rgba(15,23,42,.04); }
    dl { display: grid; gap: 13px; margin: 0; } dl div { display: flex; justify-content: space-between; gap: 18px; border-bottom: 1px solid #f1f5f9; padding-bottom: 9px; } dt { color: #64748b; } dd { margin: 0; text-align: right; font-weight: 600; }
    .state { padding: 45px; text-align: center; color: #64748b; } .error-state { max-width: 500px; color: #b91c1c; background: #fef2f2; border-radius: 8px; } button { border: 0; border-radius: 7px; padding: 8px 12px; color: #2563eb; background: #eff6ff; font-weight: 700; cursor: pointer; }
    @media (max-width: 700px) { .profile-container { padding: 24px 16px; } .profile-header { display: block; } .student-id { display: inline-block; margin-top: 12px; } .profile-grid { grid-template-columns: 1fr; } }
  `]
})
export class StudentProfileComponent implements OnInit {
  profile: any = null;
  admission: any = null;
  loading = true;
  errorMessage = '';

  constructor(private apiService: ApiService, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';
    this.apiService.getStudentProfile().subscribe({
      next: (response) => {
        this.profile = response.data.student;
        this.admission = response.data.admission;
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Student profile error:', error);
        this.loading = false;
        this.errorMessage = error.status === 401 ? 'Your session has expired. Please login again.' : 'Unable to load your profile. Please try again.';
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  get admissionStatus(): string {
    return this.admission?.status || 'NOT_APPLIED';
  }
}

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="attendance-container">
      <h1>My Attendance</h1>
      <p>View your attendance records</p>
      <div class="placeholder">Student attendance coming soon...</div>
    </div>
  `,
  styles: [`
    .attendance-container { padding: 20px; }
    .placeholder { padding: 40px; color: #94a3b8; text-align: center; }
  `]
})
export class StudentAttendanceComponent {}

@Component({
  selector: 'app-student-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="results-container">
      <h1>My Results</h1>
      <p>View your exam results and grades</p>
      <div class="placeholder">Student results coming soon...</div>
    </div>
  `,
  styles: [`
    .results-container { padding: 20px; }
    .placeholder { padding: 40px; color: #94a3b8; text-align: center; }
  `]
})
export class StudentResultsComponent {}

@Component({
  selector: 'app-student-fees',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fees-container">
      <h1>My Fees</h1>
      <p>Track your fee payments</p>
      <div class="placeholder">Student fees coming soon...</div>
    </div>
  `,
  styles: [`
    .fees-container { padding: 20px; }
    .placeholder { padding: 40px; color: #94a3b8; text-align: center; }
  `]
})
export class StudentFeesComponent {}
