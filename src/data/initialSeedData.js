export const INITIAL_SCHOOL_INFO = {
  name: "Complexe Scolaire La Renaissance",
  shortName: "CS Renaissance",
  country: "Republic of the Congo",
  city: "Brazzaville",
  district: "Bacongo / Moungali Complex",
  address: "Avenue de l'Indépendance, BP 1420, Brazzaville",
  phone: "+242 06 612 34 56 / +242 05 523 78 90",
  email: "contact@cs-renaissance-brazza.cg",
  motto: "Discipline — Excellence — Success",
  currentAcademicYear: "2026-2027",
  currentTerm: "Term 1",
  currency: "FCFA",
};

export const INITIAL_ACADEMIC_YEARS = [
  { id: 'ay_2026_2027', name: '2026-2027', isCurrent: true, startDate: '2026-09-01', endDate: '2027-06-30' },
  { id: 'ay_2025_2026', name: '2025-2026', isCurrent: false, startDate: '2025-09-01', endDate: '2026-06-30' },
  { id: 'ay_2024_2025', name: '2024-2025', isCurrent: false, startDate: '2024-09-01', endDate: '2025-06-30' },
  { id: 'ay_2023_2024', name: '2023-2024', isCurrent: false, startDate: '2023-09-01', endDate: '2024-06-30' },
];

export const INITIAL_CLASSROOMS = [
  { id: 'room_ps1', name: 'Preschool Hall 1', building: 'Building A (Early Years)', capacity: 25 },
  { id: 'room_ps2', name: 'Preschool Hall 2', building: 'Building A (Early Years)', capacity: 25 },
  { id: 'room_ps3', name: 'Preschool Hall 3', building: 'Building A (Early Years)', capacity: 30 },
  { id: 'room_cp_a', name: 'Room 101 - Primary CP-A', building: 'Building B (Primary)', capacity: 35 },
  { id: 'room_cp_b', name: 'Room 102 - Primary CP-B', building: 'Building B (Primary)', capacity: 35 },
  { id: 'room_ce1', name: 'Room 103 - Primary CE1', building: 'Building B (Primary)', capacity: 35 },
  { id: 'room_ce2', name: 'Room 104 - Primary CE2', building: 'Building B (Primary)', capacity: 35 },
  { id: 'room_cm1', name: 'Room 105 - Primary CM1', building: 'Building B (Primary)', capacity: 40 },
  { id: 'room_cm2', name: 'Room 106 - Primary CM2 (CEP)', building: 'Building B (Primary)', capacity: 40 },
  { id: 'room_6a', name: 'Room 201 - 6th Grade A', building: 'Building C (Secondary)', capacity: 45 },
  { id: 'room_6b', name: 'Room 202 - 6th Grade B', building: 'Building C (Secondary)', capacity: 45 },
  { id: 'room_5a', name: 'Room 203 - 5th Grade', building: 'Building C (Secondary)', capacity: 45 },
  { id: 'room_4a', name: 'Room 204 - 4th Grade', building: 'Building C (Secondary)', capacity: 45 },
  { id: 'room_3a', name: 'Room 205 - 3rd Grade A (BEPC)', building: 'Building C (Secondary)', capacity: 45 },
  { id: 'room_3b', name: 'Room 206 - 3rd Grade B (BEPC)', building: 'Building C (Secondary)', capacity: 45 },
  { id: 'room_2nde_a', name: 'Room 301 - Seconde Track A', building: 'Building D (High School)', capacity: 40 },
  { id: 'room_2nde_c', name: 'Room 302 - Seconde Track C', building: 'Building D (High School)', capacity: 40 },
  { id: 'room_1ere_a', name: 'Room 303 - Première Track A', building: 'Building D (High School)', capacity: 40 },
  { id: 'room_1ere_c', name: 'Room 304 - Première Track C', building: 'Building D (High School)', capacity: 40 },
  { id: 'room_tle_a', name: 'Room 305 - Terminale Track A (Bac)', building: 'Building D (High School)', capacity: 40 },
  { id: 'room_tle_c', name: 'Room 306 - Terminale Track C (Bac)', building: 'Building D (High School)', capacity: 35 },
];

