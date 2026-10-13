# HotelPro — MongoDB Setup & Installation Guide 🍃

HotelPro is built around the **MERN** stack (MongoDB, Express, React 19, Node.js).  
This guide walks you through setting up and running MongoDB locally offline on Windows, managing the Windows Service, using Docker, or connecting to a remote MongoDB Atlas cloud cluster.

---

## ⚡ Quick Option Summary

| Method | Best For | Offline Capable? | Setup Time | Required Tools |
| :--- | :--- | :--- | :--- | :--- |
| **Option 1: Windows Native Service** *(Recommended)* | **Local Offline Development** | ✅ Yes (100% Offline) | Already Running | Windows Service |
| **Option 2: Docker Container** | Containerized workflow | ✅ Yes (Offline) | ~1 minute | Docker Desktop |
| **Option 3: MongoDB Atlas (Cloud)** | Multi-device cloud sync | ❌ Requires Internet | ~3 minutes | Web Browser |

---

## 💻 Option 1: Windows Native Local Service (Offline Localhost Setup)

MongoDB Community Server runs natively as a background Windows service on your PC, allowing full offline operation without any active internet connection.

### 1. Check Service Status
Open PowerShell:
```powershell
# Verify if MongoDB is running
Get-Service -Name MongoDB
```
*Expected status:*
```text
Status   Name      DisplayName
------   ----      -----------
Running  MongoDB   MongoDB Server (MongoDB)
```

### 2. Starting & Stopping the Service
If MongoDB is stopped, start it with:
```powershell
Start-Service -Name MongoDB
```
To stop the service when not in use:
```powershell
Stop-Service -Name MongoDB
```

### 3. Executable Path & CLI Tools
The server binary is installed at:
```text
C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe
```
This folder is added to your User `PATH`, so you can run tools directly from any terminal.

---

## ⚙️ Environment Configuration (`.env`)

Your local `.env` file is located at `hotelpro/.env`.

```env
# ===================================================================
# HotelPro - Environment Configuration (Offline Localhost Setup)
# ===================================================================

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:5000/api
# false = connect to backend & MongoDB; true = standalone frontend mock
VITE_USE_MOCK=false
VITE_APP_ENV=development

# Backend Express Server Port
PORT=5000

# Local Offline MongoDB Connection (Localhost / 127.0.0.1:27017)
# Using 127.0.0.1 guarantees direct IPv4 offline connection without DNS delays
MONGODB_URI=mongodb://127.0.0.1:27017/hotelpro

# Alternative local URI if preferred:
# MONGODB_URI=mongodb://localhost:27017/hotelpro

# (Optional) Remote MongoDB Atlas URI (when online):
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hotelpro?retryWrites=true&w=majority
```

> [!TIP]
> **Why `127.0.0.1` instead of `localhost`?**  
> On Windows and Node.js 18+, `localhost` can attempt to resolve IPv6 (`::1`) before IPv4 (`127.0.0.1`), leading to connection delays when offline. Specifying `127.0.0.1:27017` guarantees instantaneous, direct offline connection.

---

## 🚀 Seeding HotelPro Demonstration Data

HotelPro includes an automated database seeder that populates MongoDB with initial luxury properties, room categories, demo users, bookings, housekeeping queues, and audit logs.

Once MongoDB is active, run:
```powershell
npm run seed
```

Output:
```text
[MongoDB] Connected successfully to host: 127.0.0.1, database: hotelpro
[Seed] Seeding MongoDB with HotelPro initial data...
[Seed] Seeded 4 demo users.
[Seed] Seeded 6 luxury hotels.
[Seed] Seeded 5 room inventories.
[Seed] Seeded 5 reservations.
[Seed] Database initialization completed successfully!
```

---

## 🏃 Running the Full MERN Stack

### 1. Start the Express + MongoDB Backend API
```powershell
npm run server
```
- Listens on `http://localhost:5000`
- Provides REST API endpoints under `/api`
- Healthcheck endpoint: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 2. Start the React Frontend Dev Server
In a separate terminal window:
```powershell
npm run dev
```
- Available at [http://localhost:5173](http://localhost:5173)
- Communicates directly with `http://localhost:5000/api`

---

## 🩺 Verifying Database Connectivity

Visit `http://localhost:5000/api/health` in your browser. You will see:
```json
{
  "status": "online",
  "system": "HotelPro MERN Backend",
  "database": {
    "provider": "MongoDB",
    "connected": true,
    "uri": "mongodb://127.0.0.1:27017/hotelpro",
    "readyState": 1
  },
  "uptime": 124.5
}
```
*(readyState: 1 = Connected, 0 = Disconnected)*

---

## 🐳 Option 2: Docker Container (Alternative Offline Setup)

If you prefer running MongoDB inside Docker Desktop:

```powershell
docker run -d --name hotelpro-mongo -p 27017:27017 -v hotelpro_data:/data/db mongo:latest
```

To stop or resume later:
```powershell
docker stop hotelpro-mongo
docker start hotelpro-mongo
```

---

## ☁️ Option 3: MongoDB Atlas (Cloud Database)

If you need a shared cloud database accessible across multiple machines:

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create an **M0 (Free)** sandbox cluster.
3. Under **Database Access**, create a user (e.g. `hotelpro_admin`).
4. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere).
5. In `.env`, update `MONGODB_URI`:
   ```env
   MONGODB_URI=mongodb+srv://hotelpro_admin:<password>@cluster0.xxxxx.mongodb.net/hotelpro?retryWrites=true&w=majority
   ```

---

## 🛠️ Collections & Models Reference

| Collection | Model Path | Purpose |
| :--- | :--- | :--- |
| `users` | `server/models/User.js` | Guest accounts, staff, managers, and administrators with role permissions |
| `hotels` | `server/models/Hotel.js` | Hotel properties, location, ratings, photo galleries, and amenities |
| `rooms` | `server/models/Room.js` | Room inventory, pricing tariffs, floors, max capacity, bed type, and status |
| `bookings` | `server/models/Booking.js` | Guest reservations, check-in/out dates, financial breakdown, and lifecycle |
| `housekeepings` | `server/models/Housekeeping.js` | Room sanitation tracking, dirty/clean status, priorities, staff assignment |
| `servicerequests` | `server/models/ServiceRequest.js` | Live guest tickets (room service, towels, luggage, maintenance) |
| `auditlogs` | `server/models/AuditLog.js` | Administrative audit trail for pricing modifications and security logs |

---

## 💡 Troubleshooting & FAQ

### What happens if MongoDB is offline?
HotelPro is engineered with **graceful offline resilience**:
- If MongoDB is stopped, the backend reports `connected: false` on `/api/health` without crashing.
- The frontend services automatically fallback to the built-in mock database so you can continue testing the UI uninterrupted.
- To switch to pure frontend standalone testing, set `VITE_USE_MOCK=true` in `.env`.
