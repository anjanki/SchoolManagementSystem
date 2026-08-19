import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { StudentService } from '../../../core/services/student.service';
import { Student } from '../../../core/models/student.model';

@Component({
  selector: 'app-student-registration',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './student-registration.html',
  styleUrl: './student-registration.css'
})
export class StudentRegistrationComponent {

  student = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    rollNumber: '',
    className: '',
    section: '',
    admissionDate: ''
  };

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  onSubmit(): void {

    // Basic validation
    if (
      !this.student.firstName ||
      !this.student.lastName ||
      !this.student.email ||
      !this.student.phone ||
      !this.student.rollNumber ||
      !this.student.className ||
      !this.student.gender
    ) {
      alert('Please fill all required fields.');
      return;
    }

    // Create student object
    const newStudent: Student = {
      id: this.studentService.generateStudentId(),

      name: `${this.student.firstName} ${this.student.lastName}`,

      initials:
        this.student.firstName.charAt(0).toUpperCase() +
        this.student.lastName.charAt(0).toUpperCase(),

      rollNumber: this.student.rollNumber,

      email: this.student.email,

      className: this.student.className,

      gender: this.student.gender,

      phone: this.student.phone,

      status: 'Active',

      dateOfBirth: this.student.dateOfBirth,

      address: this.student.address,

      section: this.student.section,

      admissionDate: this.student.admissionDate
    };

    // Add student to shared service
    this.studentService.addStudent(newStudent);

    console.log('Student Registration Data:', newStudent);

    alert('Student registered successfully!');

    // Go to student list
    this.router.navigate(['/students']);
  }

  onCancel(): void {

    this.resetForm();

    this.router.navigate(['/students']);
  }

  private resetForm(): void {

    this.student = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: '',
      address: '',
      rollNumber: '',
      className: '',
      section: '',
      admissionDate: ''
    };
  }
}