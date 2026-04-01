# Finance Data Processing and Access Control Backend

I have successfully built the complete backend for the Finance Dashboard based on the implementation plan. The system architecture is fully set up, including real-time validation, authentication, and role-based access control.

## Highlights of Implementation

### 1. Robust Architecture
- A well-organized MVC structure using Node.js and Express. Mongoose models are placed in `models/`, business logic inside `controllers/`, and routing in `routes/`.
- Cross-origin requests (CORS), environment variables (`.env`), and proper RESTful principles are all utilized.

### 2. User & Role Management Features
- **Registration and Login**: Endpoints added to sign up users and generate secure JSON Web Tokens (JWT).
- **Role-Based Access Control (RBAC)**: Implemented an `authorize()` middleware array that dynamically checks user roles (`Admin`, `Analyst`, `Viewer`).
- **Super User Powers**: Only Admins can list all users and modify user roles or their active status, enhancing security.

### 3. Financial Records Management
- **CRUD Operations**: Support for creating, reading, updating, and deleting records. Filter records efficiently by `amount`, `category`, and `date`.
- **Validation constraints**: `express-validator` middleware intercepts invalid requests before accessing the database. Mongoose models also carry schema-level constraints to prevent malformed data insertion.
- **Resource Ownership Authorization**: Users (Analytics) can only update their own created records unless they are an `Admin`. Viewers inherently cannot edit any data.

### 4. Interactive Aggregations for Dashboard
- Provides lightning-fast aggregation endpoints leveraging MongoDB pipeline operations to retrieve Net Balance, Totals by type, and grouped totals by category.

### 5. Seamless Error Handling
- Developed a global error handling middleware `error.middleware.js` to intelligently parse Mongoose schema errors (like validation or duplicate field constraints) and return user-friendly, standardized JSON responses.

---

## Testing & Executing

> [!TIP]
> I have included a testing payload file to streamline your evaluation.

If you have the **REST Client** extension installed in VS Code, open the newly created `requests.http` file. It contains ready-to-use API calls to test all the endpoints!

1. Update the `MONGODB_URI` inside your `.env` file to point to your database.
2. Ensure you have installed standard packages via `npm install` (this was already triggered).
3. Start up the backend API by running:
```bash
npm run dev
```
4. Hop into `requests.http` and click the "Send Request" buttons hovering above the `POST` / `GET` declarations!
