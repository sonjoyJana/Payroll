# Payroll Management System

A full-stack MERN (MongoDB, Express, React, Node.js) payroll management application built for a single company with Indian context — ₹ currency, Indian employee names, 10-digit phone numbers, and bank details. Supports role-based access for admin/HR and employees.

---

## Project Structure

```
Payroll/
├── server/                          # Backend (Express + MongoDB)
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Login, register, profile
│   │   ├── employeeController.js    # CRUD employees + auto-create User
│   │   ├── attendanceController.js  # Mark/list attendance with filters
│   │   ├── leaveController.js       # Apply/approve/reject leaves
│   │   └── payrollController.js     # Generate payroll, dashboard stats
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT protect + adminOnly guards
│   ├── models/
│   │   ├── User.js                  # Login accounts (bcrypt passwords)
│   │   ├── Employee.js              # Employee master data + bank details
│   │   ├── Attendance.js            # Daily attendance records
│   │   ├── Leave.js                 # Leave requests
│   │   └── Payroll.js               # Monthly salary records
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth
│   │   ├── employeeRoutes.js        # /api/employees
│   │   ├── attendanceRoutes.js      # /api/attendance
│   │   ├── leaveRoutes.js           # /api/leaves
│   │   └── payrollRoutes.js         # /api/payroll
│   ├── seed.js                      # Seed admin user
│   ├── seed-employees.js            # Seed 10 Indian employees
│   ├── reset-admin.js               # Reset admin credentials
│   ├── server.js                    # Express entry point
│   └── .env                         # MONGO_URI, JWT_SECRET, PORT
│
├── client/                          # Frontend (React + Axios)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js            # Role-based navigation
│   │   │   ├── PrivateRoute.js      # Auth guard (redirects to /login)
│   │   │   └── SearchableSelect.js  # Type+select employee dropdown
│   │   ├── context/
│   │   │   └── AuthContext.js       # Auth state, login/logout
│   │   ├── pages/
│   │   │   ├── LoginPage.js         # Light blue gradient login
│   │   │   ├── DashboardPage.js     # Admin dashboard + On Leave Today
│   │   │   ├── EmployeePage.js      # Employee CRUD + deactivate/reactivate
│   │   │   ├── AttendancePage.js    # Mark attendance with SearchableSelect
│   │   │   ├── LeavePage.js         # Admin: approve/reject leaves
│   │   │   ├── PayrollPage.js       # Generate payroll + payslip modal
│   │   │   ├── EmployeeDashboard.js # Employee's own stats
│   │   │   ├── EmployeeAttendance.js# Employee views own attendance
│   │   │   ├── EmployeeLeave.js     # Employee applies for leave
│   │   │   └── EmployeePayslips.js  # Employee views own payslips
│   │   ├── services/
│   │   │   └── api.js               # Axios instance + 401 interceptor
│   │   └── App.js                   # Role-based routing
│   └── package.json                 # Proxy to localhost:5000
│
└── README.md
```

---

## Setup & Run

### Prerequisites
- Node.js
- MongoDB (running on `localhost:27017`)

### Backend
```bash
cd server
npm install
# Edit .env file:
#   MONGO_URI=mongodb://localhost:27017/payroll
#   JWT_SECRET=your_secret_key
#   PORT=5000
npm run seed       # Creates admin user
npm run seed-employees  # Creates 10 employees + their user accounts
npm start          # Starts on port 5000
```

### Frontend
```bash
cd client
npm install
npm start          # Starts on port 3000, proxies /api to port 5000
```

### Login Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@company.com | admin123 |
| Employee | amit.sharma@company.com | password123 |
| Employee | priya.patel@company.com | password123 |
| Employee | rajesh.verma@company.com | password123 |
| Employee | ananya.singh@company.com | password123 |
| Employee | vikram.joshi@company.com | password123 |
| Employee | neha.gupta@company.com | password123 |
| Employee | arjun.reddy@company.com | password123 |
| Employee | kavita.nair@company.com | password123 |
| Employee | deepak.m@company.com | password123 |
| Employee | sneha.desai@company.com | password123 |

---

## How It Works

### Authentication & Authorization

The system uses JWT (JSON Web Tokens) for authentication. When a user logs in via `POST /api/auth/login`, the server verifies the email and bcrypt-hashed password, then returns a JWT token along with user data (name, email, role, and linked employee if applicable).

The token is stored in `localStorage` and sent as `Authorization: Bearer <token>` on every API request via an Axios request interceptor. A response interceptor catches 401 errors and auto-redirects to `/login`.

Two middleware guards protect routes:
- **`protect`** — Verifies the JWT and attaches `req.user` (the full User document minus password). Required on all authenticated routes.
- **`adminOnly`** — Checks if `req.user.role` is `admin` or `hr`. Returns 403 if not. Used on write operations (create/update/delete employees, mark attendance, approve leaves, generate/manage payroll).

### Role-Based Routing

`App.js` reads `user.role` from AuthContext and renders either `AdminRoutes` or `EmployeeRoutes`:

| Admin Routes (`admin`) | Employee Routes (`employee`) |
|---|---|
| `/` → DashboardPage | `/` → EmployeeDashboard |
| `/employees` → EmployeePage | `/attendance` → EmployeeAttendance |
| `/attendance` → AttendancePage | `/leaves` → EmployeeLeave |
| `/leaves` → LeavePage | `/payslips` → EmployeePayslips |
| `/payroll` → PayrollPage | |

