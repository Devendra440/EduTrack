package com.edutrack.service;

import com.edutrack.exception.DuplicateStudentIdException;
import com.edutrack.exception.StudentNotFoundException;
import com.edutrack.model.Student;
import com.edutrack.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {
    
    private final StudentRepository studentRepository;
    
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }
    
    public Student createStudent(Student student) {
        if (studentRepository.existsByStudentId(student.getStudentId())) {
            throw new DuplicateStudentIdException("Student ID already exists: " + student.getStudentId());
        }
        student.setCreatedAt(LocalDateTime.now());
        if (student.getStatus() == null) {
            student.setStatus("Active");
        }
        return studentRepository.save(student);
    }
    
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    
    public Student getStudentById(String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with ID: " + id));
    }
    
    public Student getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with Student ID: " + studentId));
    }
    
    public Student updateStudent(String id, Student studentDetails) {
        Student existing = getStudentById(id);
        
        if (!existing.getStudentId().equals(studentDetails.getStudentId()) && 
            studentRepository.existsByStudentId(studentDetails.getStudentId())) {
            throw new DuplicateStudentIdException("Student ID already exists: " + studentDetails.getStudentId());
        }
        
        existing.setStudentId(studentDetails.getStudentId());
        existing.setFullName(studentDetails.getFullName());
        existing.setEmail(studentDetails.getEmail());
        existing.setPhone(studentDetails.getPhone());
        existing.setGender(studentDetails.getGender());
        existing.setDateOfBirth(studentDetails.getDateOfBirth());
        existing.setBranch(studentDetails.getBranch());
        existing.setSemester(studentDetails.getSemester());
        existing.setAcademicYear(studentDetails.getAcademicYear());
        existing.setAdmissionYear(studentDetails.getAdmissionYear());
        existing.setStatus(studentDetails.getStatus());
        
        return studentRepository.save(existing);
    }
    
    public void deleteStudent(String id) {
        if (!studentRepository.existsById(id)) {
            throw new StudentNotFoundException("Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }
    
    public List<Student> searchStudents(String name, String branch, String semester, String academicYear) {
        List<Student> students = studentRepository.findAll();
        return students.stream()
            .filter(s -> name == null || name.isEmpty() || s.getFullName().toLowerCase().contains(name.toLowerCase()))
            .filter(s -> branch == null || branch.isEmpty() || s.getBranch().equals(branch))
            .filter(s -> semester == null || semester.isEmpty() || s.getSemester().equals(semester))
            .filter(s -> academicYear == null || academicYear.isEmpty() || s.getAcademicYear().equals(academicYear))
            .collect(Collectors.toList());
    }
    
    public long getStudentCount() {
        return studentRepository.count();
    }
}