export const INITIAL_CLASSES = [
  // Preschool
  { id: 'cls_ps1', name: 'Lower Section (Petite Section)', cycleId: 'preschool', levelId: 'ps_lower', roomId: 'room_ps1', capacity: 25, homeroomTeacherId: 'tch_01' },
  { id: 'cls_ps2', name: 'Middle Section (Moyenne Section)', cycleId: 'preschool', levelId: 'ps_middle', roomId: 'room_ps2', capacity: 25, homeroomTeacherId: 'tch_02' },
  { id: 'cls_ps3', name: 'Upper Section (Grande Section)', cycleId: 'preschool', levelId: 'ps_upper', roomId: 'room_ps3', capacity: 30, homeroomTeacherId: 'tch_03' },
  
  // Primary
  { id: 'cls_cp_a', name: 'CP - Group A', cycleId: 'primary', levelId: 'pri_cp', roomId: 'room_cp_a', capacity: 35, homeroomTeacherId: 'tch_04' },
  { id: 'cls_cp_b', name: 'CP - Group B', cycleId: 'primary', levelId: 'pri_cp', roomId: 'room_cp_b', capacity: 35, homeroomTeacherId: 'tch_05' },
  { id: 'cls_ce1', name: 'CE1', cycleId: 'primary', levelId: 'pri_ce1', roomId: 'room_ce1', capacity: 35, homeroomTeacherId: 'tch_06' },
  { id: 'cls_ce2', name: 'CE2', cycleId: 'primary', levelId: 'pri_ce2', roomId: 'room_ce2', capacity: 35, homeroomTeacherId: 'tch_07' },
  { id: 'cls_cm1', name: 'CM1', cycleId: 'primary', levelId: 'pri_cm1', roomId: 'room_cm1', capacity: 40, homeroomTeacherId: 'tch_08' },
  { id: 'cls_cm2', name: 'CM2 (Exam Year CEP)', cycleId: 'primary', levelId: 'pri_cm2', roomId: 'room_cm2', capacity: 40, homeroomTeacherId: 'tch_09' },

  // Lower Secondary
  { id: 'cls_6a', name: '6th Grade A (6ème A)', cycleId: 'lower_secondary', levelId: 'sec_6th', roomId: 'room_6a', capacity: 45 },
  { id: 'cls_6b', name: '6th Grade B (6ème B)', cycleId: 'lower_secondary', levelId: 'sec_6th', roomId: 'room_6b', capacity: 45 },
  { id: 'cls_5a', name: '5th Grade (5ème)', cycleId: 'lower_secondary', levelId: 'sec_5th', roomId: 'room_5a', capacity: 45 },
  { id: 'cls_4a', name: '4th Grade (4ème)', cycleId: 'lower_secondary', levelId: 'sec_4th', roomId: 'room_4a', capacity: 45 },
  { id: 'cls_3a', name: '3rd Grade A (3ème A - BEPC)', cycleId: 'lower_secondary', levelId: 'sec_3rd', roomId: 'room_3a', capacity: 45 },
  { id: 'cls_3b', name: '3rd Grade B (3ème B - BEPC)', cycleId: 'lower_secondary', levelId: 'sec_3rd', roomId: 'room_3b', capacity: 45 },

  // Upper Secondary
  { id: 'cls_2nde_a', name: 'Seconde A (Arts/Humanities)', cycleId: 'upper_secondary', levelId: 'sec_2nde', trackId: 'track_a', roomId: 'room_2nde_a', capacity: 40 },
  { id: 'cls_2nde_c', name: 'Seconde C (Sciences)', cycleId: 'upper_secondary', levelId: 'sec_2nde', trackId: 'track_c', roomId: 'room_2nde_c', capacity: 40 },
  { id: 'cls_1ere_a', name: 'Première A (Literature)', cycleId: 'upper_secondary', levelId: 'sec_1ere', trackId: 'track_a', roomId: 'room_1ere_a', capacity: 40 },
  { id: 'cls_1ere_c', name: 'Première C (Sciences)', cycleId: 'upper_secondary', levelId: 'sec_1ere', trackId: 'track_c', roomId: 'room_1ere_c', capacity: 40 },
  { id: 'cls_tle_a', name: 'Terminale A (Baccalauréat Arts)', cycleId: 'upper_secondary', levelId: 'sec_tle', trackId: 'track_a', roomId: 'room_tle_a', capacity: 40 },
  { id: 'cls_tle_c', name: 'Terminale C (Baccalauréat Sciences)', cycleId: 'upper_secondary', levelId: 'sec_tle', trackId: 'track_c', roomId: 'room_tle_c', capacity: 35 },
];

