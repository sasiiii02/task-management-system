# Mini Task Management System

A full-stack task management application built with Next.js and Spring Boot.

---

## Project Overview

Users can register, log in, and manage their tasks. Admins can view and manage all tasks and users in the system.

**Tech Stack**
- Frontend: Next.js (Pages Router), Tailwind CSS, Axios
- Backend: Spring Boot, Spring Security, JWT, Spring Data JPA
- Database: MySQL

---

## Folder Structure
```
/
├── taskmanager/          # Spring Boot backend
└── task-manager-frontend/ # Next.js frontend
```

---

## Environment Variables

### Backend — `application.properties`

| Key | Description |
|-----|-------------|
| `spring.datasource.url` | MySQL connection URL |
| `spring.datasource.username` | Database username |
| `spring.datasource.password` | Database password |
| `jwt.secret` | Secret key for JWT signing (min 32 chars) |
| `jwt.expiration` | Token expiry in ms (e.g. 86400000 = 24h) |

### Frontend — `.env.local`

| Key | Description |
|-----|-------------|
| `NEXT_PUBLIC_API_URL` | Backend base URL (e.g. http://localhost:8080) |

---

## Database Configuration

1. Install MySQL and create a database:
```sql
CREATE DATABASE taskdb;
```
2. Update `application.properties` with your credentials.
3. Tables are created automatically on first run (`ddl-auto=update`).

---

## Database Schema
```sql
CREATE TABLE users (
  id       BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50)  NOT NULL UNIQUE,
  email    VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role     VARCHAR(20)  NOT NULL
);

CREATE TABLE tasks (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description VARCHAR(1000),
  status      VARCHAR(20)  NOT NULL,
  priority    VARCHAR(20)  NOT NULL,
  due_date    DATE,
  created_at  DATETIME,
  updated_at  DATETIME,
  user_id     BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Setup & Run Instructions

### Prerequisites
- Java 17
- Node.js 18+
- MySQL 8

### Backend
```bash
cd taskmanager
# Edit src/main/resources/application.properties with your DB credentials
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### Frontend
```bash
cd task-manager-frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:8080
npm run dev
# Runs on http://localhost:3000
```

### Create Admin User

After running the backend once (so tables are created), run this SQL:
```sql
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkIoT6BXyVE', 'ADMIN');
-- Password is: admin123
```

---

## API Documentation

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login, returns JWT |

### Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | USER | Get own tasks (paginated) |
| POST | `/api/tasks` | USER | Create task |
| GET | `/api/tasks/{id}` | USER | Get task by ID |
| PUT | `/api/tasks/{id}` | USER | Update task |
| DELETE | `/api/tasks/{id}` | USER | Delete task |
| PATCH | `/api/tasks/{id}/complete` | USER | Mark as completed |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/tasks` | ADMIN | Get all tasks |
| GET | `/api/admin/users` | ADMIN | Get all users |

### Query Parameters (GET /api/tasks)

| Param | Values | Default |
|-------|--------|---------|
| `page` | number | 0 |
| `size` | number | 10 |
| `sortBy` | `dueDate`, `priority` | `dueDate` |
| `sortDir` | `asc`, `desc` | `asc` |
| `status` | `TODO`, `IN_PROGRESS`, `DONE` | — |
| `priority` | `LOW`, `MEDIUM`, `HIGH` | — |
