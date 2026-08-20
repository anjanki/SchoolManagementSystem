import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ==================== STUDENTS ====================
  getStudents(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/student`, { params });
  }

  getStudentById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/${id}`);
  }

  createStudent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/student`, data);
  }

  updateStudent(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/student/${id}`, data);
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/student/${id}`);
  }

  getStudentDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/dashboard`);
  }

  getStudentProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/profile`);
  }

  registerStudent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/student-register`, data);
  }

  getStudentAdmissions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/admissions`);
  }

  createStudentAdmission(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/admissions`, data);
  }

  getAdminAdmissions(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/admissions`, { params });
  }

  approveAdminAdmission(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/admissions/${id}/approve`, {});
  }

  rejectAdminAdmission(id: string, rejectionReason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/admissions/${id}/reject`, { rejectionReason });
  }

  // ==================== ADMISSIONS ====================
  submitAdmissionApplication(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admissions`, data);
  }

  getAdmissions(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/admissions`, { params });
  }

  getAdmissionById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/admissions/${id}`);
  }

  approveAdmission(id: string, data?: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admissions/${id}/approve`, data || {});
  }

  rejectAdmission(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admissions/${id}/reject`, data);
  }

  // ==================== TEACHERS ====================
  getTeachers(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/teachers`, { params });
  }

  getTeacherById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/teachers/${id}`);
  }

  createTeacher(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teachers`, data);
  }

  updateTeacher(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/teachers/${id}`, data);
  }

  deleteTeacher(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teachers/${id}`);
  }

  // ==================== ATTENDANCE ====================
  markAttendance(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/attendance`, data);
  }

  getAttendance(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/attendance`, { params });
  }

  getStudentAttendance(studentId: string, params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/attendance/student/${studentId}`, { params });
  }

  // ==================== RESULTS ====================
  createResult(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/results`, data);
  }

  getResults(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/results`, { params });
  }

  getStudentResults(studentId: string, params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/results/student/${studentId}`, { params });
  }

  updateResult(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/results/${id}`, data);
  }

  deleteResult(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/results/${id}`);
  }

  // ==================== FEES ====================
  createFee(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/fees`, data);
  }

  getFees(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/fees`, { params });
  }

  getStudentFees(studentId: string, params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/fees/student/${studentId}`, { params });
  }

  recordFeePayment(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/fees/${id}/payment`, data);
  }

  updateFee(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/fees/${id}`, data);
  }

  deleteFee(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/fees/${id}`);
  }

  // ==================== NOTICES ====================
  getNotices(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/notices`, { params });
  }

  getNoticeById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/notices/${id}`);
  }

  createNotice(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/notices`, data);
  }

  publishNotice(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/notices/${id}/publish`, {});
  }

  updateNotice(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/notices/${id}`, data);
  }

  deleteNotice(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notices/${id}`);
  }

  // ==================== ADMIN ====================
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/dashboard/stats`);
  }

  getAttendanceReport(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/reports/attendance`, { params });
  }

  getFeeCollectionReport(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/reports/fee-collection`, { params });
  }
}