export const INITIAL_TEACHERS = [
  // Primary / Preschool Teachers (Fixed Salary)
  {
    id: 'tch_01',
    firstName: 'Jeanne',
    lastName: 'Mavoungou',
    gender: 'Female',
    phone: '+242 06 910 11 22',
    email: 'j.mavoungou@cs-renaissance.cg',
    cycles: ['preschool'],
    payType: 'fixed',
    monthlySalary: 190000,
    homeroomClassId: 'cls_ps1',
    hireDate: '2021-09-01',
    status: 'Active'
  },
  {
    id: 'tch_04',
    firstName: 'Alphonse',
    lastName: 'Ngoma',
    gender: 'Male',
    phone: '+242 05 840 22 33',
    email: 'a.ngoma@cs-renaissance.cg',
    cycles: ['primary'],
    payType: 'fixed',
    monthlySalary: 210000,
    homeroomClassId: 'cls_cp_a',
    hireDate: '2019-10-01',
    status: 'Active'
  },
  {
    id: 'tch_09',
    firstName: 'Barthélémy',
    lastName: 'Bouity',
    gender: 'Male',
    phone: '+242 06 633 44 55',
    email: 'b.bouity@cs-renaissance.cg',
    cycles: ['primary'],
    payType: 'fixed',
    monthlySalary: 230000,
    homeroomClassId: 'cls_cm2',
    hireDate: '2017-09-15',
    status: 'Active'
  },

  // Secondary Teachers (Hourly Pay)
  {
    id: 'tch_10',
    firstName: 'Dieudonné',
    lastName: 'Kouassi',
    gender: 'Male',
    phone: '+242 06 720 99 88',
    email: 'd.kouassi@cs-renaissance.cg',
    cycles: ['lower_secondary', 'upper_secondary'],
    payType: 'hourly',
    hourlyRate: 4500, // FCFA per hour
    subjects: ['subj_math'],
    hireDate: '2020-10-01',
    status: 'Active',
    assignments: [
      { classId: 'cls_6a', subjectId: 'subj_math', weeklyHours: 5 },
      { classId: 'cls_3a', subjectId: 'subj_math', weeklyHours: 5 },
      { classId: 'cls_2nde_c', subjectId: 'subj_math', weeklyHours: 6 },
      { classId: 'cls_tle_c', subjectId: 'subj_math', weeklyHours: 6 }
    ]
  },
  {
    id: 'tch_11',
    firstName: 'Antoinette',
    lastName: 'Makosso',
    gender: 'Female',
    phone: '+242 05 511 77 44',
    email: 'a.makosso@cs-renaissance.cg',
    cycles: ['lower_secondary', 'upper_secondary'],
    payType: 'hourly',
    hourlyRate: 4200,
    subjects: ['subj_french', 'subj_philo'],
    hireDate: '2018-09-01',
    status: 'Active',
    assignments: [
      { classId: 'cls_6a', subjectId: 'subj_french', weeklyHours: 5 },
      { classId: 'cls_3a', subjectId: 'subj_french', weeklyHours: 5 },
      { classId: 'cls_1ere_a', subjectId: 'subj_french', weeklyHours: 5 },
      { classId: 'cls_tle_a', subjectId: 'subj_philo', weeklyHours: 4 }
    ]
  },
  {
    id: 'tch_12',
    firstName: 'Guy-Roland',
    lastName: 'Tsiba',
    gender: 'Male',
    phone: '+242 06 880 12 34',
    email: 'gr.tsiba@cs-renaissance.cg',
    cycles: ['lower_secondary', 'upper_secondary'],
    payType: 'hourly',
    hourlyRate: 4500,
    subjects: ['subj_phys_sci'],
    hireDate: '2022-09-15',
    status: 'Active',
    assignments: [
      { classId: 'cls_3a', subjectId: 'subj_phys_sci', weeklyHours: 3 },
      { classId: 'cls_2nde_c', subjectId: 'subj_phys_sci', weeklyHours: 4 },
      { classId: 'cls_tle_c', subjectId: 'subj_phys_sci', weeklyHours: 5 }
    ]
  },
  {
    id: 'tch_13',
    firstName: 'Sylvie',
    lastName: 'Loundou',
    gender: 'Female',
    phone: '+242 05 600 33 22',
    email: 's.loundou@cs-renaissance.cg',
    cycles: ['lower_secondary', 'upper_secondary'],
    payType: 'hourly',
    hourlyRate: 4000,
    subjects: ['subj_english'],
    hireDate: '2021-10-01',
    status: 'Active',
    assignments: [
      { classId: 'cls_6a', subjectId: 'subj_english', weeklyHours: 3 },
      { classId: 'cls_3a', subjectId: 'subj_english', weeklyHours: 3 },
      { classId: 'cls_tle_a', subjectId: 'subj_english', weeklyHours: 4 },
      { classId: 'cls_tle_c', subjectId: 'subj_english', weeklyHours: 3 }
    ]
  }
];

