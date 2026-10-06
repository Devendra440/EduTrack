package com.edutrack;

import com.edutrack.model.*;
import com.edutrack.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder {

    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final ScheduleRepository scheduleRepository;
    private final MarksRepository marksRepository;
    private final ResultRepository resultRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public DataSeeder(StudentRepository studentRepository, SubjectRepository subjectRepository,
                      ScheduleRepository scheduleRepository, MarksRepository marksRepository,
                      ResultRepository resultRepository, UserRepository userRepository,
                      AuditLogRepository auditLogRepository) {
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.scheduleRepository = scheduleRepository;
        this.marksRepository = marksRepository;
        this.resultRepository = resultRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @PostConstruct
    public void seedData() {
        seedUsers();
        if (studentRepository.count() == 0) {
            seedStudents();
            seedSubjects();
            seedSchedulesAndMarks();
            seedResults();
        }
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            List<User> users = Arrays.asList(
                User.builder()
                    .email("admin@gmail.com")
                    .password("admin123")
                    .fullName("System Administrator")
                    .role("ADMIN")
                    .department("Administration")
                    .phone("9876500001")
                    .status("Active")
                    .createdAt(LocalDateTime.now())
                    .build(),

                User.builder()
                    .email("manager@gmail.com")
                    .password("manager123")
                    .fullName("Credential Administrator")
                    .role("CREDENTIAL_MANAGER")
                    .department("Credential & Identity Mgmt")
                    .phone("9876500002")
                    .status("Active")
                    .createdAt(LocalDateTime.now())
                    .build(),

                User.builder()
                    .email("teacher@gmail.com")
                    .password("teacher123")
                    .fullName("Dr. Suresh Varma")
                    .role("TEACHER")
                    .department("Computer Science & Engineering")
                    .phone("9876500003")
                    .status("Active")
                    .createdAt(LocalDateTime.now())
                    .build(),

                User.builder()
                    .email("prof.sharma@gmail.com")
                    .password("teacher123")
                    .fullName("Prof. Anita Sharma")
                    .role("TEACHER")
                    .department("Information Technology")
                    .phone("9876500004")
                    .status("Active")
                    .createdAt(LocalDateTime.now())
                    .build(),

                User.builder()
                    .email("student.rahul@gmail.com")
                    .password("student123")
                    .fullName("Rahul Kumar")
                    .role("STUDENT")
                    .studentId("ST101")
                    .branch("CSE")
                    .semester("5th Semester")
                    .phone("9876543210")
                    .status("Active")
                    .createdAt(LocalDateTime.now())
                    .build(),

                User.builder()
                    .email("student.priya@gmail.com")
                    .password("student123")
                    .fullName("Priya Sharma")
                    .role("STUDENT")
                    .studentId("ST102")
                    .branch("IT")
                    .semester("5th Semester")
                    .phone("9876543211")
                    .status("Active")
                    .createdAt(LocalDateTime.now())
                    .build()
            );

            userRepository.saveAll(users);

            // Initial audit logs for monitoring demonstration
            AuditLog log1 = AuditLog.builder()
                    .action("SYSTEM_INIT")
                    .performedBy("SYSTEM")
                    .performedByRole("SYSTEM")
                    .targetUser("admin@gmail.com")
                    .targetRole("ADMIN")
                    .details("Initialized EduTrack system roles & credentials database")
                    .status("SUCCESS")
                    .timestamp(LocalDateTime.now().minusHours(2))
                    .build();

            AuditLog log2 = AuditLog.builder()
                    .action("CREATE_CREDENTIAL")
                    .performedBy("manager@gmail.com")
                    .performedByRole("CREDENTIAL_MANAGER")
                    .targetUser("teacher@gmail.com")
                    .targetRole("TEACHER")
                    .details("Created teacher credentials for Dr. Suresh Varma")
                    .status("SUCCESS")
                    .timestamp(LocalDateTime.now().minusHours(1))
                    .build();

            auditLogRepository.saveAll(Arrays.asList(log1, log2));
        }
    }

    private void seedStudents() {
        List<Student> students = Arrays.asList(
            createStudent("ST101", "Rahul Kumar", "CSE", "5th Semester", "2024-25", "Male"),
            createStudent("ST102", "Priya Sharma", "IT", "5th Semester", "2024-25", "Female"),
            createStudent("ST103", "Arjun Reddy", "CSE", "5th Semester", "2024-25", "Male"),
            createStudent("ST104", "Ananya Singh", "ECE", "3rd Semester", "2024-25", "Female"),
            createStudent("ST105", "Vikram Patel", "CSE", "3rd Semester", "2024-25", "Male"),
            createStudent("ST106", "Deepika Nair", "IT", "3rd Semester", "2024-25", "Female"),
            createStudent("ST107", "Rohit Gupta", "EEE", "5th Semester", "2024-25", "Male"),
            createStudent("ST108", "Sneha Joshi", "ME", "3rd Semester", "2024-25", "Female"),
            createStudent("ST109", "Aditya Kumar", "CSE", "7th Semester", "2024-25", "Male"),
            createStudent("ST110", "Meera Pillai", "IT", "7th Semester", "2024-25", "Female")
        );
        studentRepository.saveAll(students);
    }

    private Student createStudent(String studentId, String fullName, String branch, String semester, String acYear, String gender) {
        return Student.builder()
                .studentId(studentId)
                .fullName(fullName)
                .branch(branch)
                .semester(semester)
                .academicYear(acYear)
                .gender(gender)
                .email(fullName.toLowerCase().replace(" ", ".") + "@gmail.com")
                .phone("9876543210")
                .dateOfBirth("2002-01-01")
                .admissionYear("2022")
                .status("Active")
                .createdAt(LocalDateTime.now())
                .build();
    }

    private void seedSubjects() {
        List<Subject> subjects = Arrays.asList(
            createSubject("CS501", "Data Structures", "CSE", "5th Semester", 4),
            createSubject("CS502", "Database Management", "CSE", "5th Semester", 4),
            createSubject("CS503", "Operating Systems", "CSE", "5th Semester", 3),
            createSubject("CS504", "Computer Networks", "CSE", "5th Semester", 3),
            createSubject("CS505", "Software Engineering", "CSE", "5th Semester", 2),
            createSubject("IT501", "Web Technologies", "IT", "5th Semester", 4),
            createSubject("IT502", "Network Security", "IT", "5th Semester", 3),
            createSubject("CS301", "Java Programming", "CSE", "3rd Semester", 4),
            createSubject("CS302", "Data Structures", "CSE", "3rd Semester", 4),
            createSubject("EC301", "Digital Electronics", "ECE", "3rd Semester", 4),
            createSubject("EE501", "Power Systems", "EEE", "5th Semester", 4),
            createSubject("CS701", "Machine Learning", "CSE", "7th Semester", 4)
        );
        subjectRepository.saveAll(subjects);
    }

    private Subject createSubject(String code, String name, String branch, String sem, int credits) {
        return Subject.builder()
                .subjectCode(code)
                .subjectName(name)
                .branch(branch)
                .semester(sem)
                .credits(credits)
                .academicYear("2024-25")
                .createdAt(LocalDateTime.now())
                .build();
    }

    private void seedSchedulesAndMarks() {
        LocalDate today = LocalDate.now();

        Schedule sch1 = createSchedule("Data Structures", "End-Semester", "CSE", "5th Semester", "CS501", today.plusDays(7), today.plusDays(8), today.plusDays(14));
        Schedule sch2 = createSchedule("Database Management", "End-Semester", "CSE", "5th Semester", "CS502", today.plusDays(10), today.plusDays(11), today.plusDays(17));
        Schedule sch3 = createSchedule("Java Programming", "Mid-Term", "CSE", "3rd Semester", "CS301", today.minusDays(5), today.minusDays(4), today.plusDays(3));
        Schedule sch4 = createSchedule("Web Technologies", "End-Semester", "IT", "5th Semester", "IT501", today.plusDays(14), today.plusDays(15), today.plusDays(21));

        scheduleRepository.saveAll(Arrays.asList(sch1, sch2, sch3, sch4));

        Subject cs301 = subjectRepository.findBySubjectCode("CS301").orElse(null);
        if (cs301 != null) {
            Marks marks = Marks.builder()
                    .studentId("ST105")
                    .subjectId(cs301.getId())
                    .subjectCode("CS301")
                    .subjectName("Java Programming")
                    .scheduleId(sch3.getId())
                    .branch("CSE")
                    .semester("3rd Semester")
                    .academicYear("2024-25")
                    .marks(78)
                    .maxMarks(100)
                    .submitted(true)
                    .submittedAt(LocalDateTime.now())
                    .createdAt(LocalDateTime.now())
                    .build();
            marksRepository.save(marks);
        }
    }

    private Schedule createSchedule(String subjName, String type, String branch, String sem, String code, LocalDate exDate, LocalDate start, LocalDate deadline) {
        Subject sub = subjectRepository.findBySubjectCode(code).orElse(null);
        return Schedule.builder()
                .examName(sem + " " + type + " 2024")
                .examType(type)
                .branch(branch)
                .semester(sem)
                .subjectId(sub != null ? sub.getId() : "null")
                .subjectCode(code)
                .subjectName(subjName)
                .examDate(exDate.toString())
                .startTime("10:00")
                .endTime("13:00")
                .marksPostingStartDate(start.toString())
                .marksPostingDeadline(deadline.toString())
                .createdAt(LocalDateTime.now())
                .build();
    }

    private void seedResults() {
        Result r1 = Result.builder()
                .studentId("ST101")
                .studentName("Rahul Kumar")
                .branch("CSE")
                .semester("5th Semester")
                .academicYear("2024-25")
                .totalMarks(407)
                .totalMaxMarks(500)
                .percentage(81.4)
                .grade("A")
                .status("PASS")
                .publishedAt(LocalDateTime.now())
                .subjectResults(Arrays.asList(
                        new Result.SubjectResult("CS501", "Data Structures", 85, 100, "A", 4, true),
                        new Result.SubjectResult("CS502", "Database Management", 78, 100, "B", 4, true),
                        new Result.SubjectResult("CS503", "Operating Systems", 82, 100, "A", 3, true),
                        new Result.SubjectResult("CS504", "Computer Networks", 74, 100, "B", 3, true),
                        new Result.SubjectResult("CS505", "Software Engineering", 88, 100, "A", 2, true)
                ))
                .build();

        Result r2 = Result.builder()
                .studentId("ST102")
                .studentName("Priya Sharma")
                .branch("IT")
                .semester("5th Semester")
                .academicYear("2024-25")
                .totalMarks(177)
                .totalMaxMarks(200)
                .percentage(88.5)
                .grade("A")
                .status("PASS")
                .publishedAt(LocalDateTime.now())
                .subjectResults(Arrays.asList(
                        new Result.SubjectResult("IT501", "Web Technologies", 91, 100, "A+", 4, true),
                        new Result.SubjectResult("IT502", "Network Security", 86, 100, "A", 3, true)
                ))
                .build();

        Result r3 = Result.builder()
                .studentId("ST103")
                .studentName("Arjun Reddy")
                .branch("CSE")
                .semester("5th Semester")
                .academicYear("2024-25")
                .totalMarks(415)
                .totalMaxMarks(500)
                .percentage(83.0)
                .grade("A")
                .status("PASS")
                .publishedAt(LocalDateTime.now())
                .subjectResults(Arrays.asList(
                        new Result.SubjectResult("CS501", "Data Structures", 87, 100, "A", 4, true),
                        new Result.SubjectResult("CS502", "Database Management", 79, 100, "B", 4, true),
                        new Result.SubjectResult("CS503", "Operating Systems", 83, 100, "A", 3, true),
                        new Result.SubjectResult("CS504", "Computer Networks", 76, 100, "B", 3, true),
                        new Result.SubjectResult("CS505", "Software Engineering", 90, 100, "A+", 2, true)
                ))
                .build();

        resultRepository.saveAll(Arrays.asList(r1, r2, r3));
    }
}
