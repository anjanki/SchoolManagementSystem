import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-management.html',
  styleUrl: './student-management.css'
})
export class StudentManagementComponent implements OnInit {
  students: any[] = [];
  filteredStudents: any[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';
  selectedClass = 'All Classes';
  selectedStatus = 'All Status';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  classes = ['All Classes', '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B'];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.errorMessage = '';
    const params: Record<string, string | number> = {
      page: this.currentPage,
      limit: this.pageSize
    };

    if (this.searchTerm) {
      params['search'] = this.searchTerm;
    }
    if (this.selectedClass !== 'All Classes') {
      params['className'] = this.selectedClass;
    }
    if (this.selectedStatus !== 'All Status') {
      params['status'] = this.selectedStatus;
    }

    this.apiService.getStudents(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.students = response.data.students;
          this.filteredStudents = this.students;
          this.totalPages = response.data.pagination.totalPages;
        }
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.loading = false;
        this.errorMessage = 'Failed to load students.';
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadStudents();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadStudents();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedClass = 'All Classes';
    this.selectedStatus = 'All Status';
    this.currentPage = 1;
    this.loadStudents();
  }

  editStudent(id: string): void {
    console.log('Edit student:', id);
  }

  deleteStudent(id: string): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.apiService.deleteStudent(id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Student deleted successfully');
            this.loadStudents();
          }
        },
        error: (error) => alert('Error deleting student')
      });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadStudents();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStudents();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadStudents();
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1).slice(0, 5);
  }
}
