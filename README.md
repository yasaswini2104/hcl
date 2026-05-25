#  BusBook — Online Bus Booking System

A full-stack bus ticket booking platform built with **Spring Boot** (backend) and **React + Vite** (frontend), featuring JWT-based authentication, role-based access control, real-time seat selection, in-app notifications, and email confirmations.

[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)

---

##  Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Architecture](#-architecture)
5. [Database Schema](#-database-schema)
6. [Documentation](#-documentation)
7. [Project Structure](#-project-structure)
8. [Getting Started](#-getting-started)
9. [API Documentation](#-api-documentation)
10. [Authentication & Authorization](#-authentication--authorization)
11. [Core Business Flows](#-core-business-flows)
12. [Security Implementation](#-security-implementation)
13. [Exception Handling](#-exception-handling)
14. [Testing with Swagger](#-testing-with-swagger)
15. [Screenshots](#-screenshots)
16. [Future Enhancements](#-future-enhancements)
17. [Contributing](#-contributing)
18. [License](#-license)

---

##  Overview

**BusBook** is a production-style bus ticket booking system that simulates real-world inter-city bus operations. It supports two user roles — regular **Users** who search and book tickets, and **Admins** who manage routes, buses, and schedules.

### What makes it interesting

- **JWT-secured REST APIs** with role-based authorization
- **Atomic booking transactions** — concurrent seat conflicts handled via `@Transactional`
- **Real-time seat layout** — green/blue/red visual feedback
- **In-app notifications + email** confirmations on booking
- **Audit logging** for all critical actions
- **Centralized error handling** via `@RestControllerAdvice`
- **Clean separation of concerns** — DTOs, services, repositories, controllers

---

##  Features

###  User Features
- Register and login with JWT-based auth
- Search buses by source, destination, and travel date
- View detailed bus information with departure/arrival times
- Interactive seat selection with real-time availability
- Multi-passenger booking in a single transaction
- View booking history with full passenger details
- Cancel bookings (with seat re-availability restoration)
- In-app notifications for booking confirmations
- Email confirmations on every successful booking

###  Admin Features
- Dashboard with system statistics
- Manage routes (create, view, list)
- Manage buses (auto-creates 40 seats per bus on creation)
- Manage schedules (assign buses to routes with timings and fares)
- Role-based access — admin endpoints inaccessible to regular users

###  System Features
- BCrypt password hashing
- JWT token with 24-hour expiry
- Auto-logout on token expiry (frontend interceptor)
- Centralized API response envelope (`ApiResponse<T>`)
- Global exception handler returning consistent error format
- Audit logs for traceability
- OpenAPI 3 / Swagger UI for API exploration

---

##  Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Java 17+** | Language |
| **Spring Boot 3.x** | Application framework |
| **Spring Security** | Authentication & authorization |
| **Spring Data JPA** | ORM with Hibernate |
| **MySQL 8.0** | Relational database |
| **JJWT** | JWT token generation & validation |
| **Lombok** | Boilerplate reduction (`@Getter`, `@Setter`, `@Builder`) |
| **Jakarta Validation** | DTO validation (`@NotBlank`, `@Email`, `@Size`) |
| **Spring Mail** | Email notifications (JavaMailSender) |
| **SpringDoc OpenAPI** | Swagger UI generation |
| **SLF4J + Logback** | Logging |
| **Maven** | Build & dependency management |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **Vite** | Build tool & dev server |
| **React Router DOM v6** | Client-side routing |
| **Axios** | HTTP client with interceptors |
| **Tailwind CSS** | Utility-first styling |
| **React Toastify** | Toast notifications |
| **Context API** | Global state (Auth, Notifications) |

### DevOps & Tools
- **Postman / Swagger UI** — API testing
- **MySQL Workbench** — Database management
- **Git** — Version control
- **VS Code / IntelliJ IDEA** — IDE

---

##  Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                         │
│  React SPA — Vite Dev Server @ http://localhost:5173        │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS/REST + JWT
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Spring Boot Backend @ :8080                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  JwtAuthenticationFilter (validates token)          │    │
│  └─────────────────────┬───────────────────────────────┘    │
│  ┌─────────────────────▼───────────────────────────────┐    │
│  │  Spring Security (role-based access)                │    │
│  └─────────────────────┬───────────────────────────────┘    │
│  ┌─────────────────────▼───────────────────────────────┐    │
│  │  Controllers (@RestController)                      │    │
│  └─────────────────────┬───────────────────────────────┘    │
│  ┌─────────────────────▼───────────────────────────────┐    │
│  │  Services (@Service, @Transactional)                │    │
│  └─────────────────────┬───────────────────────────────┘    │
│  ┌─────────────────────▼───────────────────────────────┐    │
│  │  Repositories (Spring Data JPA)                     │    │
│  └─────────────────────┬───────────────────────────────┘    │
└────────────────────────┼─────────────────────────────────────┘
                         │ JDBC
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database                            │
│  users, roles, routes, buses, seats, schedules,             │
│  bookings, booking_seats, notifications, audit_logs         │
└─────────────────────────────────────────────────────────────┘
```

### Layered Architecture (Backend)

```
┌─────────────────────────────────────────┐
│  PRESENTATION LAYER                      │
│  Controllers — HTTP handling, validation │
├─────────────────────────────────────────┤
│  BUSINESS LAYER                          │
│  Services — business logic, transactions │
├─────────────────────────────────────────┤
│  PERSISTENCE LAYER                       │
│  Repositories — data access via JPA      │
├─────────────────────────────────────────┤
│  DATA LAYER                              │
│  Entities + MySQL                        │
└─────────────────────────────────────────┘
```

---

##  Database Schema

### Entity Relationship Diagram

```
users ────┐
          │
          ├──< user_roles >──── roles
          │
          └──< bookings >──── schedules ────── buses ────── routes
                  │                              │
                  │                              └──< seats
                  │
                  └──< booking_seats >──── seats

users ────< notifications
users ────< audit_logs
```

### Tables Overview

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `users` | User accounts | `id`, `email` (unique), `password` (BCrypt), `full_name`, `phone_number`, `is_active`, `created_at` |
| `roles` | Role definitions | `id`, `role_name` (ROLE_USER / ROLE_ADMIN) |
| `user_roles` | M:N junction | `user_id`, `role_id` |
| `routes` | Source-destination pairs | `id`, `source_city`, `destination_city`, `distance_km` |
| `buses` | Bus fleet | `id`, `bus_number`, `bus_name`, `bus_type`, `total_seats`, `operator_name`, `route_id` |
| `seats` | Physical seats per bus | `id`, `seat_number` (A1-J4), `seat_type` (WINDOW/AISLE), `bus_id` |
| `schedules` | Bus running on a date | `id`, `bus_id`, `travel_date`, `departure_time`, `arrival_time`, `fare`, `available_seats`, `schedule_status` |
| `bookings` | Booking transactions | `id`, `booking_reference` (UUID, unique), `user_id`, `schedule_id`, `booking_status`, `total_amount`, `booked_at` |
| `booking_seats` | Seats per booking | `id`, `booking_id`, `seat_id`, `passenger_name`, `passenger_age`, `passenger_gender` |
| `notifications` | User notifications | `id`, `user_id`, `title`, `message`, `notification_type`, `is_read`, `created_at` |
| `audit_logs` | Action audit trail | `id`, `action`, `performed_by`, `module`, `details`, `timestamp` |

### Key Relationships

- **User ↔ Role**: Many-to-many via `user_roles`
- **Bus → Route**: Many-to-one (each bus runs on one route)
- **Bus → Seats**: One-to-many (40 seats auto-created per bus)
- **Schedule → Bus**: Many-to-one (one bus has many schedules across dates)
- **Booking → Schedule + User**: Many-to-one each
- **Booking → BookingSeat**: One-to-many (multi-seat bookings)
- **BookingSeat → Seat**: Many-to-one

### ID Generation Strategy

- **Primary keys**: `BIGINT AUTO_INCREMENT` (`@GeneratedValue(strategy = IDENTITY)`) — fast, compact, ideal for joins
- **Booking reference**: `UUID v4` — unguessable, user-facing identifier shown in emails and support tickets

---

##  Documentation

All detailed design and architecture documentation is available in the [`docs/`](docs) folder:

| Document | Description |
|----------|-------------|
| [SystemDesign.pdf](docs/SystemDesign.pdf) | Complete system architecture, design patterns, components interaction, and technical decisions |
| [DB_Diagram.pdf](docs/DB_Diagram.pdf) | Database schema diagram with entity relationships and field mappings |

These documents provide comprehensive insights into the system's architecture, design patterns, and database structure for developers and stakeholders.

---

##  Getting Started

### Prerequisites

- **Java 17 or higher** ([Download](https://adoptium.net/))
- **Node.js 18+** & npm ([Download](https://nodejs.org/))
- **MySQL 8.0+** ([Download](https://dev.mysql.com/downloads/))
- **Maven 3.8+** (or use the included `mvnw` wrapper)
- **Git** ([Download](https://git-scm.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/bus-booking-system.git
cd bus-booking-system
```

### 2. Database Setup

```sql
-- Connect to MySQL and run:
CREATE DATABASE bus;
```

Hibernate's `spring.jpa.hibernate.ddl-auto=update` will auto-create tables on first run.

### 3. Backend Setup

```bash
cd bus-booking-backend
```

**Configure `src/main/resources/application.properties`:**

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/bus
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=YourSuperSecretKeyMustBeAtLeast256BitsLongForHS256Algorithm
jwt.expiration=86400000

# Email (optional — for booking confirmations)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Run the backend:**

```bash
# On Mac/Linux
./mvnw spring-boot:run

# On Windows
mvnw.cmd spring-boot:run
```

The backend starts on `http://localhost:8080`.

**`DataInitializer` automatically creates:**
- `ROLE_USER` and `ROLE_ADMIN` rows
- Default admin user: `admin@gmail.com` / `admin123`

### 4. Frontend Setup

```bash
cd ../bus-booking-client
```

**Create `.env` at project root:**

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

**Install dependencies and run:**

```bash
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui/index.html
- **API Docs (JSON)**: http://localhost:8080/v3/api-docs

### 6. Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@gmail.com | admin123 |
| **User** | (register a new account) | — |

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get JWT |
| GET | `/api/auth/me` | Authenticated | Get current user info |

### Public Search Endpoints

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | `/api/buses/search?sourceCity=&destinationCity=` | Public | Search buses by route |
| GET | `/api/buses/{busId}` | Public | Get bus details |
| GET | `/api/schedules/search?sourceCity=&destinationCity=&travelDate=` | Public | Search schedules |
| GET | `/api/schedules/{scheduleId}` | Public | Get schedule details |
| GET | `/api/seats/bus/{busId}/schedule/{scheduleId}` | Public | Get seat layout |

### User Booking Endpoints

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/api/bookings` | Authenticated | Create booking |
| GET | `/api/bookings/user` | Authenticated | List my bookings |
| DELETE | `/api/bookings/{bookingId}` | Authenticated (owner) | Cancel booking |

### Notification Endpoints

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | `/api/notifications` | Authenticated | List my notifications |
| PUT | `/api/notifications/{id}/read` | Authenticated | Mark as read |

### Admin Endpoints

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/api/admin/routes` | **ADMIN** | Create route |
| GET | `/api/admin/routes` | **ADMIN** | List all routes |
| POST | `/api/buses/admin` | **ADMIN** | Create bus (auto-creates 40 seats) |
| GET | `/api/buses/admin` | **ADMIN** | List all buses |
| POST | `/api/schedules/admin` | **ADMIN** | Create schedule |
| GET | `/api/schedules/admin` | **ADMIN** | List all schedules |

### Standard Response Format

All endpoints return a uniform `ApiResponse<T>` envelope:

**Success:**
```json
{
  "success": true,
  "message": "Booking successful",
  "data": {
    "bookingReference": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "bookingStatus": "CONFIRMED",
    "totalAmount": 1299.0
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Seat already booked",
  "data": null
}
```

---

##  Authentication & Authorization

### Registration Flow

1. User submits `POST /api/auth/register` with `fullName`, `email`, `phoneNumber`, `password`
2. Backend validates input via Jakarta Bean Validation
3. Checks email uniqueness via `userRepository.existsByEmail`
4. Hashes password with BCrypt (`passwordEncoder.encode`)
5. Assigns default `ROLE_USER`
6. Saves user, generates JWT, returns `{token, email, fullName, roles}`

### Login Flow

1. User submits `POST /api/auth/login` with email/password
2. Spring's `AuthenticationManager` validates credentials via `CustomUserDetailsService`
3. On success: `JwtUtil.generateToken(email)` issues HS256-signed token (24h expiry)
4. Returns `{token, email, fullName, roles}` wrapped in `ApiResponse`

### Request Authentication Flow

```
Client Request → JwtAuthenticationFilter
                     ↓
              Extract "Bearer <token>" from Authorization header
                     ↓
              JwtUtil.extractUsername(token) → email
                     ↓
              CustomUserDetailsService.loadUserByUsername(email)
              (fetches roles from DB on every request)
                     ↓
              JwtUtil.validateToken(token) → check signature & expiry
                     ↓
              SecurityContextHolder.setAuthentication(authToken)
                     ↓
              Spring Security checks role-based rules
                     ↓
              Controller method executes
```

### Authorization Rules (from `SecurityConfig`)

```java
.requestMatchers(
    "/api/auth/**",
    "/api/buses/search", "/api/buses/{busId}",
    "/api/schedules/search", "/api/schedules/{scheduleId}",
    "/api/seats/**",
    "/swagger-ui/**", "/v3/api-docs/**"
).permitAll()

.requestMatchers(
    "/api/admin/**",
    "/api/buses/admin",
    "/api/schedules/admin"
).hasRole("ADMIN")

.anyRequest().authenticated();
```

> **Note**: `hasRole("ADMIN")` checks for an authority named `ROLE_ADMIN` (Spring auto-prepends `ROLE_`).

---

##  Core Business Flows

### Flow A: Searching and Booking

```
User enters source/destination/date
        ↓
GET /api/schedules/search
        ↓
Display BusCard list (one per matching schedule)
        ↓
Click "View Seats" → navigate to /bus/{scheduleId}
        ↓
GET /api/schedules/{scheduleId}  → schedule + bus + route
GET /api/seats/bus/{busId}/schedule/{scheduleId}  → seats with status
        ↓
User selects seats → fills passenger details
        ↓
POST /api/bookings
{
  "scheduleId": 1,
  "passengers": [
    {"seatId": 5, "passengerName": "John", "passengerAge": 28, "passengerGender": "Male"}
  ]
}
        ↓
BookingService.createBooking() inside @Transactional:
  1. Load user, schedule
  2. Validate availableSeats >= requested
  3. Create Booking with UUID reference
  4. For each seat: validate not already booked, create BookingSeat
  5. Decrement schedule.availableSeats
  6. Send notification (in-app + email)
  7. Log audit entry
        ↓
Return {bookingReference, bookingStatus, totalAmount}
        ↓
Frontend shows success toast → redirects to My Bookings
```

### Flow B: Admin Creates Inventory (order matters)

```
1. Create Route        → POST /api/admin/routes
   { sourceCity, destinationCity, distanceKm }
        ↓
2. Create Bus          → POST /api/buses/admin
   { busName, busNumber, busType, totalSeats, operatorName, routeId }
    Side effect: 40 seats auto-created (A1, A2, ..., J4)
        ↓
3. Create Schedule     → POST /api/schedules/admin
   { busId, travelDate, departureTime, arrivalTime, fare }
    availableSeats initialized to bus.totalSeats
```

### Flow C: Booking Cancellation

```
User clicks "Cancel" on My Bookings
        ↓
DELETE /api/bookings/{bookingId}
        ↓
BookingService.cancelBooking():
  1. Verify booking belongs to current user
  2. Set bookingStatus = "CANCELLED"
  3. Increment schedule.availableSeats by seats count
  4. Log audit entry
        ↓
Seat becomes available for other users
```

---

##  Security Implementation

### Password Security
- **BCrypt hashing** via `BCryptPasswordEncoder` (Spring Security default)
- Salt is auto-generated per password
- Hash cost factor: 10 (default)

### JWT Security
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret**: Loaded from `application.properties` (`jwt.secret`)
- **Expiry**: 24 hours
- **Payload**: Email as `subject`, issued-at timestamp, expiration
- **Validation**: Signature + expiry checked on every request

### Session Management
- **Stateless** — `SessionCreationPolicy.STATELESS`
- No server-side sessions; JWT is the only state carrier
- Frontend stores token in `localStorage` (key: `bbs_token`)

### CSRF
- **Disabled** — safe because we use JWT in `Authorization` header, not cookies

### Authorization Defense Layers
1. **Path-based rules** in `SecurityConfig`
2. **Roles validated on every request** — `CustomUserDetailsService` reloads roles from DB
3. **Ownership checks** — e.g., booking cancellation verifies user owns the booking

### Frontend Token Handling
- Axios request interceptor auto-attaches `Authorization: Bearer <token>`
- Axios response interceptor:
  - 401 → clear localStorage, redirect to `/login`
  - 403 (on user actions) → toast "Permission denied"
  - 5xx → toast "Server error"

---

##  Exception Handling

### Backend — Three-Layer Strategy

**Layer 1: Service throws `RuntimeException` with meaningful messages**

```java
.orElseThrow(() -> new RuntimeException("Schedule not found"));

if (schedule.getAvailableSeats() < requestedSeats) {
    throw new RuntimeException("Requested seats unavailable");
}

if (!existingBookings.isEmpty()) {
    throw new RuntimeException("Seat already booked");
}
```

**Layer 2: `@Transactional` rolls back on exception**

Any `RuntimeException` thrown inside `@Transactional`-annotated methods triggers automatic rollback — partial DB writes are discarded.

**Layer 3: `GlobalExceptionHandler` catches and responds**

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>>
    handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest().body(
            ApiResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .build()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>>
    handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
            .getFieldError()
            .getDefaultMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.builder()
                .success(false)
                .message(message)
                .build());
    }
}
```

### Common Exceptions Thrown

| Exception | Where | Triggered By |
|-----------|-------|--------------|
| `RuntimeException("Email already registered")` | AuthService | Duplicate signup |
| `RuntimeException("User not found")` | Multiple services | Invalid user lookup |
| `RuntimeException("Schedule not found")` | BookingService | Invalid schedule ID |
| `RuntimeException("Seat not found")` | BookingService | Invalid seat ID |
| `RuntimeException("Seat already booked")` | BookingService | Concurrent booking |
| `RuntimeException("Requested seats unavailable")` | BookingService | Schedule full |
| `RuntimeException("Unauthorized cancellation")` | BookingService | Cancel another user's booking |
| `MethodArgumentNotValidException` | Spring Validation | Invalid DTO (e.g., bad email) |
| `BadCredentialsException` | Spring Security | Wrong email/password on login |
| `JwtException` (caught silently) | JwtUtil | Expired/malformed token |

### Frontend — Axios Interceptor

```js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    } else if (status === 403) {
      toast.error("You don't have permission to do that.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    }
    return Promise.reject({ ...error, message: error.response?.data?.message });
  }
);
```

---

##  Testing with Swagger

### Quick Test Sequence

#### As Admin

1. **Login** → `POST /api/auth/login` with `admin@gmail.com` / `admin123`
2. **Copy token** → Click "Authorize"  → paste token
3. **Create Route** → `POST /api/admin/routes`
   ```json
   { "sourceCity": "Hyderabad", "destinationCity": "Bengaluru", "distanceKm": 575 }
   ```
4. **Create Bus** → `POST /api/buses/admin`
   ```json
   {
     "busNumber": "TS09AB1234",
     "busName": "Orange Travels",
     "busType": "AC Sleeper",
     "totalSeats": 40,
     "operatorName": "Orange Logistics",
     "routeId": 1
   }
   ```
5. **Create Schedule** → `POST /api/schedules/admin`
   ```json
   {
     "busId": 1,
     "travelDate": "2026-06-15",
     "departureTime": "2026-06-15T22:00:00",
     "arrivalTime": "2026-06-16T07:30:00",
     "fare": 1299
   }
   ```

#### As User

1. **Logout** from Swagger (Authorize → Logout)
2. **Register** → `POST /api/auth/register`
   ```json
   {
     "fullName": "Test User",
     "email": "user@test.com",
     "phoneNumber": "9876543210",
     "password": "test1234"
   }
   ```
3. **Login** with the new account → copy token → Authorize
4. **Verify role** → `GET /api/auth/me` → should show `["ROLE_USER"]`
5. **Try admin endpoint** → `POST /api/admin/routes` → should return **403 Forbidden** ✅
6. **Search schedules** → `GET /api/schedules/search?sourceCity=Hyderabad&destinationCity=Bengaluru&travelDate=2026-06-15`
7. **Get seats** → `GET /api/seats/bus/1/schedule/1`
8. **Book a seat** → `POST /api/bookings`
   ```json
   {
     "scheduleId": 1,
     "passengers": [
       { "seatId": 1, "passengerName": "John", "passengerAge": 25, "passengerGender": "Male" }
     ]
   }
   ```
9. **View bookings** → `GET /api/bookings/user`
10. **View notifications** → `GET /api/notifications`
11. **Cancel booking** → `DELETE /api/bookings/{bookingId}`

---

## 📸 Screenshots 

### Home Page
![Home Page](images/home.png)

> Hero section with search form for source, destination, and travel date.

---

### Search Results
![Search Results](images/SearchResults.png)

> Bus listings with departure/arrival times, fare, and "View Seats" button.

---

### Seat Selection
![Seat Selection](images/SeatSelection.png)

> Interactive seat grid — green (available), blue (selected), red (booked).

---

### Passenger Details Modal
![Passenger Details](images/PassengerDetail.png)

> Form to capture passenger name, age, and gender per seat.

---

### My Bookings
![My Bookings](images/MyBooking.png)

> Booking history with full details — bus name, route, seats, passengers, status, cancel option.

---

### Admin Dashboard
![Admin Dashboard](images/AdminDashboard.png)

> Statistics cards showing total routes, buses, schedules.

---

### Add Buses
![Add Buses](images/AddBuses.png)

> Admin interface for adding and managing buses.

---

### Manage Schedules
![Manage Schedules](images/ManageSchedules.png)

> Admin forms with existing-record tables for schedules.

---

### Notifications
![Notifications](images/Notifications.png)

> In-app notification system for booking updates and alerts.

---

### Mail Notifications
![Mail Notifications](images/MailNotification.png)

> Email notifications sent for booking confirmation and cancellation.

---

### Booking Cancellation
![Booking Cancellation](images/BookingCancellation.png)

> Booking cancellation workflow with status updates and refund handling.

---

##  Future Enhancements

### High Priority
- [ ] **Payment gateway integration** (Razorpay / Stripe)
- [ ] **Refresh tokens** for long-lived sessions
- [ ] **Password reset flow** via email
- [ ] **Email verification** on registration
- [ ] **Custom exception types** with proper HTTP status codes (404, 409, 403)
- [ ] **Rate limiting** on login endpoint (prevent brute force)
- [ ] **Real-time notifications** via WebSockets / Server-Sent Events

### Medium Priority
- [ ] **Pagination** on all list endpoints
- [ ] **Search filters** — bus type, departure time range, fare range
- [ ] **Seat-level pricing** (window seats premium)
- [ ] **Booking modification** (change date/passenger)
- [ ] **Recurring schedules** (daily / weekly)
- [ ] **Multi-language support** (i18n)
- [ ] **Mobile-first PWA** with offline support

### Production Readiness
- [ ] **Docker + docker-compose** for one-command setup
- [ ] **CI/CD with GitHub Actions** — auto-test, build, deploy
- [ ] **Unit tests** — JUnit 5 + Mockito for services
- [ ] **Integration tests** — MockMvc for controllers
- [ ] **Frontend tests** — React Testing Library + Vitest
- [ ] **Caching layer** — Redis for schedule search results
- [ ] **Message queue** — RabbitMQ for async email sending
- [ ] **Database migrations** — Flyway / Liquibase
- [ ] **Monitoring** — Spring Actuator + Prometheus + Grafana
- [ ] **Logging aggregation** — ELK stack
- [ ] **API versioning** — `/api/v1/`, `/api/v2/`
- [ ] **OpenAPI spec versioning**
- [ ] **CDN** for frontend assets
- [ ] **HTTPS** termination at load balancer

### Architectural Improvements
- [ ] **UUID v7** primary keys for distributed-friendly IDs
- [ ] **Optimistic locking** on seat booking (`@Version` column)
- [ ] **Read replicas** for search-heavy traffic
- [ ] **Database sharding** by region (when scaling)
- [ ] **Event-driven booking pipeline** — booking events → Kafka → email service / analytics service
- [ ] **Multi-tenancy** for bus operators (each operator = isolated workspace)

---

##  Known Issues & Limitations

| Issue | Impact | Workaround |
|-------|--------|------------|
| No payment gateway | "Proceed to Pay" just creates the booking | Treat as cash-on-pickup for now |
| Race condition on simultaneous booking | Two users *could* book same seat in rare millisecond overlap | Mitigated by `@Transactional` + existing-booking check; production needs `SELECT ... FOR UPDATE` |
| Email failures silent | If SMTP is down, no retry | Logs error but booking still succeeds |
| No refresh tokens | Users logged out after 24h | Re-login required |
| Frontend stores JWT in localStorage | XSS-vulnerable in theory | Production should use httpOnly cookies |
| Seat labels hardcoded 4-per-row | All buses look identical | Configurable layout pending |

---

##  Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with clear commit messages
4. **Run tests** (when test suite is added): `mvn test` / `npm test`
5. **Push to your fork**: `git push origin feature/amazing-feature`
6. **Open a Pull Request** with a description of changes

---

##  Author

**Yasaswini Gaddam**
- GitHub: [@yasaswini2104](https://github.com/yasaswini2104)
- LinkedIn: [yasaswini-gaddam](https://www.linkedin.com/in/yasaswini-gaddam/)
- Email: yasaswini.gaddam21@gmail.com

**Sathvika Duggirala**
* GitHub: [@Satwii2606](https://github.com/Satwii2606)
* LinkedIn: [duggirala-sathvika](https://www.linkedin.com/in/duggirala-sathvika-737085259/)
* Email: sathvikaduggirala2005@gmail.com

**Rupa Manda**
* GitHub: [@rupa-manda](https://github.com/rupa-manda)
* LinkedIn: [rupa-manda](https://www.linkedin.com/in/rupa-manda/)
* Email: rupa_manda@srmap.edu.in

**Divya Naga Sri Satya**
* GitHub: [@your-github](https://github.com/divyaa0525)
<!-- * LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/yasaswini-gaddam/) -->
* Email: divyanagasatya_poduri@srmap.edu.in
---
