# 🚌 BusBook — Bus Booking System (Frontend)

Production-ready React + Vite frontend for a Bus Booking System. Designed to integrate cleanly with a Spring Boot backend over REST + JWT.

---

## ⚙️ Tech Stack

- **React 19** + **Vite**
- **React Router DOM v6**
- **Axios** (with JWT interceptors + auto-logout on 401)
- **React Toastify**
- **Tailwind CSS** (custom `primary` palette)
- **Context API** (Auth + Notifications)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create / verify `.env` at project root:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

> **Note:** Never hardcode API URLs — always use `import.meta.env.VITE_API_BASE_URL`.

### 3. Run the dev server

```bash
npm run dev
```

App runs at `http://localhost:5173`.

### 4. Build for production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── api/              # Axios instance + interceptors
│   └── axios.js
├── assets/           # Static images, icons
├── components/
│   ├── common/       # Button, Input, Card, Modal, Loader, EmptyState
│   ├── layout/       # Navbar, Footer, AdminSidebar
│   ├── booking/      # SearchForm, BusCard, SeatLayout
│   ├── admin/
│   └── notification/
├── context/          # AuthContext, NotificationContext
├── layouts/          # MainLayout, AuthLayout, AdminLayout
├── pages/
│   ├── auth/         # Login, Register
│   ├── user/         # UserDashboard, MyBookings, Notifications
│   ├── admin/        # AdminDashboard, ManageRoutes, ManageBuses, ManageSchedules
│   ├── Home.jsx
│   ├── SearchResults.jsx
│   ├── BusDetails.jsx
│   └── NotFound.jsx
├── routes/           # AppRoutes, ProtectedRoute, AdminRoute
├── services/         # authService, busService, scheduleService, bookingService, notificationService, adminService
├── utils/            # constants, formatters, jwt
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🔐 Authentication Flow

- On login, the backend's JWT token is stored in `localStorage` (key: `bbs_token`)
- The axios request interceptor attaches `Authorization: Bearer <token>` to every API call
- The response interceptor auto-logs out the user on `401` and redirects to `/login`
- `ProtectedRoute` guards user-only routes
- `AdminRoute` enforces `role === "ADMIN"` from the JWT payload or user object

### Expected backend login response shape

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

If `user` is missing, the app falls back to decoding the JWT payload (`sub`, `role`, `roles[]`, etc.).

---

## 🗺️ Routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Home with hero search |
| `/login` | Public | Login page |
| `/register` | Public | Registration |
| `/search` | Public | Search results (query string driven) |
| `/bus/:id` | Public (booking needs login) | Bus details + seat selection |
| `/dashboard` | User | User stats dashboard |
| `/my-bookings` | User | List + cancel bookings |
| `/notifications` | User | In-app notifications |
| `/admin` | Admin | Admin dashboard |
| `/admin/routes` | Admin | Manage routes |
| `/admin/buses` | Admin | Manage fleet |
| `/admin/schedules` | Admin | Manage schedules |

---

## 🔌 Backend API Contracts

All requests go through `src/api/axios.js`. Endpoints are centralised in `src/utils/constants.js → ENDPOINTS`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate, returns JWT |
| GET | `/buses/search` | Search buses by source/destination/date |
| GET | `/buses/{id}` | Bus details + seat layout |
| GET | `/schedules/search` | Schedule search (used first, falls back to bus search) |
| POST | `/bookings` | Create a new booking |
| DELETE | `/bookings/{id}` | Cancel a booking |
| GET | `/bookings/user` | Current user's bookings |
| GET | `/notifications` | List notifications |
| PUT | `/notifications/{id}/read` | Mark notification as read |
| POST | `/admin/routes` + GET | Routes CRUD (admin) |
| POST | `/buses/admin` + GET | Buses CRUD (admin) |
| POST | `/schedules/admin` + GET | Schedules CRUD (admin) |

---

## 💺 Seat Layout

`<SeatLayout />` accepts:

```js
seats = [{ id, label, status: "AVAILABLE" | "BOOKED" }]
selectedIds = []
onToggle = (seatId) => void
columnsPerRow = 4
```

Seat colors:
- 🟢 **Green** → Available
- 🔵 **Blue** → Selected
- 🔴 **Red** → Booked

If the backend doesn't supply a `seats` array, a fallback layout is auto-generated from `totalSeats`.

---

## 🎨 Customising

- **Brand colors** → `tailwind.config.js → theme.extend.colors.primary`
- **Font** → Inter, loaded in `src/index.css`
- **Toast position/timing** → `src/App.jsx → <ToastContainer />`

---

## 🧱 Architecture Principles

- **Services separated from UI** — pages call `xxxService.method()`, never axios directly
- **Endpoints centralised** — no magic strings; everything in `ENDPOINTS`
- **Resilient response parsing** — handles `data`, `data.content`, plain arrays
- **Auto-cleanup** — expired tokens are wiped on app boot
- **No hardcoded URLs** — `import.meta.env.VITE_API_BASE_URL` everywhere
- **Backend-shape-flexible** — pages read both `id`/`busId`, `source`/`from`, `totalAmount`/`amount` etc. to survive minor backend variations

---

## ✅ Next Steps

1. Run `npm install`
2. Start your Spring Boot backend on `http://localhost:8080`
3. Run `npm run dev`
4. Register → Login → Search → Book 🎉
