import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  // ==========================================
  // LOCAL STORAGE KEY
  // ==========================================

  private readonly STORAGE_KEY = 'school_students';


  // ==========================================
  // STUDENT DATA
  // ==========================================

  private students: Student[] = this.loadStudents();


  // ==========================================
  // BEHAVIOR SUBJECT
  // ==========================================

  private studentsSubject =
    new BehaviorSubject<Student[]>([...this.students]);


  // ==========================================
  // STUDENT OBSERVABLE
  // ==========================================

  students$ =
    this.studentsSubject.asObservable();


  // ==========================================
  // LOAD STUDENTS
  // ==========================================

  private loadStudents(): Student[] {

    const savedStudents =
      localStorage.getItem(this.STORAGE_KEY);

    // If students already exist in Local Storage
    if (savedStudents) {

      try {

        return JSON.parse(savedStudents);

      } catch (error) {

        console.error(
          'Error reading students from Local Storage:',
          error
        );

      }

    }


    // Default students
    const defaultStudents: Student[] = [

      {
        id: '001',
        name: 'Anjan Kumar',
        initials: 'AK',
        rollNumber: '101',
        email: 'anjan@example.com',
        className: 'Class 10',
        gender: 'Male',
        phone: '6202239118',
        status: 'Active'
      },

      {
        id: '002',
        name: 'Rahul Gupta',
        initials: 'RG',
        rollNumber: '102',
        email: 'rahul@example.com',
        className: 'Class 10',
        gender: 'Male',
        phone: '9876543210',
        status: 'Active'
      },

      {
        id: '003',
        name: 'Priya Singh',
        initials: 'PS',
        rollNumber: '103',
        email: 'priya@example.com',
        className: 'Class 9',
        gender: 'Female',
        phone: '9123456780',
        status: 'Inactive'
      }

    ];


    // Save default students in Local Storage
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(defaultStudents)
    );


    return defaultStudents;

  }


  // ==========================================
  // SAVE STUDENTS
  // ==========================================

  private saveStudents(): void {

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.students)
    );

  }


  // ==========================================
  // GET ALL STUDENTS
  // ==========================================

  getStudents(): Student[] {

    return [...this.students];

  }


  // ==========================================
  // GENERATE STUDENT ID
  // ==========================================

  generateStudentId(): string {

    if (this.students.length === 0) {

      return '001';

    }


    const numericIds =
      this.students
        .map(student => Number(student.id))
        .filter(id => !Number.isNaN(id));


    if (numericIds.length === 0) {

      return '001';

    }


    const highestId =
      Math.max(...numericIds);


    return String(
      highestId + 1
    ).padStart(3, '0');

  }


  // ==========================================
  // ADD STUDENT
  // ==========================================

  addStudent(student: Student): void {

    console.log(
      'Adding student:',
      student
    );


    // Add student to array
    this.students.push(student);


    // Save to Local Storage
    this.saveStudents();


    // Update all subscribers
    this.studentsSubject.next(
      [...this.students]
    );


    console.log(
      'All students:',
      this.students
    );

  }


  // ==========================================
  // DELETE STUDENT
  // ==========================================

  deleteStudent(id: string): void {

    this.students =
      this.students.filter(
        student => student.id !== id
      );


    // Save changes
    this.saveStudents();


    // Update subscribers
    this.studentsSubject.next(
      [...this.students]
    );

  }


  // ==========================================
  // UPDATE STUDENT
  // ==========================================

  updateStudent(updatedStudent: Student): void {

    const index =
      this.students.findIndex(
        student =>
          student.id === updatedStudent.id
      );


    if (index === -1) {

      console.error(
        'Student not found:',
        updatedStudent.id
      );

      return;

    }


    // Replace old student
    this.students[index] =
      updatedStudent;


    // Save changes
    this.saveStudents();


    // Update subscribers
    this.studentsSubject.next(
      [...this.students]
    );

  }


  // ==========================================
  // GET STUDENT BY ID
  // ==========================================

  getStudentById(id: string): Student | undefined {

    return this.students.find(
      student => student.id === id
    );

  }

}