export const INITIAL_STUDENTS = [
  // CM2 - Primary CEP
  {
    id: 'ES-2026-00101',
    firstName: 'Junior Paul',
    lastName: 'Mouanda',
    gender: 'Male',
    dateOfBirth: '2015-04-12',
    placeOfBirth: 'Brazzaville',
    cycleId: 'primary',
    levelId: 'pri_cm2',
    classId: 'cls_cm2',
    status: 'Enrolled',
    enrollmentType: 'Re-enrollment',
    academicYear: '2026-2027',
    registrationDate: '2026-08-15',
    siblings: ['ES-2026-00102'],
    guardians: {
      father: { name: 'Michel Mouanda', phone: '+242 06 677 88 99', profession: 'Civil Engineer', email: 'm.mouanda@gmail.com' },
      mother: { name: 'Clarisse Mouanda', phone: '+242 05 544 33 22', profession: 'Bank Officer', email: 'c.mouanda@gmail.com' },
      emergency: { name: 'Michel Mouanda', relation: 'Father', phone: '+242 06 677 88 99' }
    },
    feeStatus: {
      totalDue: 245000, // 20k reenrollment + 225k tuition
      paid: 245000,
      balance: 0,
      paymentStatus: 'Fully Paid'
    }
  },
  {
    id: 'ES-2026-00102',
    firstName: 'Grace Syntiche',
    lastName: 'Mouanda',
    gender: 'Female',
    dateOfBirth: '2018-09-24',
    placeOfBirth: 'Brazzaville',
    cycleId: 'primary',
    levelId: 'pri_ce1',
    classId: 'cls_ce1',
    status: 'Enrolled',
    enrollmentType: 'Re-enrollment',
    academicYear: '2026-2027',
    registrationDate: '2026-08-15',
    siblings: ['ES-2026-00101'],
    guardians: {
      father: { name: 'Michel Mouanda', phone: '+242 06 677 88 99', profession: 'Civil Engineer', email: 'm.mouanda@gmail.com' },
      mother: { name: 'Clarisse Mouanda', phone: '+242 05 544 33 22', profession: 'Bank Officer', email: 'c.mouanda@gmail.com' }
    },
    feeStatus: {
      totalDue: 245000,
      paid: 150000,
      balance: 95000,
      paymentStatus: 'Partial'
    }
  },

  // 6th Grade (6ème) - Secondary
  {
    id: 'ES-2026-00201',
    firstName: 'Emmanuel Prince',
    lastName: 'Massamba',
    gender: 'Male',
    dateOfBirth: '2014-02-18',
    placeOfBirth: 'Pointe-Noire',
    cycleId: 'lower_secondary',
    levelId: 'sec_6th',
    classId: 'cls_6a',
    status: 'Enrolled',
    enrollmentType: 'New Enrollment',
    academicYear: '2026-2027',
    registrationDate: '2026-08-18',
    siblings: [],
    guardians: {
      father: { name: 'Arsène Massamba', phone: '+242 06 820 11 44', profession: 'Port Authority Logistics', email: 'a.massamba@port.cg' },
      mother: { name: 'Béatrice Massamba', phone: '+242 05 733 99 11', profession: 'Nurse', email: '' }
    },
    feeStatus: {
      totalDue: 350000, // 35k enrollment + 315k tuition
      paid: 200000,
      balance: 150000,
      paymentStatus: 'Partial'
    }
  },
  {
    id: 'ES-2026-00202',
    firstName: 'Divine Esther',
    lastName: 'Kimbembé',
    gender: 'Female',
    dateOfBirth: '2014-07-05',
    placeOfBirth: 'Brazzaville',
    cycleId: 'lower_secondary',
    levelId: 'sec_6th',
    classId: 'cls_6a',
    status: 'Enrolled',
    enrollmentType: 'Re-enrollment',
    academicYear: '2026-2027',
    registrationDate: '2026-08-10',
    siblings: [],
    guardians: {
      father: { name: 'Constant Kimbembé', phone: '+242 06 944 55 66', profession: 'Accountant', email: 'c.kimbembe@audit.cg' },
      mother: { name: 'Honorine Kimbembé', phone: '+242 05 500 22 11', profession: 'Teacher', email: '' }
    },
    feeStatus: {
      totalDue: 340000,
      paid: 340000,
      balance: 0,
      paymentStatus: 'Fully Paid'
    }
  },

  // 3rd Grade (3ème - BEPC)
  {
    id: 'ES-2026-00301',
    firstName: 'Aristide Moïse',
    lastName: 'Loubaki',
    gender: 'Male',
    dateOfBirth: '2011-11-14',
    placeOfBirth: 'Dolisie',
    cycleId: 'lower_secondary',
    levelId: 'sec_3rd',
    classId: 'cls_3a',
    status: 'Enrolled',
    enrollmentType: 'Re-enrollment',
    academicYear: '2026-2027',
    registrationDate: '2026-08-12',
    siblings: [],
    guardians: {
      father: { name: 'Pascal Loubaki', phone: '+242 06 612 89 00', profession: 'Merchant', email: 'p.loubaki@yahoo.fr' },
      mother: { name: 'Solange Loubaki', phone: '+242 05 677 34 12', profession: 'Pharmacist', email: '' }
    },
    feeStatus: {
      totalDue: 355000, // 25k reenroll + 315k tuition + 15k BEPC exam fee
      paid: 120000,
      balance: 235000,
      paymentStatus: 'Partial'
    }
  },
  {
    id: 'ES-2026-00302',
    firstName: 'Bernice Sarah',
    lastName: 'Ngatsé',
    gender: 'Female',
    dateOfBirth: '2011-03-29',
    placeOfBirth: 'Brazzaville',
    cycleId: 'lower_secondary',
    levelId: 'sec_3rd',
    classId: 'cls_3a',
    status: 'Enrolled',
    enrollmentType: 'Re-enrollment',
    academicYear: '2026-2027',
    registrationDate: '2026-08-05',
    siblings: [],
    guardians: {
      father: { name: 'Jean-Pierre Ngatsé', phone: '+242 06 555 12 34', profession: 'Lawyer', email: 'jp.ngatse@barreau.cg' },
      mother: { name: 'Valérie Ngatsé', phone: '+242 05 522 88 99', profession: 'Civil Servant', email: '' }
    },
    feeStatus: {
      totalDue: 355000,
      paid: 355000,
      balance: 0,
      paymentStatus: 'Fully Paid'
    }
  },

  // Terminale C (Baccalauréat Track C - Sciences)
  {
    id: 'ES-2026-00401',
    firstName: 'Rodrigue Kevin',
    lastName: 'Mpemba',
    gender: 'Male',
    dateOfBirth: '2008-06-19',
    placeOfBirth: 'Brazzaville',
    cycleId: 'upper_secondary',
    levelId: 'sec_tle',
    trackId: 'track_c',
    classId: 'cls_tle_c',
    status: 'Enrolled',
    enrollmentType: 'Re-enrollment',
    academicYear: '2026-2027',
    registrationDate: '2026-08-02',
    siblings: [],
    guardians: {
      father: { name: 'Florent Mpemba', phone: '+242 06 900 87 65', profession: 'Telecommunications Director', email: 'f.mpemba@telecom.cg' },
      mother: { name: 'Denise Mpemba', phone: '+242 05 611 44 22', profession: 'Executive Assistant', email: '' }
    },
    feeStatus: {
      totalDue: 460000, // 30k reenroll + 405k tuition + 25k Bac exam fee
      paid: 460000,
      balance: 0,
      paymentStatus: 'Fully Paid'
    }
  },
  {
    id: 'ES-2026-00402',
    firstName: 'Florence Aurelie',
    lastName: 'Nkouka',
    gender: 'Female',
    dateOfBirth: '2008-10-08',
    placeOfBirth: 'Brazzaville',
    cycleId: 'upper_secondary',
    levelId: 'sec_tle',
    trackId: 'track_c',
    classId: 'cls_tle_c',
    status: 'Enrolled',
    enrollmentType: 'Re-enrollment',
    academicYear: '2026-2027',
    registrationDate: '2026-08-08',
    siblings: [],
    guardians: {
      father: { name: 'Gilbert Nkouka', phone: '+242 06 444 33 22', profession: 'Architect', email: 'g.nkouka@archi.cg' },
      mother: { name: 'Agathe Nkouka', phone: '+242 05 888 11 00', profession: 'Merchant', email: '' }
    },
    feeStatus: {
      totalDue: 460000,
      paid: 200000,
      balance: 260000,
      paymentStatus: 'Partial'
    }
  },

  // Terminale A (Baccalauréat Track A - Arts/Humanities)
  {
    id: 'ES-2026-00501',
    firstName: 'Chancel Davy',
    lastName: 'Bakala',
    gender: 'Male',
    dateOfBirth: '2008-01-30',
    placeOfBirth: 'Kinkala',
    cycleId: 'upper_secondary',
    levelId: 'sec_tle',
    trackId: 'track_a',
    classId: 'cls_tle_a',
    status: 'Enrolled',
    enrollmentType: 'New Enrollment',
    academicYear: '2026-2027',
    registrationDate: '2026-08-20',
    siblings: [],
    guardians: {
      father: { name: 'Médard Bakala', phone: '+242 06 701 99 22', profession: 'Customs Officer', email: 'm.bakala@douanes.cg' },
      mother: { name: 'Gisèle Bakala', phone: '+242 05 533 11 77', profession: 'Businesswoman', email: '' }
    },
    feeStatus: {
      totalDue: 475000, // 45k new enroll + 405k tuition + 25k Bac exam
      paid: 250000,
      balance: 225000,
      paymentStatus: 'Partial'
    }
  }
];

