# SCOLARIS — Comprehensive School Management Solution

**SCOLARIS** is an internal school management platform designed for the administration and leadership of a Congolese school complex covering **Preschool, Primary, Lower Secondary, and Upper Secondary** education, in full adherence to the 2026 Congolese educational reform framework.

---

## 🌟 Key Functional Features

1. **100% English User Interface**: Professional, clean UI with all navigation, dialogues, tables, charts, report cards, ID badges, and payment receipts rendered in clear English.
2. **Students Module & Admissions**:
   - **Student Record**: Identity, auto ID generation (`ES-YYYY-XXXXX`), guardians (Father, Mother, Emergency), sibling linking for family billing, cycle, class, and track.
   - **New Enrollment**: Multi-step registration with real-time classroom capacity check and automatic fee invoice generation.
   - **Rapid Re-enrollment**: Instant search by ID/name, automatic promotion recommendation to next grade level, retaining original ID while issuing a new year's ID card.
3. **School ID Cards with Embedded Security QR Codes**:
   - Dynamic QR codes with cryptographic verification hash.
   - Printable in high-contrast Black & White (optimized for standard office laser printers) or Full Color badge.
   - Interactive **QR Code Verifier Scanner** dialog to verify credential authenticity.
   - Batch class printing.
   - Card reissue history and audit tracking.
4. **Teachers & Dual Payroll Engine**:
   - **Preschool & Primary**: Fixed monthly salary independent of specific hour breakdowns.
   - **Lower & Upper Secondary**: Strictly Hourly pay (`Hours Worked × Agreed Rate`) with zero lump sums.
   - **Workload Assignments**: Multi-class and multi-subject weekly allocation.
   - **Certified Hours Statement**: Official printable A4 statement for evidence in multi-institution work and pay settlements.
   - **Pay Slips**: Instant printable monthly remuneration vouchers.
5. **Teacher Grade Records & Official Report Cards**:
   - **Excel-style Spreadsheet Grade Entry Grid**: Rapid keyboard entry of Continuous Assessment (CA) and Exam marks with instant weighted average calculations.
   - **Multi-Cycle Report Cards**: Full calculations of overall weighted averages, class ranking (1st, 2nd, 3rd...), class min/max/mean, teacher comments, and principal decisions.
   - Single & batch printable A4 layouts.
6. **Timetable System**:
   - Weekly schedules by Class and by Teacher.
   - Interactive timetable slot editor.
7. **Accounting & Cashier Desk**:
   - Immediate desk collection in FCFA (Cash, Bank Transfer, Cheque — zero Mobile Money).
   - Instant printable payment receipts (`REC-YYYY-XXXX`).
   - Payment archives with multi-filter search and CSV export.
   - Outstanding balances and delinquency roster by class.
   - Consolidated financial cashflow summary (Tuition Revenue vs Teacher Payroll).
8. **School Growth & Trends Analytics**:
   - **Headcount vs Classroom Capacity**: Occupancy rates with visual saturation alerts ($\ge 95\%$).
   - **Admissions & Retention**: New vs Returning students, 6th-grade intake dynamics, and YoY retention rate.
   - **National State Exam Pass Rates**: Multi-year pass rate tracking for **CEP**, **BEPC**, and **Baccalauréat** (by Track A and C) with manual entry for new MEPPSA publications.
   - **Printable Executive Briefing**: One-click Board of Directors summary.
9. **Dynamic Academic Setup ("Nothing Hard-Coded")**:
   - Add/edit Specialization Tracks (Track A, C, D, E, G, etc.) and custom subject coefficient matrices.
   - Add/edit Subjects with custom CA vs Exam grading ratios.
   - Manage classrooms, rooms, and max seat capacities.
   - Manage annual and termly fee schedules per cycle.
   - Offline USB backup export and restore (`.json`).
10. **Role-Based Access Control (RBAC)**:
    - Switch seamlessly between **Principal**, **Secretary**, **Accountant**, and **Teacher** perspectives via the top navbar.

---

## 🚀 Quick Start Instructions

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

The application runs locally on `http://localhost:3000` with zero external internet dependencies and full local state persistence.
