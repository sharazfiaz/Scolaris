// Congolese Education System Reference Framework (2026 Reform Framework)
// Fully configurable - No hard-coded restrictions

export const DEFAULT_CYCLES = [
  {
    id: 'preschool',
    name: 'Preschool',
    description: '3-year early childhood cycle (3rd year mandatory)',
    durationYears: 3,
    assessmentType: 'Continuous Evaluation / Motor & Social Skills',
    levels: [
      { id: 'ps_lower', code: 'PS-1', name: 'Lower Section (Petite Section)', order: 1 },
      { id: 'ps_middle', code: 'PS-2', name: 'Middle Section (Moyenne Section)', order: 2 },
      { id: 'ps_upper', code: 'PS-3', name: 'Upper Section (Grande Section)', order: 3 },
    ]
  },
  {
    id: 'primary',
    name: 'Primary Education',
    description: '5-year foundational cycle leading to the Primary School Certificate (CEP)',
    durationYears: 5,
    assessmentType: 'CEP (Certificat d\'Études Primaires - Assessed via CM2 continuous evaluation)',
    diplomaName: 'CEP (Primary School Certificate)',
    levels: [
      { id: 'pri_cp', code: 'CP', name: 'Preparatory Course (CP - Unified)', order: 1 },
      { id: 'pri_ce1', code: 'CE1', name: 'Elementary Course 1 (CE1)', order: 2 },
      { id: 'pri_ce2', code: 'CE2', name: 'Elementary Course 2 (CE2)', order: 3 },
      { id: 'pri_cm1', code: 'CM1', name: 'Middle Course 1 (CM1)', order: 4 },
      { id: 'pri_cm2', code: 'CM2', name: 'Middle Course 2 (CM2)', order: 5 },
    ]
  },
  {
    id: 'lower_secondary',
    name: 'Lower Secondary (1st Cycle)',
    description: '4-year general secondary cycle leading to the BEPC state diploma',
    durationYears: 4,
    assessmentType: 'BEPC (Brevet d\'Études du Premier Cycle)',
    diplomaName: 'BEPC (Lower Secondary Diploma)',
    levels: [
      { id: 'sec_6th', code: '6th', name: '6th Grade (6ème)', order: 1 },
      { id: 'sec_5th', code: '5th', name: '5th Grade (5ème)', order: 2 },
      { id: 'sec_4th', code: '4th', name: '4th Grade (4ème)', order: 3 },
      { id: 'sec_3rd', code: '3rd', name: '3rd Grade (3ème)', order: 4 },
    ]
  },
  {
    id: 'upper_secondary',
    name: 'Upper Secondary (2nd Cycle)',
    description: '3-year specialized secondary cycle leading to the Baccalauréat by track',
    durationYears: 3,
    assessmentType: 'Baccalauréat (State Diploma by Track)',
    diplomaName: 'Baccalauréat',
    hasTracks: true,
    levels: [
      { id: 'sec_2nde', code: '2nde', name: 'Seconde (10th Grade)', order: 1 },
      { id: 'sec_1ere', code: '1ère', name: 'Première (11th Grade)', order: 2 },
      { id: 'sec_tle', code: 'Tle', name: 'Terminale (12th Grade - Exam Year)', order: 3 },
    ]
  }
];

export const DEFAULT_TRACKS = [
  {
    id: 'track_a',
    code: 'Track A',
    name: 'Literature, Languages & Humanities (Série A)',
    cycleId: 'upper_secondary',
    description: 'Specialization in French, Philosophy, History-Geography, and Foreign Languages (English, Spanish/German).',
    subjectWeights: {
      'subj_french': 4,
      'subj_philo': 4,
      'subj_hist_geo': 3,
      'subj_english': 3,
      'subj_spanish': 3,
      'subj_math': 2,
      'subj_pe': 1,
      'subj_civics': 1
    }
  },
  {
    id: 'track_c',
    code: 'Track C',
    name: 'Mathematics & Physical Sciences (Série C)',
    cycleId: 'upper_secondary',
    description: 'Advanced mathematics, physics, and chemistry specialization.',
    subjectWeights: {
      'subj_math': 5,
      'subj_phys_sci': 5,
      'subj_svt': 3,
      'subj_french': 2,
      'subj_philo': 2,
      'subj_english': 2,
      'subj_hist_geo': 2,
      'subj_pe': 1
    }
  },
  {
    id: 'track_d',
    code: 'Track D',
    name: 'Life & Earth Sciences / Biology (Série D)',
    cycleId: 'upper_secondary',
    description: 'Specialization focusing on biological, earth, and environmental sciences.',
    subjectWeights: {
      'subj_svt': 5,
      'subj_math': 4,
      'subj_phys_sci': 4,
      'subj_french': 2,
      'subj_philo': 2,
      'subj_english': 2,
      'subj_hist_geo': 2,
      'subj_pe': 1
    }
  }
];