export const INITIAL_GRADES = [
  // Class 3rd Grade A (3ème A) - Term 1
  {
    id: 'grd_3a_math_1',
    studentId: 'ES-2026-00301',
    classId: 'cls_3a',
    subjectId: 'subj_math',
    term: 'Term 1',
    academicYear: '2026-2027',
    caScore: 14.5,
    examScore: 13.0,
    average: 13.6, // (14.5*0.4)+(13.0*0.6) = 5.8 + 7.8 = 13.6
    teacherComment: 'Good analytical potential, keep practicing algebra problems.'
  },
  {
    id: 'grd_3a_math_2',
    studentId: 'ES-2026-00302',
    classId: 'cls_3a',
    subjectId: 'subj_math',
    term: 'Term 1',
    academicYear: '2026-2027',
    caScore: 18.0,
    examScore: 17.5,
    average: 17.7,
    teacherComment: 'Excellent mastery of geometric proofs and problem solving.'
  },
  {
    id: 'grd_3a_fran_1',
    studentId: 'ES-2026-00301',
    classId: 'cls_3a',
    subjectId: 'subj_french',
    term: 'Term 1',
    academicYear: '2026-2027',
    caScore: 12.0,
    examScore: 11.5,
    average: 11.7,
    teacherComment: 'Satisfactory. Needs to enrich vocabulary in text commentary.'
  },
  {
    id: 'grd_3a_fran_2',
    studentId: 'ES-2026-00302',
    classId: 'cls_3a',
    subjectId: 'subj_french',
    term: 'Term 1',
    academicYear: '2026-2027',
    caScore: 16.5,
    examScore: 16.0,
    average: 16.2,
    teacherComment: 'Very fluent writing style and acute literary comprehension.'
  },

  // Terminale C (Track C - Sciences) - Term 1
  {
    id: 'grd_tlec_math_1',
    studentId: 'ES-2026-00401',
    classId: 'cls_tle_c',
    subjectId: 'subj_math',
    term: 'Term 1',
    academicYear: '2026-2027',
    caScore: 17.0,
    examScore: 16.5,
    average: 16.7,
    teacherComment: 'Brilliant conceptual reasoning in differential calculus.'
  },
  {
    id: 'grd_tlec_phys_1',
    studentId: 'ES-2026-00401',
    classId: 'cls_tle_c',
    subjectId: 'subj_phys_sci',
    term: 'Term 1',
    academicYear: '2026-2027',
    caScore: 16.0,
    examScore: 15.5,
    average: 15.7,
    teacherComment: 'Very rigorous experimental analysis in mechanics.'
  },
  {
    id: 'grd_tlec_math_2',
    studentId: 'ES-2026-00402',
    classId: 'cls_tle_c',
    subjectId: 'subj_math',
    term: 'Term 1',
    academicYear: '2026-2027',
    caScore: 12.5,
    examScore: 11.0,
    average: 11.6,
    teacherComment: 'Regular effort. Continue deepening trigonometric series.'
  }
];

