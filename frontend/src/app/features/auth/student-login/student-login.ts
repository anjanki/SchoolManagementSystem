import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-student-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './student-login.html',
  styleUrl: './student-login.css'
})
export class StudentLoginComponent {
  email = '';
  password = '';
  showPassword = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.activatedRoute.queryParamMap.subscribe(params => {
      if (params.get('registered') === 'true') {
        this.successMessage = 'Account created successfully! Your student account has been created. Please login to continue.';
      }
    });
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.studentLogin(this.email.trim(), this.password).pipe(
      finalize(() => { this.loading = false; this.changeDetectorRef.markForCheck(); })
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/student/dashboard']);
        } else {
          this.errorMessage = 'Invalid email or password. Please try again.';
        }
      },
      error: (error) => {
        this.errorMessage = error.status === 401 || error.status === 403
          ? 'Invalid email or password. Please try again.'
          : error.status >= 500
            ? 'Server error. Please try again later.'
            : 'Unable to connect to the server. Please check that the backend is running.';
        console.error('Student login error:', error);
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
