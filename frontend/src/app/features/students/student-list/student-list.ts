import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { StudentService } from '../../../core/services/student.service';
import { Student } from '../../../core/models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentList {

  students: Student[] = [];

  searchTerm = '';

  selectedClass = 'All Classes';

  selectedStatus = 'All Status';

  currentPage = 1;

  pageSize = 5;

  classes: string[] = [
    'All Classes',
    '6A',
    '6B',
    '7A',
    '7B',
    '8A',
    '8B',
    '9A',
    '9B',
    '10A',
    '10B'
  ];


  // ==============================
  // CONSTRUCTOR
  // ==============================

  constructor(
    private studentService: StudentService
  ) {

    this.studentService.students$.subscribe(
      students => {

        this.students = students;

        this.currentPage = 1;

      }
    );

  }


  // ==============================
  // SEARCH
  // ==============================

  onSearch(): void {

    this.currentPage = 1;

  }


  // ==============================
  // CLASS CHANGE
  // ==============================

  onClassChange(): void {

    this.currentPage = 1;

  }


  // ==============================
  // STATUS CHANGE
  // ==============================

  onStatusChange(): void {

    this.currentPage = 1;

  }


  // ==============================
  // FILTERED STUDENTS
  // ==============================

  get filteredStudents(): Student[] {

    return this.students.filter(student => {

      const search =
        this.searchTerm.toLowerCase().trim();


      const matchesSearch =
        student.name.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search) ||
        student.rollNumber.toLowerCase().includes(search);


      const matchesClass =
        this.selectedClass === 'All Classes' ||
        student.className === this.selectedClass;


      const matchesStatus =
        this.selectedStatus === 'All Status' ||
        student.status === this.selectedStatus;


      return (
        matchesSearch &&
        matchesClass &&
        matchesStatus
      );

    });

  }


  // ==============================
  // PAGINATED STUDENTS
  // ==============================

  get paginatedStudents(): Student[] {

    const start =
      (this.currentPage - 1) * this.pageSize;

    const end =
      start + this.pageSize;

    return this.filteredStudents.slice(
      start,
      end
    );

  }


  // ==============================
  // TOTAL PAGES
  // ==============================

  get totalPages(): number {

    return Math.ceil(
      this.filteredStudents.length /
      this.pageSize
    );

  }


  // ==============================
  // START ITEM
  // ==============================

  get startItem(): number {

    if (this.filteredStudents.length === 0) {
      return 0;
    }

    return (
      (this.currentPage - 1) *
      this.pageSize
    ) + 1;

  }


  // ==============================
  // END ITEM
  // ==============================

  get endItem(): number {

    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredStudents.length
    );

  }


  // ==============================
  // PAGE NUMBERS
  // ==============================

  get pageNumbers(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, index) => index + 1
    );

  }


  // ==============================
  // RESET FILTERS
  // ==============================

  resetFilters(): void {

    this.searchTerm = '';

    this.selectedClass = 'All Classes';

    this.selectedStatus = 'All Status';

    this.currentPage = 1;

  }


  // ==============================
  // EDIT STUDENT
  // ==============================

  editStudent(student: Student): void {

    console.log(
      'Edit student:',
      student
    );

  }


  // ==============================
  // DELETE STUDENT
  // ==============================

  deleteStudent(id: string): void {

    const confirmed =
      confirm(
        'Are you sure you want to delete this student?'
      );

    if (!confirmed) {
      return;
    }

    this.studentService.deleteStudent(id);

  }


  // ==============================
  // NEXT PAGE
  // ==============================

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

    }

  }


  // ==============================
  // PREVIOUS PAGE
  // ==============================

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

    }

  }


  // ==============================
  // GO TO PAGE
  // ==============================

  goToPage(page: number): void {

    if (
      page >= 1 &&
      page <= this.totalPages
    ) {

      this.currentPage = page;

    }

  }

}