export const INITIAL_STUDENT_RECEIPTS = [
  {
    id: 'REC-2026-0089',
    studentId: 'ES-2026-00101',
    studentName: 'Junior Paul Mouanda',
    classId: 'cls_cm2',
    className: 'CM2 (Exam Year CEP)',
    academicYear: '2026-2027',
    date: '2026-08-15',
    feeType: 'Annual Tuition & Re-enrollment',
    amount: 245000,
    paymentMethod: 'Cash',
    remainingBalance: 0,
    receivedBy: 'Cécile Bantsimba (Accountant)',
    notes: 'Settled in full for school year 2026-2027'
  },
  {
    id: 'REC-2026-0092',
    studentId: 'ES-2026-00102',
    studentName: 'Grace Syntiche Mouanda',
    classId: 'cls_ce1',
    className: 'CE1',
    academicYear: '2026-2027',
    date: '2026-08-15',
    feeType: '1st Term Tuition + Re-enrollment',
    amount: 150000,
    paymentMethod: 'Cash',
    remainingBalance: 95000,
    receivedBy: 'Cécile Bantsimba (Accountant)',
    notes: 'Partial payment. Balance of 95,000 FCFA due by Dec 15, 2026.'
  },
  {
    id: 'REC-2026-0105',
    studentId: 'ES-2026-00401',
    studentName: 'Rodrigue Kevin Mpemba',
    classId: 'cls_tle_c',
    className: 'Terminale C (Baccalauréat Sciences)',
    academicYear: '2026-2027',
    date: '2026-08-02',
    feeType: 'Full Year Tuition + Bac Exam Fee',
    amount: 460000,
    paymentMethod: 'Bank Transfer',
    referenceNo: 'BGFI-TX-8839201',
    remainingBalance: 0,
    receivedBy: 'Cécile Bantsimba (Accountant)',
    notes: 'BGFI Bank Transfer received and cleared.'
  },
  {
    id: 'REC-2026-0112',
    studentId: 'ES-2026-00201',
    studentName: 'Emmanuel Prince Massamba',
    classId: 'cls_6a',
    className: '6th Grade A (6ème A)',
    academicYear: '2026-2027',
    date: '2026-08-18',
    feeType: 'Enrollment + 1st Installment',
    amount: 200000,
    paymentMethod: 'Cheque',
    referenceNo: 'CHQ-LCB-004128',
    remainingBalance: 150000,
    receivedBy: 'Cécile Bantsimba (Accountant)',
    notes: 'LCB Bank Cheque #004128'
  }
];

