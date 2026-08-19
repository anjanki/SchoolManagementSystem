import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="portal-shell">
      <aside class="portal-sidebar">
        <div class="brand">🏫 <span>SchoolMS<small>Student Portal</small></span></div>
        <nav>
          <button class="active">📊 Dashboard</button><button (click)="navigate('/student/profile')">👤 Profile</button><button (click)="navigate('/student/admission')">📝 Admission</button><button>📅 Attendance</button><button>📖 Results</button><button>💰 Fees</button><button>📢 Notices</button>
        </nav>
        <button class="logout" (click)="logout()">↪ Logout</button>
      </aside>
      <main class="portal-content">
        <header><div><p class="eyebrow">Student portal</p><h1>Welcome, {{ dashboard?.student?.firstName || currentUser?.firstName }}</h1><p class="muted">Your school information at a glance.</p></div><span class="student-id">{{ dashboard?.student?.studentId || 'Registration pending' }}</span></header>
        <div *ngIf="loading" class="state">Loading student dashboard...</div>
        <div *ngIf="!loading && errorMessage" class="state error-state"><p>{{ errorMessage }}</p><button (click)="loadDashboard()">Retry</button></div>
        <ng-container *ngIf="!loading && !errorMessage && dashboard">
          <section class="summary-grid"><article><span>Admission</span><strong>{{ admissionStatus }}</strong><small>Application status</small></article><article><span>Attendance</span><strong>{{ attendancePercentage }}%</strong><small>Based on available records</small></article><article><span>Results</span><strong>{{ dashboard.results?.length || 0 }}</strong><small>Published records</small></article><article><span>Fees</span><strong>{{ feeStatus }}</strong><small>Current fee status</small></article></section>
          <section class="content-grid"><article class="panel"><div class="panel-heading"><h2>Profile summary</h2><button (click)="navigate('/student/profile')">View profile</button></div><dl><div><dt>Name</dt><dd>{{ dashboard.student.firstName }} {{ dashboard.student.lastName }}</dd></div><div><dt>Email</dt><dd>{{ dashboard.student.email }}</dd></div><div><dt>Class</dt><dd>{{ dashboard.student.className || 'Not assigned' }} {{ dashboard.student.section || '' }}</dd></div><div><dt>Phone</dt><dd>{{ dashboard.student.phone || 'Not provided' }}</dd></div></dl></article><article class="panel"><div class="panel-heading"><h2>Admission applications</h2><button (click)="navigate('/student/admission')">Apply</button></div><div *ngIf="!dashboard.admissions?.length" class="empty">No application submitted yet.</div><div *ngFor="let application of dashboard.admissions" class="application"><strong>{{ application.applicationId }}</strong><span>{{ application.applyingClass }} · {{ application.status }}</span></div></article></section>
          <section class="panel"><h2>Latest notices</h2><div *ngIf="!dashboard.notices?.length" class="empty">No notices published yet.</div><div *ngFor="let notice of dashboard.notices" class="notice"><strong>{{ notice.title }}</strong><span>{{ notice.description }}</span></div></section>
        </ng-container>
      </main>
    </div>
  `,
  styles: [`
    :host { display:block; min-height:100vh; } .portal-shell { min-height:100vh; display:flex; background:#f5f7fb; color:#172033; } .portal-sidebar { width:240px; flex:0 0 240px; display:flex; flex-direction:column; padding:26px 16px; box-sizing:border-box; background:#172033; color:white; } .brand { display:flex; gap:10px; align-items:center; padding:0 10px 26px; font-size:28px; border-bottom:1px solid rgba(255,255,255,.12); } .brand span { font-size:18px; font-weight:800; } .brand small { display:block; color:#94a3b8; font-size:11px; font-weight:400; margin-top:3px; } nav { display:grid; gap:5px; margin-top:24px; } nav button, .logout { border:0; border-radius:8px; padding:12px; text-align:left; color:#cbd5e1; background:transparent; font:inherit; cursor:pointer; } nav button:hover, nav .active { color:white; background:#2563eb; } .logout { margin-top:auto; } .logout:hover { background:#b91c1c; color:white; } .portal-content { flex:1; padding:34px; max-width:1250px; } header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; } h1 { margin:0; font-size:30px; } h2 { margin:0; font-size:18px; } .eyebrow { margin:0 0 5px; color:#2563eb; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; } .muted, small { color:#64748b; } .student-id { padding:9px 12px; border-radius:8px; background:#dbeafe; color:#1d4ed8; font-weight:700; } .summary-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:20px; } .summary-grid article, .panel { padding:22px; border:1px solid #e2e8f0; border-radius:12px; background:white; box-shadow:0 3px 12px rgba(15,23,42,.04); } .summary-grid span, .summary-grid small { display:block; } .summary-grid strong { display:block; margin:10px 0 4px; font-size:25px; } .content-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; } .panel-heading { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; } .panel button, .state button { border:0; border-radius:7px; padding:8px 12px; background:#eff6ff; color:#2563eb; font-weight:700; cursor:pointer; } dl { display:grid; gap:14px; margin:0; } dl div { display:flex; justify-content:space-between; gap:16px; border-bottom:1px solid #f1f5f9; padding-bottom:9px; } dt { color:#64748b; } dd { margin:0; text-align:right; font-weight:600; } .application, .notice { display:flex; justify-content:space-between; gap:16px; padding:12px 0; border-bottom:1px solid #f1f5f9; } .application span { color:#2563eb; font-weight:700; } .notice { display:grid; justify-content:initial; gap:4px; } .empty, .state { padding:30px; color:#64748b; text-align:center; } .error-state { color:#b91c1c; background:#fef2f2; border-radius:8px; } @media(max-width:850px){ .portal-shell{display:block}.portal-sidebar{width:auto;min-height:auto}.portal-sidebar nav{grid-template-columns:repeat(2,1fr)}.logout{margin-top:18px}.portal-content{padding:24px 16px}.summary-grid{grid-template-columns:repeat(2,1fr)}.content-grid{grid-template-columns:1fr} } @media(max-width:480px){header{display:block}.student-id{display:inline-block;margin-top:12px}.summary-grid{grid-template-columns:1fr 1fr}.application{display:grid}}
  `]
})
export class StudentPortalDashboardComponent implements OnInit {
  dashboard: any = null; loading = true; errorMessage = ''; currentUser: any;
  constructor(private apiService: ApiService, private authService: AuthService, private router: Router, private changeDetectorRef: ChangeDetectorRef) { this.currentUser = authService.getCurrentUser(); }
  ngOnInit(): void { this.loadDashboard(); }
  loadDashboard(): void { this.loading = true; this.errorMessage = ''; this.apiService.getStudentDashboard().subscribe({ next: response => { this.dashboard = response.data; this.loading = false; this.changeDetectorRef.markForCheck(); }, error: error => { console.error('Student dashboard error:', error); this.loading = false; this.errorMessage = 'Unable to load dashboard data.'; this.changeDetectorRef.markForCheck(); } }); }
  get admissionStatus(): string { return this.dashboard?.admissions?.[0]?.status || 'Not applied'; }
  get attendancePercentage(): string { const records = this.dashboard?.attendance || []; return records.length ? ((records.filter((item: any) => item.status === 'Present').length / records.length) * 100).toFixed(0) : '0'; }
  get feeStatus(): string { return this.dashboard?.fees?.[0]?.status || 'No record'; }
  navigate(path: string): void { this.router.navigate([path]); }
  logout(): void { this.authService.logout(); this.router.navigate(['/login']); }
}
