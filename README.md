# HotelPro — Human-Centered Hotel Management System 🏨

[![Testing & UAT](https://img.shields.io/badge/Testing-UAT_%26_Performance-orange.svg)](./documentations/User%20Acceptance%20Testing%20(UAT)%20Template.md)
[![Developer](https://img.shields.io/badge/Developer-DIVYANSH_AGARWAL-blue.svg)](https://github.com/divyanshagoyan-alt)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://www.mongodb.com/)
[![React 19](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_9.0-47A248.svg)](https://www.mongodb.com/)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-blue.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **Full Stack Development Program (MERN Stack) — Capstone Project**  
> **Developed by: DIVYANSH AGARWAL**  
> 📄 **Project Testing & Verification Report**: [User Acceptance & Performance Testing Template](./documentations/User%20Acceptance%20Testing%20(UAT)%20Template.md)

HotelPro is a complete, human-centered hotel management platform built around the **MERN** stack (MongoDB, Express, React 19, Node.js). Engineered with a refined editorial aesthetic, tactile micro-animations, accessible UI components, and complete role-based user journeys for guests, front-desk staff, housekeeping teams, and hotel executives.

---

## 📑 Documentation Quick Links

| Document | Description |
| :--- | :--- |
| 📘 **[UAT & Performance Report](./documentations/User%20Acceptance%20Testing%20(UAT)%20Template.md)** | **Comprehensive QA & Performance Testing Specification** by **DIVYANSH AGARWAL**, detailing system architecture, test cases, benchmarks, and sign-off. |
| 🍃 **[MongoDB Installation & Setup Guide](./MONGODB_README.md)** | Step-by-step offline localhost setup, Windows Service management (`127.0.0.1:27017`), seeding, and Atlas guide. |
| 🎨 **[Interactive Style Guide (Live)](http://localhost:5173/style-guide)** | Accessible design tokens, WCAG 2.1 AA color contrast palette, tactile states, and typography. |

---

## 🎨 Human-Centered Design Philosophy

HotelPro follows frontend design principles inspired by the [Redwerk Frontend Design Guide](https://redwerk.com/blog/front-end-design-guides/):

- **Harmonious Color Palette**: Deep botanical Forest Green (`#234B3B`) paired with warm brass gold accents (`#B88B5A`), cream backgrounds (`#F7F6F2`), and high-contrast semantic tones exceeding WCAG 2.1 AA requirements.
- **Typography Hierarchy**: Distinctive serif titles using *Playfair Display* combined with *Inter* for legible user interfaces.
- **Micro-Interactions & State Clarity**: Dedicated styles for default, hover, focus (`#276EF1` focus-ring), active, disabled, and loading states.
- **Accessibility by Architecture**: Built with semantic landmarks (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`), ARIA attributes, keyboard escape dismissal for modals, and reduced-motion support.

👉 **Explore the interactive design system in the running app at `/style-guide`.**

---

## 🔑 Role-Based Portals & Demo Accounts

HotelPro provides an interactive 1-click credential selector on `/login`:

| Role | Demo Email | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **Guest** | `guest@demo.com` | `demo123` | Search properties, multi-step booking checkout, stay receipts, cancellation |
| **Staff** | `staff@demo.com` | `demo123` | Front desk console, check-in key issuing, check-out settlement, guest service requests |
| **Manager** | `manager@demo.com` | `demo123` | Housekeeping grid, shift coordination, room inventory status |
| **Admin** | `admin@demo.com` | `demo123` | Executive dashboard, Recharts occupancy trends, RevPAR KPIs, audit trail |

---

## 🌟 Key Platform Features & Innovations

- **🏨 Real-Time Hotel Search & Discovery**:
  - Top navigation **"Search Hotels"** menu and desktop quick-search input.
  - Multi-attribute search on `/search` and `/hotels` matching hotel name, city, location, category, description, and amenities.
  - Interactive destination quick-chips (Mumbai, Jaipur, Goa, New Delhi, Shimla, Bengaluru) with instant reset.
- **💳 100% Offline & Simulated Payment Sandbox**:
  - **Zero Network Error Guarantee**: Eliminates payment network failures when running offline or without an active backend server.
  - 4 sandbox payment channels: **Credit/Debit Card** (visual sandbox card preview), **UPI / QR Code** (simulated QR scanner), **Net Banking** (top Indian banks), and **Pay at Property** (cash/card at check-in).
  - Client-side persistence in `localStorage` (`hotelpro_offline_reservations`) and synchronized with MongoDB when online.
- **🔒 Privacy & Receipt Security**:
  - **Direct URL Access Restricted**: Direct public link access to `/booking/confirmation/:ref` is blocked to prevent guest data leaks.
  - Receipts are viewed securely in-page via an authenticated modal dialog in **My Bookings**.
  - Clean print stylesheet removing public footers from all vouchers.
- **🛎️ Front Desk & Administrative Console**:
  - Live guest check-in/check-out management, room assignment, housekeeping grids, and financial reports.
  - Non-intrusive live operational alert popup at bottom-right for front-desk activity.

---

## 🚀 Quick Start

### 1. Install Dependencies
```powershell
npm install
```

### 2. Verify Environment Variables (`.env`)
Your project `.env` is pre-configured for offline localhost development:
```env
# Frontend API URL
VITE_API_BASE_URL=http://localhost:5000/api
# false = connects to live MongoDB backend; true = standalone mock
VITE_USE_MOCK=false
VITE_APP_ENV=development

# Backend Express Port
PORT=5000

# Local Offline MongoDB Connection (IPv4 localhost)
MONGODB_URI=mongodb://127.0.0.1:27017/hotelpro
```

### 3. Verify Local MongoDB Service (Windows)
Ensure the local MongoDB Windows service is active:
```powershell
# Check status
Get-Service -Name MongoDB

# Start if stopped
Start-Service -Name MongoDB
```

### 4. Seed MongoDB Demo Data
Populate the offline database with initial luxury hotels, rooms, and users:
```powershell
npm run seed
```

### 5. Run the Platform

In **Terminal 1** (Backend API Server):
```powershell
npm run server
```
- API Base: `http://localhost:5000`
- Diagnostics / Healthcheck: [http://localhost:5000/api/health](http://localhost:5000/api/health)

In **Terminal 2** (React Frontend):
```powershell
npm run dev
```
- Available at: [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```text
hotelpro/
├── .env                                 # Active local environment variables
├── .env.example                         # Environment template
├── documentations/                      # Project testing & performance documentation specifications
│   ├── User Acceptance Testing (UAT) Template.md
│   └── User Acceptance Testing (UAT) Template.docx
├── MONGODB_README.md                    # Comprehensive MongoDB installation & offline guide
├── README.md                            # Main project overview & quickstart
├── server/                              # MERN Backend Express API
│   ├── config/db.js                     # Mongoose connection & resilience handler
│   ├── models/                          # User, Hotel, Room, Booking, Housekeeping, etc.
│   ├── routes/                          # Express REST routes (/api/auth, /api/hotels, etc.)
│   ├── seed/seed.js                     # Automated MongoDB seeder
│   └── server.js                        # Express app listener & health diagnostics
├── src/
│   ├── components/
│   │   ├── common/                      # Button, StatusBadge, Modal, MetricCard, UI atoms
│   │   └── layouts/                     # PublicNavbar, PublicFooter
│   ├── context/                         # AuthContext, BookingContext
│   ├── data/mock/                       # Seed data and mock fallback dataset
│   ├── layouts/                         # PublicLayout, DashboardLayout
│   ├── pages/
│   │   ├── admin/                       # AdminDashboard, RoomManagement, StaffManagement, Audit
│   │   ├── auth/                        # LoginPage, RegisterPage
│   │   ├── guest/                       # MyBookingsPage, ProfilePage
│   │   ├── public/                      # HomePage, HotelsPage, HotelDetailPage, CheckoutPage, StyleGuide
│   │   └── staff/                       # FrontDeskPage, HousekeepingPage
│   ├── services/                        # Axios apiClient and service adapters
│   └── styles/                          # Human-centered CSS design tokens & utilities
├── package.json
└── vite.config.js
```

---

## 👨‍💻 Author & Project Credits

- **Developer**: **DIVYANSH AGARWAL**
- **Program**: Full Stack Web Development (MERN Stack)
- **Specialization**: MongoDB, Express.js, React 19, Node.js, Human-Centered UI/UX
- **Project Report**: [User Acceptance & Performance Testing Specification](./documentations/User%20Acceptance%20Testing%20(UAT)%20Template.md)
- **License**: MIT / Educational Project Submission