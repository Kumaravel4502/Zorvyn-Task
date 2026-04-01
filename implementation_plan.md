# Finance Data Processing and Access Control Backend

This document outlines the implementation plan for the backend system of a finance dashboard using Node.js, Express, and MongoDB. The system will support user management, role-based access control, financial record management, and dashboard summary analytics.

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
- Leverage MongoDB aggregation pipeline to compute summary statistics efficiently.
- **Endpoints:**
  - `GET /api/dashboard/summary` (Admin, Analyst, Viewer) - Returns:
    - Total Income & Total Expenses
    - Net Balance
    - Category-wise Totals
    - Recent Activity (Last N records)

### Phase 5: Validation, Error Handling, and enhancements
- Add input validation using `express-validator` for all incoming requests (e.g., checking for valid email, required fields, numeric amount).
- Implement a global centralized error handling middleware to gracefully return helpful error messages and appropriate HTTP status codes.
- Add generic rate-limiting (`express-rate-limit`) to prevent abuse.

## User Action Required

> [!IMPORTANT]
> **Database Requirement:** You will need a MongoDB instance running locally or a MongoDB Atlas cluster URI to test the application. If you prefer, I can set up an in-memory MongoDB using `mongodb-memory-server` for a fully self-contained local testing experience without any external setup. Which would you prefer?

## Open Questions

1. Do you want to use a local MongoDB instance, an external MongoDB URI (like MongoDB Atlas), or an in-memory MongoDB (`mongodb-memory-server`) for easier local development while evaluating?
2. Do you have any specific preferences for the categories of transactions (e.g., Salary, Rent, Food, Utilities)? Otherwise, I'll allow free text or a generic predefined list.
3. Would you like a basic Postman collection or a `requests.http` file (for VS Code REST Client) included in the project for easy testing of the APIs?

## Verification Plan
1. Ensure all `npm` packages install correctly and the server starts.
2. Verify that JWT authentication works correctly (signup, login, accessing protected routes).
3. Test Role-Based Access Control (RBAC): Admin can do everything, Analyst can read/write data but not manage users, Viewer can only read.
4. Verify CRUD operations on Financial Records.
5. Check if dashboard aggregation returns correct sums and grouping.
6. Verify error handling catches validation issues and missing constraints.