The Navbar also adapts based on role — admin sees Dashboard, Employees, Attendance, Leaves, Payroll; employee sees My Dashboard, My Attendance, My Leaves, My Payslips.

### Models & Data Flow

**User** — Login account with bcrypt-hashed password. Has a `role` field (`admin`, `hr`, or `employee`). If the user is an employee, `employeeId` references the linked Employee document.

**Employee** — Master data record containing personal info (name, email, phone, address), work info (department, position, salary, employeeId like EMP001), bank details (bankName, accountNumber, ifscCode), and status (`active`/`inactive`). Creating an employee via the admin panel automatically creates a corresponding User account with password `password123`.

**Attendance** — Daily attendance record linked to an employee. Status values: `present`, `absent`, `leave`, `half-day`, `late`. A unique compound index on `(employee, date)` prevents duplicate entries. The admin marks attendance using a SearchableSelect dropdown. Employees can only view their own records.

**Leave** — Leave request submitted by an employee. Statuses: `pending` → `approved` or `rejected`. The admin approves/rejects from the LeavePage. When approved, `approvedBy` records the admin's user ID.

**Payroll** — Monthly salary record generated by admin. Payroll calculation:
1. Gets the employee's monthly salary
2. Queries all attendance records for that month
3. `totalPresent = full present days + half-days × 0.5`
4. `allowances = ₹2000` (flat)
5. `deductions = absent days × (salary / total days) × 50%`
6. `tax = salary × 5%` (flat)
7. `netSalary = salary + allowances - deductions - tax`
8. Statuses: `pending` → `processed` → `paid`

### Dashboard & On Leave Today

**Admin Dashboard** (`GET /api/payroll/dashboard`) returns:
- Total active employees
- Employees present today
- Pending leave requests count
- Current month payroll total (MongoDB aggregation)
- 5 most recent payroll records

The **"On Leave Today"** sidebar queries `GET /api/attendance?date=today&status=leave` and displays employee names and dates in blue cards.

**Employee Dashboard** shows personal stats: total attendance records, present days count, pending leaves, and last month's net salary. Also shows the 5 most recent attendance and leave records.

### Key Components

**SearchableSelect** — A combobox component that renders a text input. As the user types, it filters the employee list by first + last name. Supports keyboard navigation (arrows + enter), click-to-select, and click-outside-to-close. Used in AttendancePage and PayrollPage for employee selection.

**Payslip Modal** — Used in both PayrollPage (admin) and EmployeePayslips (employee). Shows a formatted payslip with company header, employee details (name, department, position), period, and a breakdown table: Basic Salary + Allowances − Deductions − Tax = Net Salary. Also shows working days and present days.

**PrivateRoute** — Wraps authenticated routes. If no user is found in AuthContext, redirects to `/login`. Shows a "Loading..." spinner while auth state is being determined.

### Employee Deactivation

Employees are never deleted from the database. Instead, their `status` field is set to `inactive`. This preserves referential integrity for attendance, leave, and payroll records. Inactive employees appear in a separate table with a "Reactivate" button that sets their status back to `active`.

### API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/auth/profile` | Any user | Get current user profile |
| POST | `/api/auth/login` | Public | Login, returns JWT + user data |
| POST | `/api/auth/register` | Public | Register new user |
| GET | `/api/employees` | Any user | List all employees |
| GET | `/api/employees/:id` | Any user | Get single employee |
| POST | `/api/employees` | Admin/HR | Create employee + auto-create User |
| PUT | `/api/employees/:id` | Admin/HR | Update employee (deactivate/reactivate) |
| DELETE | `/api/employees/:id` | Admin/HR | Delete employee + linked User |
| GET | `/api/attendance` | Any user | List attendance (filters: employeeId, date, status) |
| POST | `/api/attendance` | Admin/HR | Mark attendance |
| PUT | `/api/attendance/:id` | Admin/HR | Update attendance record |
| GET | `/api/leaves` | Any user | List leaves (filters: employeeId, status) |
| POST | `/api/leaves` | Any user | Apply for leave |
| PUT | `/api/leaves/:id` | Admin/HR | Approve or reject leave |
| GET | `/api/payroll` | Any user | List payrolls (filters: employeeId, month, year) |
| POST | `/api/payroll` | Admin/HR | Generate payroll for an employee |
| PUT | `/api/payroll/:id` | Admin/HR | Update payroll status (process/pay) |
| GET | `/api/payroll/dashboard` | Any user | Get aggregate dashboard stats |

### Seed Data

The **admin user** has `role: admin` and full access to all features.

The **10 seeded employees** cover departments: Engineering, Marketing, Finance, HR, Sales. Each has:
- Indian name (e.g., Amit Sharma, Priya Patel)
- Indian bank details (SBI, HDFC, ICICI, Axis, Bank of Baroda)
- Indian city address (Mumbai, Bangalore, Delhi, Kolkata, Chennai, Pune, Hyderabad)
- 10-digit phone number starting with 9876543210-9876543219
- Auto-created User account with `password123`
- Employee IDs EMP001 through EMP010