export const INITIAL_TEACHER_PAYMENTS = [
  {
    id: 'TPAY-2026-0801',
    teacherId: 'tch_04',
    teacherName: 'Alphonse Ngoma',
    cycle: 'Primary (CP-A Homeroom)',
    period: 'September 2026',
    date: '2026-09-28',
    payType: 'Fixed Monthly Salary',
    grossAmount: 210000,
    deductions: 0,
    netPaid: 210000,
    paymentMethod: 'Bank Transfer',
    processedBy: 'Cécile Bantsimba (Accountant)'
  },
  {
    id: 'TPAY-2026-0802',
    teacherId: 'tch_10',
    teacherName: 'Dieudonné Kouassi',
    cycle: 'Lower & Upper Secondary (Mathematics)',
    period: 'September 2026',
    date: '2026-09-28',
    payType: 'Hourly Workload',
    hourlyRate: 4500,
    weeklyHours: 22,
    monthlyHours: 88, // 22 hrs * 4 weeks
    hoursBreakdown: [
      { class: '6th Grade A', subject: 'Math', hoursPerWeek: 5 },
      { class: '3rd Grade A', subject: 'Math', hoursPerWeek: 5 },
      { class: 'Seconde C', subject: 'Math', hoursPerWeek: 6 },
      { class: 'Terminale C', subject: 'Math', hoursPerWeek: 6 }
    ],
    grossAmount: 396000, // 88 hrs * 4500 FCFA
    deductions: 0,
    netPaid: 396000,
    paymentMethod: 'Bank Transfer',
    processedBy: 'Cécile Bantsimba (Accountant)'
  }
];

// Historical State Examination Pass Rates (2023 - 2026)
export const INITIAL_EXAM_STATISTICS = [
  {
    examCode: 'CEP',
    examName: 'Certificat d\'Études Primaires (CEP)',
    cycle: 'Primary (CM2)',
    years: [
      { year: '2023', candidates: 38, passed: 36, failed: 2, passRate: 94.7 },
      { year: '2024', candidates: 42, passed: 41, failed: 1, passRate: 97.6 },
      { year: '2025', candidates: 40, passed: 40, failed: 0, passRate: 100.0 },
      { year: '2026', candidates: 45, passed: 44, failed: 1, passRate: 97.8 }
    ]
  },
  {
    examCode: 'BEPC',
    examName: 'Brevet d\'Études du Premier Cycle (BEPC)',
    cycle: 'Lower Secondary (3rd Grade / 3ème)',
    years: [
      { year: '2023', candidates: 74, passed: 65, failed: 9, passRate: 87.8 },
      { year: '2024', candidates: 80, passed: 73, failed: 7, passRate: 91.3 },
      { year: '2025', candidates: 86, passed: 80, failed: 6, passRate: 93.0 },
      { year: '2026', candidates: 88, passed: 83, failed: 5, passRate: 94.3 }
    ]
  },
  {
    examCode: 'BAC',
    examName: 'Baccalauréat Général',
    cycle: 'Upper Secondary (Terminale)',
    tracks: [
      {
        trackCode: 'Track A',
        trackName: 'Literature / Humanities',
        years: [
          { year: '2023', candidates: 32, passed: 28, failed: 4, passRate: 87.5 },
          { year: '2024', candidates: 35, passed: 32, failed: 3, passRate: 91.4 },
          { year: '2025', candidates: 38, passed: 36, failed: 2, passRate: 94.7 },
          { year: '2026', candidates: 40, passed: 38, failed: 2, passRate: 95.0 }
        ]
      },
      {
        trackCode: 'Track C',
        trackName: 'Sciences & Mathematics',
        years: [
          { year: '2023', candidates: 28, passed: 25, failed: 3, passRate: 89.3 },
          { year: '2024', candidates: 30, passed: 28, failed: 2, passRate: 93.3 },
          { year: '2025', candidates: 34, passed: 33, failed: 1, passRate: 97.1 },
          { year: '2026', candidates: 35, passed: 34, failed: 1, passRate: 97.1 }
        ]
      }
    ]
  }
];

