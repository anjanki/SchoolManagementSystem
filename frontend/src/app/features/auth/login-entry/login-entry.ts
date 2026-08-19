import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-entry',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="auth-page">
      <section class="auth-card">
        <div class="brand-mark">🏫</div>
        <p class="eyebrow">SchoolMS</p>
        <h1>Welcome back</h1>
        <p class="muted">Choose your portal to continue.</p>
        <div class="role-grid">
          <a class="role-card admin" routerLink="/admin-login">
            <span>🛡️</span>
            <strong>Admin</strong>
            <small>Manage the school</small>
          </a>
          <a class="role-card student" routerLink="/login/student">
            <span>🎓</span>
            <strong>Student</strong>
            <small>Access your learning portal</small>
          </a>
        </div>
        <p class="muted footer-note">New student? <a routerLink="/register/student">Create an account</a></p>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .auth-page { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: linear-gradient(135deg, #eef4ff, #f8fafc); }
    .auth-card { width: min(520px, 100%); padding: 42px; background: #fff; border: 1px solid #dbe4f0; border-radius: 18px; box-shadow: 0 18px 45px rgba(23, 32, 51, .12); text-align: center; }
    .brand-mark { font-size: 46px; }
    .eyebrow { margin: 12px 0 4px; color: #2563eb; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    h1 { margin: 0; color: #172033; font-size: 32px; }
    .muted { color: #64748b; }
    .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 28px 0; }
    .role-card { display: grid; gap: 8px; padding: 24px 16px; border: 1px solid #dbe4f0; border-radius: 12px; color: #172033; text-decoration: none; transition: transform .2s, border-color .2s, box-shadow .2s; }
    .role-card:hover { transform: translateY(-3px); border-color: #2563eb; box-shadow: 0 8px 20px rgba(37, 99, 235, .14); }
    .role-card span { font-size: 30px; }
    .role-card small { color: #64748b; }
    .footer-note { margin-bottom: 0; }
    a { color: #2563eb; font-weight: 600; }
    @media (max-width: 480px) { .auth-card { padding: 28px 20px; } .role-grid { grid-template-columns: 1fr; } }
  `]
})
export class LoginEntryComponent {}