export const DEFAULT_SUBJECTS = [
  // Secondary Subjects
  { id: 'subj_math', code: 'MATH', name: 'Mathematics', defaultWeight: 4, caWeight: 40, examWeight: 60, applicableCycles: ['lower_secondary', 'upper_secondary'] },
  { id: 'subj_french', code: 'FRAN', name: 'French Language & Literature', defaultWeight: 4, caWeight: 40, examWeight: 60, applicableCycles: ['lower_secondary', 'upper_secondary'] },
  { id: 'subj_english', code: 'ENGL', name: 'English Language', defaultWeight: 3, caWeight: 40, examWeight: 60, applicableCycles: ['lower_secondary', 'upper_secondary'] },
  { id: 'subj_hist_geo', code: 'HIST-GEO', name: 'History & Geography', defaultWeight: 3, caWeight: 40, examWeight: 60, applicableCycles: ['lower_secondary', 'upper_secondary'] },
  { id: 'subj_phys_sci', code: 'PHYS-CHEM', name: 'Physical Sciences & Chemistry', defaultWeight: 3, caWeight: 40, examWeight: 60, applicableCycles: ['lower_secondary', 'upper_secondary'] },
  { id: 'subj_svt', code: 'SVT', name: 'Life & Earth Sciences (SVT)', defaultWeight: 3, caWeight: 40, examWeight: 60, applicableCycles: ['lower_secondary', 'upper_secondary'] },
  { id: 'subj_philo', code: 'PHIL', name: 'Philosophy', defaultWeight: 3, caWeight: 40, examWeight: 60, applicableCycles: ['upper_secondary'] },
  { id: 'subj_spanish', code: 'SPAN', name: 'Spanish', defaultWeight: 2, caWeight: 40, examWeight: 60, applicableCycles: ['upper_secondary'] },
  { id: 'subj_civics', code: 'CIVIC', name: 'Civic & Moral Education (ECM)', defaultWeight: 1, caWeight: 40, examWeight: 60, applicableCycles: ['lower_secondary', 'upper_secondary'] },
  { id: 'subj_pe', code: 'EPS', name: 'Physical & Sports Education (EPS)', defaultWeight: 1, caWeight: 40, examWeight: 60, applicableCycles: ['lower_secondary', 'upper_secondary', 'primary'] },

  // Primary Subjects
  { id: 'subj_pri_math', code: 'PRI-MATH', name: 'Mathematics & Mental Calculation', defaultWeight: 3, caWeight: 50, examWeight: 50, applicableCycles: ['primary'] },
  { id: 'subj_pri_french', code: 'PRI-FRAN', name: 'Reading, Writing & French Grammar', defaultWeight: 3, caWeight: 50, examWeight: 50, applicableCycles: ['primary'] },
  { id: 'subj_pri_sci', code: 'PRI-SCI', name: 'Science, Nature & Environment (Eveil)', defaultWeight: 2, caWeight: 50, examWeight: 50, applicableCycles: ['primary'] },
  { id: 'subj_pri_hist', code: 'PRI-HIST', name: 'History & Geography (Local Heritage)', defaultWeight: 2, caWeight: 50, examWeight: 50, applicableCycles: ['primary'] },
  { id: 'subj_pri_civics', code: 'PRI-CIVIC', name: 'Civic & Moral Education', defaultWeight: 1, caWeight: 50, examWeight: 50, applicableCycles: ['primary'] },
  { id: 'subj_pri_art', code: 'PRI-ART', name: 'Artistic & Drawing Activities', defaultWeight: 1, caWeight: 50, examWeight: 50, applicableCycles: ['primary'] },

  // Preschool Activities
  { id: 'subj_ps_lang', code: 'PS-LANG', name: 'Language & Oral Expression', defaultWeight: 1, caWeight: 100, examWeight: 0, applicableCycles: ['preschool'] },
  { id: 'subj_ps_motor', code: 'PS-MOTOR', name: 'Sensory & Motor Skills', defaultWeight: 1, caWeight: 100, examWeight: 0, applicableCycles: ['preschool'] },
  { id: 'subj_ps_math', code: 'PS-MATH', name: 'Early Discovery of Shapes & Numbers', defaultWeight: 1, caWeight: 100, examWeight: 0, applicableCycles: ['preschool'] },
  { id: 'subj_ps_social', code: 'PS-SOCIAL', name: 'Community Living & Autonomy', defaultWeight: 1, caWeight: 100, examWeight: 0, applicableCycles: ['preschool'] }
];

export const DEFAULT_FEE_STRUCTURE = {
  preschool: {
    enrollmentFee: 25000,
    reenrollmentFee: 15000,
    tuitionAnnual: 180000, // 20,000 FCFA / month (9 months)
    tuitionMonthly: 20000,
    tuitionTermly: 60000,
    optionalFees: { insurance: 5000, activityKit: 10000 }
  },
  primary: {
    enrollmentFee: 30000,
    reenrollmentFee: 20000,
    tuitionAnnual: 225000, // 25,000 FCFA / month
    tuitionMonthly: 25000,
    tuitionTermly: 75000,
    optionalFees: { insurance: 5000, libraryFee: 5000, examFeeCEP: 10000 }
  },
  lower_secondary: {
    enrollmentFee: 35000,
    reenrollmentFee: 25000,
    tuitionAnnual: 315000, // 35,000 FCFA / month
    tuitionMonthly: 35000,
    tuitionTermly: 105000,
    optionalFees: { insurance: 5000, labFee: 10000, examFeeBEPC: 15000 }
  },
  upper_secondary: {
    enrollmentFee: 45000,
    reenrollmentFee: 30000,
    tuitionAnnual: 405000, // 45,000 FCFA / month
    tuitionMonthly: 45000,
    tuitionTermly: 135000,
    optionalFees: { insurance: 5000, labFee: 15000, examFeeBac: 25000 }
  }
};