// Historical Enrollment Trends for Growth Dashboard
export const INITIAL_ENROLLMENT_TRENDS = [
  { year: '2023-2024', preschool: 65, primary: 180, lowerSecondary: 290, upperSecondary: 210, total: 745, capacity: 850, newEnrollees: 220, reEnrollees: 525, retentionRate: 92.5 },
  { year: '2024-2025', preschool: 72, primary: 195, lowerSecondary: 315, upperSecondary: 230, total: 812, capacity: 850, newEnrollees: 245, reEnrollees: 567, retentionRate: 93.8 },
  { year: '2025-2026', preschool: 78, primary: 210, lowerSecondary: 340, upperSecondary: 245, total: 873, capacity: 900, newEnrollees: 260, reEnrollees: 613, retentionRate: 94.6 },
  { year: '2026-2027', preschool: 80, primary: 220, lowerSecondary: 360, upperSecondary: 260, total: 920, capacity: 920, newEnrollees: 275, reEnrollees: 645, retentionRate: 95.2 }
];

export const INITIAL_TIMETABLES = [
  {
    classId: 'cls_3a',
    className: '3rd Grade A (3ème A)',
    schedule: [
      { day: 'Monday', timeSlot: '08:00 - 10:00', subjectId: 'subj_math', subjectName: 'Mathematics', teacherId: 'tch_10', teacherName: 'Dieudonné Kouassi', room: 'Room 205' },
      { day: 'Monday', timeSlot: '10:15 - 12:00', subjectId: 'subj_french', subjectName: 'French', teacherId: 'tch_11', teacherName: 'Antoinette Makosso', room: 'Room 205' },
      { day: 'Monday', timeSlot: '14:00 - 16:00', subjectId: 'subj_phys_sci', subjectName: 'Physical Sciences', teacherId: 'tch_12', teacherName: 'Guy-Roland Tsiba', room: 'Room 205' },
      { day: 'Tuesday', timeSlot: '08:00 - 10:00', subjectId: 'subj_english', subjectName: 'English', teacherId: 'tch_13', teacherName: 'Sylvie Loundou', room: 'Room 205' },
      { day: 'Tuesday', timeSlot: '10:15 - 12:00', subjectId: 'subj_svt', subjectName: 'Life & Earth Sciences (SVT)', teacherId: 'tch_10', teacherName: 'Dieudonné Kouassi', room: 'Room 205' },
      { day: 'Wednesday', timeSlot: '08:00 - 11:00', subjectId: 'subj_math', subjectName: 'Mathematics', teacherId: 'tch_10', teacherName: 'Dieudonné Kouassi', room: 'Room 205' },
      { day: 'Thursday', timeSlot: '08:00 - 10:00', subjectId: 'subj_french', subjectName: 'French', teacherId: 'tch_11', teacherName: 'Antoinette Makosso', room: 'Room 205' },
      { day: 'Friday', timeSlot: '08:00 - 10:00', subjectId: 'subj_hist_geo', subjectName: 'History & Geography', teacherId: 'tch_11', teacherName: 'Antoinette Makosso', room: 'Room 205' },
      { day: 'Friday', timeSlot: '15:00 - 17:00', subjectId: 'subj_pe', subjectName: 'Physical Education (EPS)', teacherId: 'tch_12', teacherName: 'Guy-Roland Tsiba', room: 'Sports Complex' }
    ]
  }
];
