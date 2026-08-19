import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-student-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="registration-page">
      <section class="registration-card">
        <a class="back-link" routerLink="/login/student">← Student login</a>
        <p class="eyebrow">SchoolMS</p>
        <h1>Create student account</h1>
        <p class="muted">Your account lets you apply for admission and follow its status.</p>
        <div *ngIf="errorMessage" class="alert error">{{ errorMessage }}</div>
        <div *ngIf="successMessage" class="alert success">{{ successMessage }}</div>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="form-grid">
            <label>Full name *<input formControlName="fullName" placeholder="Aarav Sharma"></label>
            <label>Email *<input type="email" formControlName="email" placeholder="student@example.com"></label>
            <label>Password *<input type="password" formControlName="password" placeholder="At least 8 characters"></label>
            <label>Confirm password *<input type="password" formControlName="confirmPassword"></label>
            <label>Phone number *<input formControlName="phone" placeholder="10-digit phone number"></label>
            <label>Date of birth *<input type="date" formControlName="dateOfBirth"></label>
            <label>Gender *<select formControlName="gender"><option value="">Choose gender</option><option>Male</option><option>Female</option><option>Other</option></select></label>
            <label>PIN code *<input formControlName="pinCode" inputmode="numeric"></label>
            <label>City *<input formControlName="city"></label>
            <label>State *<input formControlName="state"></label>
            <label class="full">Address *<textarea formControlName="address" rows="3"></textarea></label>
          </div>
          <p *ngIf="form.errors?.['passwordMismatch'] && form.get('confirmPassword')?.touched" class="field-error">Passwords do not match.</p>
          <p class="password-hint">Password: 8+ characters with uppercase, lowercase, and a number.</p>
          <button class="primary-button" type="submit" [disabled]="loading">{{ loading ? 'Creating account...' : 'Create student account' }}</button>
        </form>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .registration-page { min-height: 100vh; padding: 36px 20px; background: linear-gradient(135deg, #eef4ff, #f8fafc); }
    .registration-card { width: min(760px, 100%); margin: auto; padding: 38px; background: #fff; border: 1px solid #dbe4f0; border-radius: 18px; box-shadow: 0 18px 45px rgba(23,32,51,.1); }
    .back-link, a { color: #2563eb; font-weight: 600; text-decoration: none; }
    .eyebrow { margin: 30px 0 4px; color: #2563eb; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    h1 { margin: 0; color: #172033; }
    .muted, .password-hint { color: #64748b; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 26px; }
    label { display: grid; gap: 7px; color: #334155; font-size: 14px; font-weight: 600; }
    input, select, textarea { width: 100%; box-sizing: border-box; border: 1px solid #cbd5e1; border-radius: 8px; padding: 11px 12px; font: inherit; color: #172033; background: #fff; }
    input:focus, select:focus, textarea:focus { outline: 2px solid #bfdbfe; border-color: #2563eb; }
    .full { grid-column: 1 / -1; }
    .primary-button { width: 100%; margin-top: 18px; border: 0; border-radius: 8px; padding: 13px; background: #2563eb; color: white; font-weight: 700; cursor: pointer; }
    .primary-button:disabled { opacity: .6; cursor: wait; }
    .alert { margin-top: 18px; padding: 12px; border-radius: 8px; }
    .error, .field-error { color: #b91c1c; background: #fef2f2; }
    .success { color: #166534; background: #f0fdf4; }
    .field-error { padding: 8px; }
    @media (max-width: 620px) { .registration-card { padding: 24px 18px; } .form-grid { grid-template-columns: 1fr; } .full { grid-column: auto; } }
  `]
})
export class StudentRegistrationComponent {
  loading = false;
  errorMessage = '';
  successMessage = '';
  form: any;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
    this.form = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
    confirmPassword: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    dateOfBirth: ['', Validators.required],
    gender: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    }, { validators: (group: any) => group.get('password')?.value === group.get('confirmPassword')?.value ? null : { passwordMismatch: true } });
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (!this.form.errors?.['passwordMismatch']) {
        this.errorMessage = 'Please correct the highlighted fields.';
      }
      return;
    }
    const value = this.form.getRawValue();
    const nameParts = value.fullName!.trim().split(/\s+/);
    this.loading = true;
    this.apiService.registerStudent({
      firstName: nameParts.shift(), lastName: nameParts.join(' ') || 'Student', email: value.email!.trim().toLowerCase(),
      password: value.password, phone: value.phone, dateOfBirth: value.dateOfBirth, gender: value.gender,
      address: value.address, city: value.city, state: value.state, pinCode: value.pinCode
    }).pipe(
      finalize(() => { this.loading = false; this.changeDetectorRef.markForCheck(); })
    ).subscribe({
      next: () => this.router.navigate(['/login/student'], { queryParams: { registered: 'true' } }),
      error: (error) => {
        this.errorMessage = error.status === 409
          ? 'An account with this email already exists. Please login instead.'
          : error.status === 400
            ? 'Please check the information entered.'
            : error.status >= 500
              ? 'Server error. Please try again later.'
              : 'Unable to connect to the server.';
        this.changeDetectorRef.markForCheck();
      }
    });
  }
}
