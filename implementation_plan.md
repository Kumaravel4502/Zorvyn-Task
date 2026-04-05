## Proposed System Architecture

The project will follow a standard MVC (Model-View-Controller) pattern adapted for a REST API.

**Tech Stack:**

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator

**Directory Structure:**

```
.
├── config/        # Database and configuration files
├── controllers/   # Request handlers (Business logic)
├── middlewares/   # Custom middlewares (Auth, Role check, Error handling)
├── models/        # Mongoose schemas
├── routes/        # API route definitions
├── utils/         # Helper functions
├── .env           # Environment variables
├── index.js       # Entry point of the application
└── package.json
```

## Implementation Phases

### Phase 1: Project Setup and Configuration

- Initialize a Node.js project.
- Install dependencies (`express`, `mongoose`, `dotenv`, `cors`, `jsonwebtoken`, `bcrypt`, `express-validator`).
- Setup an Express server.
- Connect to MongoDB using a configurable URI.

### Phase 2: User and Role Management (Authentication & Authorization)

- **Model:** Create a `User` model with fields: `username`, `email`, `password` (hashed), `role` (Viewer, Analyst, Admin), `status` (active, inactive).
- **Authentication:** Implement `register` and `login` endpoints to issue JWTs.
- **Middlewares:**
  - `authenticate`: Verify JWT token and attach user to request.
  - `authorizeRoles('Admin', 'Analyst', etc.)`: Restrict access based on user role.
- **Endpoints:**
  - `POST /api/auth/register` (Public)
  - `POST /api/auth/login` (Public)
  - `GET /api/users` (Admin) - List all users
  - `PUT /api/users/:id/role` (Admin) - Update user role
  - `PUT /api/users/:id/status` (Admin) - Activate/Deactivate user

### Phase 3: Financial Records Management

- **Model:** Create a `Record` model with fields: `amount`, `type` (income, expense), `category`, `date`, `notes`, and a reference to the `createdBy` user.
- **Endpoints:**
  - `POST /api/records` (Admin, Analyst) - Create a new record
  - `GET /api/records` (Admin, Analyst, Viewer) - Get records with support for filtering (date, category, type), pagination, and search
  - `GET /api/records/:id` (Admin, Analyst, Viewer) - Get a specific record
  - `PUT /api/records/:id` (Admin, Analyst) - Update a record
  - `DELETE /api/records/:id` (Admin) - Soft delete or permanent delete a record

### Phase 4: Dashboard Summary APIs
 - **Endpoints:**
  - `GET /api/dashboard/summary` (Admin, Analyst, Viewer) - Returns:
    - Total Income & Total Expenses
    - Net Balance
    - Category-wise Totals
    - Recent Activity (Last N records)
