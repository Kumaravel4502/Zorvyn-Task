# Backend Implementation Tasks

## Phase 1: Setup
- [ ] Initialize Node.js project (`package.json`)
- [ ] Install dependencies (express, mongoose, dotenv, jsonwebtoken, bcrypt, express-validator, cors)
- [ ] Set up basic Express server (`index.js`)
- [ ] Connect to MongoDB (`config/db.js`)

## Phase 2: User & Role Management (Auth)
- [ ] Create `User` model
- [ ] Implement Authentication Controller (Register, Login)
- [ ] Implement Authentication Middleware (`authenticate`)
- [ ] Implement Role Authorization Middleware (`authorizeRoles`)
- [ ] Create User routes

## Phase 3: Financial Records
- [ ] Create `Record` model
- [ ] Implement Records Controller (CRUD operations)
- [ ] Add filtering, pagination, and sorting for records
- [ ] Create Record routes

## Phase 4: Dashboard APIs
- [ ] Implement Dashboard Controller
- [ ] Add MongoDB Aggregation queries for summaries (Totals, Net Balance, Category breakdown, etc.)
- [ ] Create Dashboard routes

## Phase 5: Polish & Validation
- [ ] Add `express-validator` to routes
- [ ] Implement global centralized error handling middleware
- [ ] Final end-to-end local testing
