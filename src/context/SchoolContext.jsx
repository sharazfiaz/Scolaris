import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_SCHOOL_INFO,
  INITIAL_ACADEMIC_YEARS,
  INITIAL_CLASSROOMS,
  INITIAL_CLASSES,
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
  INITIAL_GRADES,
  INITIAL_STUDENT_RECEIPTS,
  INITIAL_TEACHER_PAYMENTS,
  INITIAL_EXAM_STATISTICS,
  INITIAL_ENROLLMENT_TRENDS,
  INITIAL_TIMETABLES
} from '../data/initialSeedData';
import {
  DEFAULT_CYCLES,
  DEFAULT_TRACKS,
  DEFAULT_SUBJECTS,
  DEFAULT_FEE_STRUCTURE
} from '../data/academicStructure';

const SchoolContext = createContext(null);

const STORAGE_KEY = 'scolaris_master_db_v1';

export const SchoolProvider = ({ children }) => {
  // Load data from LocalStorage or fallback to seed data
  const [db, setDb] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved database from local storage', e);
    }
    return {
      schoolInfo: INITIAL_SCHOOL_INFO,
      academicYears: INITIAL_ACADEMIC_YEARS,
      cycles: DEFAULT_CYCLES,
      tracks: DEFAULT_TRACKS,
      subjects: DEFAULT_SUBJECTS,
      feeStructure: DEFAULT_FEE_STRUCTURE,
      classrooms: INITIAL_CLASSROOMS,
      classes: INITIAL_CLASSES,
      teachers: INITIAL_TEACHERS,
      students: INITIAL_STUDENTS,
      grades: INITIAL_GRADES,
      studentReceipts: INITIAL_STUDENT_RECEIPTS,
      teacherPayments: INITIAL_TEACHER_PAYMENTS,
      examStatistics: INITIAL_EXAM_STATISTICS,
      enrollmentTrends: INITIAL_ENROLLMENT_TRENDS,
      timetables: INITIAL_TIMETABLES,
      idCardReissues: [],
      auditLogs: [
        { id: 'log-1', timestamp: new Date().toISOString(), user: 'Dr. Cédric Mboutou', action: 'System Initialized', details: 'Database loaded with 2026-2027 academic structure' }
      ]
    };
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Failed to save database to local storage', e);
    }
  }, [db]);

  // Helper to log sensitive actions
  const addAuditLog = (user, action, details) => {
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      user: user || 'System Administrator',
      action,
      details
    };
    setDb(prev => ({
      ...prev,
      auditLogs: [newLog, ...(prev.auditLogs || [])].slice(0, 200)
    }));
  };

  // Generate Unique Student ID (format: ES-YYYY-XXXXX)
  const generateStudentId = (year = 2026) => {
    const count = (db.students?.length || 0) + 101;
    const padded = String(count).padStart(5, '0');
    return `ES-${year}-${padded}`;
  };

  // Generate Unique Receipt Number (format: REC-YYYY-XXXX)
  const generateReceiptId = (year = 2026) => {
    const count = (db.studentReceipts?.length || 0) + 89;
    const padded = String(count).padStart(4, '0');
    return `REC-${year}-${padded}`;
  };

  // Generate Unique Teacher Pay Slip ID (format: TPAY-YYYY-XXXX)
  const generateTeacherPayId = (year = 2026) => {
    const count = (db.teacherPayments?.length || 0) + 801;
    const padded = String(count).padStart(4, '0');
    return `TPAY-${year}-${padded}`;
  };

  // ----------------------------------------------------
  // STUDENTS & ADMISSIONS
  // ----------------------------------------------------

  const enrollStudent = (studentData, currentUser = 'School Secretary') => {
    const year = db.schoolInfo.currentAcademicYear.split('-')[0] || '2026';
    const newId = generateStudentId(year);
    
    // Calculate initial fee
    const cls = db.classes.find(c => c.id === studentData.classId);
    const cycleFees = db.feeStructure[cls?.cycleId] || db.feeStructure.primary;
    const totalDue = (studentData.enrollmentType === 'New Enrollment' ? cycleFees.enrollmentFee : cycleFees.reenrollmentFee) + cycleFees.tuitionAnnual;

    const newStudent = {
      ...studentData,
      id: newId,
      status: 'Enrolled',
      academicYear: db.schoolInfo.currentAcademicYear,
      registrationDate: new Date().toISOString().split('T')[0],
      feeStatus: {
        totalDue,
        paid: 0,
        balance: totalDue,
        paymentStatus: 'Unpaid'
      },
      siblings: studentData.siblings || []
    };

    setDb(prev => ({
      ...prev,
      students: [newStudent, ...prev.students]
    }));

    addAuditLog(currentUser, 'Student Enrolled', `Enrolled student ${newStudent.firstName} ${newStudent.lastName} (${newId}) into class ${cls?.name}`);
    return newStudent;
  };

  const reenrollStudent = (studentId, targetClassId, targetTrackId = null, currentUser = 'School Secretary') => {
    const cls = db.classes.find(c => c.id === targetClassId);
    const cycleFees = db.feeStructure[cls?.cycleId] || db.feeStructure.primary;
    const totalDue = cycleFees.reenrollmentFee + cycleFees.tuitionAnnual;

    let updatedStudent = null;

    setDb(prev => {
      const students = prev.students.map(std => {
        if (std.id === studentId) {
          updatedStudent = {
            ...std,
            classId: targetClassId,
            levelId: cls?.levelId || std.levelId,
            cycleId: cls?.cycleId || std.cycleId,
            trackId: targetTrackId || std.trackId,
            enrollmentType: 'Re-enrollment',
            status: 'Enrolled',
            academicYear: prev.schoolInfo.currentAcademicYear,
            registrationDate: new Date().toISOString().split('T')[0],
            feeStatus: {
              totalDue,
              paid: 0,
              balance: totalDue,
              paymentStatus: 'Unpaid'
            }
          };
          return updatedStudent;
        }
        return std;
      });
      return { ...prev, students };
    });

    addAuditLog(currentUser, 'Student Re-enrolled', `Re-enrolled student ID ${studentId} into ${cls?.name}`);
    return updatedStudent;
  };

  const updateStudent = (id, updatedFields, currentUser = 'School Administrator') => {
    setDb(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, ...updatedFields } : s)
    }));
    addAuditLog(currentUser, 'Student Updated', `Updated student record ID ${id}`);
  };

  const deleteStudent = (id, currentUser = 'School Administrator') => {
    const student = db.students.find(s => s.id === id);
    setDb(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== id)
    }));
    addAuditLog(currentUser, 'Student Deleted', `Removed student ${student?.firstName} ${student?.lastName} (${id})`);
  };

  const linkSiblings = (studentIdA, studentIdB) => {
    setDb(prev => {
      const students = prev.students.map(s => {
        if (s.id === studentIdA) {
          const siblings = Array.from(new Set([...(s.siblings || []), studentIdB]));
          return { ...s, siblings };
        }
        if (s.id === studentIdB) {
          const siblings = Array.from(new Set([...(s.siblings || []), studentIdA]));
          return { ...s, siblings };
        }
        return s;
      });
      return { ...prev, students };
    });
    addAuditLog('Administration', 'Siblings Linked', `Linked sibling relations between ${studentIdA} and ${studentIdB}`);
  };

  const reissueIdCard = (studentId, reason, currentUser = 'School Secretary') => {
    const student = db.students.find(s => s.id === studentId);
    const record = {
      id: `reissue-${Date.now()}`,
      studentId,
      studentName: student ? `${student.firstName} ${student.lastName}` : studentId,
      date: new Date().toISOString().split('T')[0],
      reason,
      issuedBy: currentUser
    };
    setDb(prev => ({
      ...prev,
      idCardReissues: [record, ...(prev.idCardReissues || [])]
    }));
    addAuditLog(currentUser, 'ID Card Reissued', `Reissued school ID card for student ${studentId}. Reason: ${reason}`);
    return record;
  };

  // ----------------------------------------------------
  // TEACHERS & PAYROLL
  // ----------------------------------------------------

  const addTeacher = (teacherData, currentUser = 'Principal') => {
    const newId = `tch_${Date.now().toString().slice(-4)}`;
    const newTeacher = {
      ...teacherData,
      id: newId,
      status: 'Active',
      hireDate: teacherData.hireDate || new Date().toISOString().split('T')[0],
      assignments: teacherData.assignments || []
    };
    setDb(prev => ({
      ...prev,
      teachers: [newTeacher, ...prev.teachers]
    }));
    addAuditLog(currentUser, 'Teacher Added', `Added teacher ${newTeacher.firstName} ${newTeacher.lastName}`);
    return newTeacher;
  };

  const updateTeacher = (id, updatedFields, currentUser = 'Principal') => {
    setDb(prev => ({
      ...prev,
      teachers: prev.teachers.map(t => t.id === id ? { ...t, ...updatedFields } : t)
    }));
    addAuditLog(currentUser, 'Teacher Updated', `Updated profile of teacher ID ${id}`);
  };

  const deleteTeacher = (id, currentUser = 'Principal') => {
    setDb(prev => ({
      ...prev,
      teachers: prev.teachers.filter(t => t.id !== id)
    }));
    addAuditLog(currentUser, 'Teacher Deleted', `Removed teacher ID ${id}`);
  };

  const updateTeacherAssignments = (teacherId, assignments, currentUser = 'Principal') => {
    setDb(prev => ({
      ...prev,
      teachers: prev.teachers.map(t => t.id === teacherId ? { ...t, assignments } : t)
    }));
    addAuditLog(currentUser, 'Teacher Assignments Updated', `Updated class/hour workload for teacher ID ${teacherId}`);
  };

  // Calculate teacher monthly pay based on cycle rule
  const calculateTeacherMonthlyPay = (teacher) => {
    if (!teacher) return { type: 'unknown', gross: 0, details: [] };
    if (teacher.payType === 'fixed') {
      return {
        type: 'Fixed Monthly Salary',
        gross: teacher.monthlySalary || 0,
        weeklyHours: 0,
        monthlyHours: 0,
        hourlyRate: 0,
        details: [{ label: 'Fixed Base Salary (Preschool/Primary)', amount: teacher.monthlySalary || 0 }]
      };
    } else {
      // Hourly: Strictly Hours Worked * Hourly Rate
      const totalWeeklyHours = (teacher.assignments || []).reduce((sum, a) => sum + (Number(a.weeklyHours) || 0), 0);
      const monthlyHours = totalWeeklyHours * 4; // 4 weeks in a month
      const rate = teacher.hourlyRate || 4000;
      const gross = monthlyHours * rate;
      const breakdown = (teacher.assignments || []).map(a => {
        const cls = db.classes.find(c => c.id === a.classId);
        const subj = db.subjects.find(s => s.id === a.subjectId);
        return {
          className: cls?.name || a.classId,
          subjectName: subj?.name || a.subjectId,
          weeklyHours: a.weeklyHours,
          monthlyHours: a.weeklyHours * 4,
          amount: a.weeklyHours * 4 * rate
        };
      });
      return {
        type: 'Hourly Workload',
        gross,
        weeklyHours: totalWeeklyHours,
        monthlyHours,
        hourlyRate: rate,
        details: breakdown
      };
    }
  };

  const processTeacherPayment = (paymentData, currentUser = 'Chief Accountant') => {
    const year = db.schoolInfo.currentAcademicYear.split('-')[0] || '2026';
    const newId = generateTeacherPayId(year);
    const newPayment = {
      ...paymentData,
      id: newId,
      date: paymentData.date || new Date().toISOString().split('T')[0],
      processedBy: currentUser
    };

    setDb(prev => ({
      ...prev,
      teacherPayments: [newPayment, ...prev.teacherPayments]
    }));

    addAuditLog(currentUser, 'Teacher Payment Processed', `Issued pay voucher ${newId} for ${paymentData.teacherName}: ${paymentData.netPaid.toLocaleString()} FCFA`);
    return newPayment;
  };

  // ----------------------------------------------------
  // GRADES & REPORT CARDS
  // ----------------------------------------------------

  const saveGrade = (gradeEntry, currentUser = 'Teacher') => {
    const subj = db.subjects.find(s => s.id === gradeEntry.subjectId);
    const caWeight = subj?.caWeight !== undefined ? subj.caWeight : 40;
    const examWeight = subj?.examWeight !== undefined ? subj.examWeight : 60;
    
    const ca = Number(gradeEntry.caScore) || 0;
    const exam = Number(gradeEntry.examScore) || 0;
    const average = parseFloat(((ca * (caWeight / 100)) + (exam * (examWeight / 100))).toFixed(2));

    const newGrade = {
      ...gradeEntry,
      id: gradeEntry.id || `grd_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      caScore: ca,
      examScore: exam,
      average,
      academicYear: gradeEntry.academicYear || db.schoolInfo.currentAcademicYear,
      updatedAt: new Date().toISOString()
    };

    setDb(prev => {
      const existsIndex = prev.grades.findIndex(
        g => g.studentId === newGrade.studentId &&
             g.subjectId === newGrade.subjectId &&
             g.term === newGrade.term &&
             g.academicYear === newGrade.academicYear
      );

      let updatedGrades;
      if (existsIndex >= 0) {
        updatedGrades = [...prev.grades];
        updatedGrades[existsIndex] = newGrade;
      } else {
        updatedGrades = [newGrade, ...prev.grades];
      }
      return { ...prev, grades: updatedGrades };
    });

    return newGrade;
  };

  const saveBatchGrades = (gradesList, currentUser = 'Teacher') => {
    gradesList.forEach(g => saveGrade(g, currentUser));
    addAuditLog(currentUser, 'Batch Grades Saved', `Saved ${gradesList.length} grade entries`);
  };

  // Calculate Report Card data for a student in a term
  const calculateStudentReportCard = (studentId, term = 'Term 1', academicYear = null) => {
    const year = academicYear || db.schoolInfo.currentAcademicYear;
    const student = db.students.find(s => s.id === studentId);
    if (!student) return null;

    const studentClass = db.classes.find(c => c.id === student.classId);
    const track = student.trackId ? db.tracks.find(t => t.id === student.trackId) : null;
    
    // Find all subjects applicable to this class/track
    const applicableSubjects = db.subjects.filter(subj => {
      if (subj.applicableCycles && !subj.applicableCycles.includes(studentClass?.cycleId)) {
        return false;
      }
      return true;
    });

    // Match student grades
    let totalWeightedScore = 0;
    let totalCoefficients = 0;

    const subjectRows = applicableSubjects.map(subj => {
      // Determine coefficient from track or subject default
      let coeff = subj.defaultWeight || 1;
      if (track && track.subjectWeights && track.subjectWeights[subj.id] !== undefined) {
        coeff = track.subjectWeights[subj.id];
      }

      const gradeRecord = db.grades.find(
        g => g.studentId === studentId &&
             g.subjectId === subj.id &&
             g.term === term &&
             g.academicYear === year
      );

      const caScore = gradeRecord ? gradeRecord.caScore : null;
      const examScore = gradeRecord ? gradeRecord.examScore : null;
      const avg = gradeRecord ? gradeRecord.average : null;
      const weightedAvg = avg !== null ? parseFloat((avg * coeff).toFixed(2)) : null;

      if (avg !== null) {
        totalWeightedScore += avg * coeff;
        totalCoefficients += coeff;
      }

      return {
        subject: subj,
        coeff,
        caScore,
        examScore,
        average: avg,
        weightedAverage: weightedAvg,
        teacherComment: gradeRecord?.teacherComment || ''
      };
    });

    const overallAverage = totalCoefficients > 0 ? parseFloat((totalWeightedScore / totalCoefficients).toFixed(2)) : 0;

    // Calculate class ranking for this term
    const classStudents = db.students.filter(s => s.classId === student.classId && s.status === 'Enrolled');
    const classAverages = classStudents.map(s => {
      const otherCard = s.id === studentId ? { overallAverage } : calculateStudentReportCard(s.id, term, year);
      return { studentId: s.id, average: otherCard?.overallAverage || 0 };
    }).sort((a, b) => b.average - a.average);

    const rankIndex = classAverages.findIndex(c => c.studentId === studentId);
    const rank = rankIndex >= 0 ? rankIndex + 1 : 1;
    const highestAverage = classAverages.length > 0 ? classAverages[0].average : 0;
    const lowestAverage = classAverages.length > 0 ? classAverages[classAverages.length - 1].average : 0;
    const classMean = classAverages.length > 0
      ? parseFloat((classAverages.reduce((acc, curr) => acc + curr.average, 0) / classAverages.length).toFixed(2))
      : 0;

    return {
      student,
      studentClass,
      track,
      term,
      academicYear: year,
      subjectRows,
      overallAverage,
      totalWeightedScore: parseFloat(totalWeightedScore.toFixed(2)),
      totalCoefficients,
      rank,
      totalStudentsInClass: classStudents.length,
      highestAverage,
      lowestAverage,
      classMean
    };
  };

  // ----------------------------------------------------
  // ACCOUNTING & RECEIPTS
  // ----------------------------------------------------

  const recordStudentPayment = (paymentData, currentUser = 'Chief Accountant') => {
    const year = db.schoolInfo.currentAcademicYear.split('-')[0] || '2026';
    const newId = generateReceiptId(year);
    
    const student = db.students.find(s => s.id === paymentData.studentId);
    const currentPaid = student?.feeStatus?.paid || 0;
    const totalDue = student?.feeStatus?.totalDue || 0;
    const newPaid = currentPaid + Number(paymentData.amount);
    const remainingBalance = Math.max(0, totalDue - newPaid);
    
    let paymentStatus = 'Partial';
    if (newPaid >= totalDue) paymentStatus = 'Fully Paid';
    else if (newPaid === 0) paymentStatus = 'Unpaid';

    const newReceipt = {
      ...paymentData,
      id: newId,
      amount: Number(paymentData.amount),
      remainingBalance,
      date: paymentData.date || new Date().toISOString().split('T')[0],
      receivedBy: currentUser
    };

    setDb(prev => ({
      ...prev,
      studentReceipts: [newReceipt, ...prev.studentReceipts],
      students: prev.students.map(s => {
        if (s.id === paymentData.studentId) {
          return {
            ...s,
            feeStatus: {
              ...s.feeStatus,
              paid: newPaid,
              balance: remainingBalance,
              paymentStatus
            }
          };
        }
        return s;
      })
    }));

    addAuditLog(currentUser, 'Fee Payment Recorded', `Issued receipt ${newId} for ${paymentData.studentName}: ${paymentData.amount.toLocaleString()} FCFA (${paymentData.paymentMethod})`);
    return newReceipt;
  };

  // ----------------------------------------------------
  // CONFIGURATION & DYNAMIC EXTENSIBILITY
  // ----------------------------------------------------

  const addTrack = (trackData, currentUser = 'Principal') => {
    const newTrack = {
      ...trackData,
      id: `track_${Date.now().toString().slice(-4)}`
    };
    setDb(prev => ({
      ...prev,
      tracks: [...prev.tracks, newTrack]
    }));
    addAuditLog(currentUser, 'Track Created', `Added new upper secondary track: ${newTrack.code} (${newTrack.name})`);
    return newTrack;
  };

  const updateTrack = (trackId, updatedFields, currentUser = 'Principal') => {
    setDb(prev => ({
      ...prev,
      tracks: prev.tracks.map(t => t.id === trackId ? { ...t, ...updatedFields } : t)
    }));
    addAuditLog(currentUser, 'Track Updated', `Updated track configuration for ${trackId}`);
  };

  const deleteTrack = (trackId, currentUser = 'Principal') => {
    setDb(prev => ({
      ...prev,
      tracks: prev.tracks.filter(t => t.id !== trackId)
    }));
    addAuditLog(currentUser, 'Track Deleted', `Deleted track ID ${trackId}`);
  };

  const addSubject = (subjectData, currentUser = 'Principal') => {
    const newSubj = {
      ...subjectData,
      id: `subj_${Date.now().toString().slice(-4)}`
    };
    setDb(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubj]
    }));
    addAuditLog(currentUser, 'Subject Created', `Added new subject: ${newSubj.name} (${newSubj.code})`);
    return newSubj;
  };

  const updateSubject = (subjectId, updatedFields, currentUser = 'Principal') => {
    setDb(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === subjectId ? { ...s, ...updatedFields } : s)
    }));
    addAuditLog(currentUser, 'Subject Updated', `Updated subject ID ${subjectId}`);
  };

  const deleteSubject = (subjectId, currentUser = 'Principal') => {
    setDb(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s.id !== subjectId)
    }));
    addAuditLog(currentUser, 'Subject Deleted', `Deleted subject ID ${subjectId}`);
  };

  const addClass = (classData, currentUser = 'Principal') => {
    const newClass = {
      ...classData,
      id: `cls_${Date.now().toString().slice(-4)}`
    };
    setDb(prev => ({
      ...prev,
      classes: [...prev.classes, newClass]
    }));
    addAuditLog(currentUser, 'Class Created', `Added new classroom cohort: ${newClass.name}`);
    return newClass;
  };

  const updateClass = (classId, updatedFields, currentUser = 'Principal') => {
    setDb(prev => ({
      ...prev,
      classes: prev.classes.map(c => c.id === classId ? { ...c, ...updatedFields } : c)
    }));
    addAuditLog(currentUser, 'Class Updated', `Updated class ID ${classId}`);
  };

  const addClassroom = (roomData, currentUser = 'Principal') => {
    const newRoom = {
      ...roomData,
      id: `room_${Date.now().toString().slice(-4)}`
    };
    setDb(prev => ({
      ...prev,
      classrooms: [...prev.classrooms, newRoom]
    }));
    addAuditLog(currentUser, 'Classroom Added', `Added physical room ${newRoom.name} with capacity ${newRoom.capacity}`);
    return newRoom;
  };

  const updateClassroom = (roomId, updatedFields, currentUser = 'Principal') => {
    setDb(prev => ({
      ...prev,
      classrooms: prev.classrooms.map(r => r.id === roomId ? { ...r, ...updatedFields } : r)
    }));
  };

  const updateSchoolInfo = (newInfo, currentUser = 'Principal') => {
    setDb(prev => ({
      ...prev,
      schoolInfo: { ...prev.schoolInfo, ...newInfo }
    }));
    addAuditLog(currentUser, 'School Info Updated', 'Updated general institution parameters');
  };

  const updateFeeStructure = (newFeeStructure, currentUser = 'Principal') => {
    setDb(prev => ({
      ...prev,
      feeStructure: newFeeStructure
    }));
    addAuditLog(currentUser, 'Fee Structure Updated', 'Updated annual and termly fee rates');
  };

  const updateTimetable = (classId, newSchedule, currentUser = 'Principal') => {
    setDb(prev => {
      const existsIndex = prev.timetables.findIndex(t => t.classId === classId);
      let updatedTimetables = [...prev.timetables];
      const cls = prev.classes.find(c => c.id === classId);
      const entry = {
        classId,
        className: cls?.name || classId,
        schedule: newSchedule
      };
      if (existsIndex >= 0) {
        updatedTimetables[existsIndex] = entry;
      } else {
        updatedTimetables.push(entry);
      }
      return { ...prev, timetables: updatedTimetables };
    });
    addAuditLog(currentUser, 'Timetable Updated', `Updated timetable for class ID ${classId}`);
  };

  // State Exam Pass Rates recording (CEP, BEPC, Baccalauréat)
  const recordExamResult = (examCode, year, data) => {
    setDb(prev => {
      const stats = JSON.parse(JSON.stringify(prev.examStatistics));
      const examIndex = stats.findIndex(e => e.examCode === examCode);
      if (examIndex >= 0) {
        if (examCode === 'BAC' && data.trackCode) {
          const trackIndex = stats[examIndex].tracks.findIndex(t => t.trackCode === data.trackCode);
          if (trackIndex >= 0) {
            const yearIndex = stats[examIndex].tracks[trackIndex].years.findIndex(y => y.year === year);
            const passRate = data.candidates > 0 ? parseFloat(((data.passed / data.candidates) * 100).toFixed(1)) : 0;
            const yearData = { year, candidates: data.candidates, passed: data.passed, failed: data.candidates - data.passed, passRate };
            if (yearIndex >= 0) {
              stats[examIndex].tracks[trackIndex].years[yearIndex] = yearData;
            } else {
              stats[examIndex].tracks[trackIndex].years.push(yearData);
            }
          }
        } else {
          const yearIndex = stats[examIndex].years.findIndex(y => y.year === year);
          const passRate = data.candidates > 0 ? parseFloat(((data.passed / data.candidates) * 100).toFixed(1)) : 0;
          const yearData = { year, candidates: data.candidates, passed: data.passed, failed: data.candidates - data.passed, passRate };
          if (yearIndex >= 0) {
            stats[examIndex].years[yearIndex] = yearData;
          } else {
            stats[examIndex].years.push(yearData);
          }
        }
      }
      return { ...prev, examStatistics: stats };
    });
    addAuditLog('Administration', 'State Exam Results Recorded', `Updated ${examCode} official exam results for ${year}`);
  };

  // Backup and Restore
  const exportDataBackup = () => {
    const jsonStr = JSON.stringify(db, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SCOLARIS_Backup_${db.schoolInfo.shortName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addAuditLog('Administration', 'Backup Exported', 'Exported full school database to local JSON file');
  };

  const importDataBackup = (jsonData) => {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (parsed.schoolInfo && parsed.students && parsed.classes) {
        setDb(parsed);
        addAuditLog('Administration', 'Backup Restored', 'Restored complete database from backup file');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import database', e);
      return false;
    }
  };

  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <SchoolContext.Provider value={{
      db,
      schoolInfo: db.schoolInfo,
      academicYears: db.academicYears,
      cycles: db.cycles,
      tracks: db.tracks,
      subjects: db.subjects,
      feeStructure: db.feeStructure,
      classrooms: db.classrooms,
      classes: db.classes,
      teachers: db.teachers,
      students: db.students,
      grades: db.grades,
      studentReceipts: db.studentReceipts,
      teacherPayments: db.teacherPayments,
      examStatistics: db.examStatistics,
      enrollmentTrends: db.enrollmentTrends,
      timetables: db.timetables,
      idCardReissues: db.idCardReissues,
      auditLogs: db.auditLogs,

      // Functions
      enrollStudent,
      reenrollStudent,
      updateStudent,
      deleteStudent,
      linkSiblings,
      reissueIdCard,

      addTeacher,
      updateTeacher,
      deleteTeacher,
      updateTeacherAssignments,
      calculateTeacherMonthlyPay,
      processTeacherPayment,

      saveGrade,
      saveBatchGrades,
      calculateStudentReportCard,

      recordStudentPayment,

      addTrack,
      updateTrack,
      deleteTrack,
      addSubject,
      updateSubject,
      deleteSubject,
      addClass,
      updateClass,
      addClassroom,
      updateClassroom,
      updateSchoolInfo,
      updateFeeStructure,
      updateTimetable,
      recordExamResult,

      exportDataBackup,
      importDataBackup,
      resetToDemoData,
      addAuditLog
    }}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
