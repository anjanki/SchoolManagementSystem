import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  adminLogin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin-login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.success) {
          console.log('✅ Login successful, storing token:', response.data.token.substring(0, 30) + '...');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.currentUserSubject.next(response.data.user);
          console.log('📦 Token stored in localStorage:', localStorage.getItem('token') ? 'YES' : 'NO');
        }
      })
    );
  }

  studentLogin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/student-login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('student', JSON.stringify(response.data.student));
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  verifyToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify-token`);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('student');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('🔑 getToken() called, result:', token ? '✓ Token exists: ' + token.substring(0, 30) + '...' : '❌ No token in localStorage');
    return token;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isStudent(): boolean {
    return this.getUserRole() === 'STUDENT';
  }
}
