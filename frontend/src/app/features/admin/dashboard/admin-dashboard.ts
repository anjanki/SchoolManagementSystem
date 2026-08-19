import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  stats: any = {
    totalStudents: 0,
    totalTeachers: 0,
    pendingAdmissions: 0,
    approvedAdmissions: 0,
    attendancePercentage: 0,
    totalFeePaid: 0,
    totalFeePending: 0
  };

  chartData: any = {
    studentsByClass: [],
    admissionStatus: []
  };

  loading = true;
  errorMessage = '';
  currentUser: any = null;
  private statsSubscription: Subscription | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }

  loadDashboardData(): void {
    console.log('📊 Fetching dashboard stats...');
    this.loading = true;
    this.errorMessage = '';
    
    // Unsubscribe from any previous subscription
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }

    this.statsSubscription = this.apiService.getDashboardStats().subscribe({
      next: (response) => {
        console.log('✓ Dashboard data received:', response);
        if (response.success && response.data) {
          this.stats = response.data.kpis || this.stats;
          this.chartData = response.data.charts || this.chartData;
          console.log('✓ Dashboard state updated with data');
        }
        this.loading = false;
        this.changeDetectorRef.markForCheck();
        console.log('✓ Loading state set to false');
      },
      error: (error) => {
        console.error('❌ Error loading dashboard:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.error?.message,
          url: error.url
        });
        this.loading = false;
        this.errorMessage = 'Failed to load dashboard data. Please try again.';
        this.changeDetectorRef.markForCheck();
        console.log('✓ Loading state set to false after error');
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/admin/${path}`]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin-login']);
  }
}
