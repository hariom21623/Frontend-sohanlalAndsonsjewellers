# 💎 Sohan Lal And Sons Jewellers — Frontend (React + TypeScript + MUI)

A complete role-based admin panel & user interface for **Sohan Lal and Sons Jewellers**, built using React 19, TypeScript, Material UI, and Axios with JWT authentication.

---

## 🚀 Features

### 🔐 Authentication
- Login & Register with JWT
- Token decoded and stored securely
- Auto-logout when token expires
- Auth Provider (React Context API)

### 🛡 Role-Based Access
Admin Panel:
- Sidebar Navigation
- User Management (CRUD)
- Product Management
- Billing Management (Create, View, Print, Export)

User Panel:
- Basic dashboard for customers

---

## 📊 Admin Users Module
- MUI DataGrid table
- Pagination (10 rows/page)
- Search by Name / Email / Phone / AdminRole
- Edit User
- Delete User
- Add User
- Total user count displayed

---

## 🧩 Tech Stack
- React 19 + Vite (or CRA)
- TypeScript
- Material UI (MUI v5)
- MUI DataGrid
- Axios + Interceptors
- React Router DOM v7
- jwt-decode

---

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── axios.ts
│   │   ├── auth.ts
│   │   ├── adminUser.ts
│   │   └── adminBill.ts
│   │
│   ├── components/
│   │   ├── AppHeader.tsx
│   │   └── Admin/
│   │       ├── AdminLayout.tsx
│   │       ├── Sidebar.tsx
│   │       ├── UserTable.tsx
│   │       ├── DashboardCards.tsx
│   │       ├── BillTable.tsx
│   │       └── BillPrint.tsx
│   │
│   ├── contexts/
│   │   └── AuthProvider.tsx
│   │
│   ├── routes/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── UserHome.tsx
│   │   └── Admin/
│   │       ├── UserList.tsx
│   │       ├── UserCreate.tsx
│   │       ├── UserEdit.tsx
│   │       ├── UserDeleteDialog.tsx
│   │       ├── BillList.tsx
│   │       ├── BillCreate.tsx
│   │       └── BillView.tsx
│   │
│   ├── utils/
│   │   └── jwt.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env
├── package.json
└── README.md
```

---

## 🔧 Installation

### 1️⃣ Install dependencies
```bash
npm install
```

### 2️⃣ Environment Variables  
Create **.env** at root:

```
REACT_APP_API_BASE_URL=http://localhost:8000
```

### 3️⃣ Start Dev Server
```bash
npm start
```

---

## 🔐 API Integration (Contract)

### 1. Register
```
POST /auth/register
{
  "name": "Hariom",
  "email": "example@gmail.com",
  "password": "123456",
  "phoneNumber": "9682296756",
  "adminRole": false
}
```

### 2. Login
```
POST /auth/login
{
  "email": "example@gmail.com",
  "password": "123456"
}
```

### 3. Auth Token Format

The response must return:
```
{ "token": "<jwt>" }
```

JWT decoded fields:
```json
{
  "id": "...",
  "name": "Hariom",
  "email": "example@gmail.com",
  "phoneNumber": "9682296756",
  "adminRole": true,
  "iat": 1763215904,
  "exp": 1794751904
}
```

---

## 🧠 How Authentication Works

1. User logs in → Backend returns JWT  
2. Token stored in `localStorage` (`queues_token`)  
3. `axios.ts` automatically attaches token to every request  
4. `AuthProvider` decodes JWT to get user data  
5. Protected routes check:
   - Is token valid?
   - Is adminRole true?

---

## 🧩 Common Issues

### ❌ "jwtDecode is not a function"
Fix:
```ts
import { jwtDecode } from "jwt-decode";
```

### ❌ "Environment variable undefined"
All frontend env variables **must begin with:**
```
REACT_APP_
```

### ❌ Login returns blank user
Check LocalStorage → delete old token.

---

## ✔ Upcoming Improvements
- React Hook Form + Yup validation  
- Loading spinners  
- Notification toasts  
- Dark mode  
- Optimized dashboards  

---

## 🧾 License
Private & Proprietary — Developed exclusively for  
**Sohan Lal and Sons Jewellers**

---

## 👨‍💻 Author
**Hariom Verma**  
📧 Email: *your email*  
🌐 Website: *optional*
