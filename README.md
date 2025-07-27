## 🛠️ Installation & Setup Instructions

### 1. **Clone the Repository**

```bash
git clone <your-repository-url>
cd <your-repository-folder>
```

---

### 2. **Backend Setup (NestJS)**

```bash
cd backend

# Copy the environment file
cp .env.example .env

# Install dependencies
npm install

# Run database migration
npx prisma migrate dev --name init

# Seed the admin user
npx prisma db seed

# Start the backend server
npm run start:dev
```

> Backend running at: [http://localhost:3000](http://localhost:3000)

---

### 3. **Frontend Setup (React + React Router)**

```bash
cd ../frontend

# Copy the environment file
cp .env.example .env

# Install dependencies
npm install

# Start the frontend server
npm run dev
```

> Frontend running at: [http://localhost:5173](http://localhost:5173)

---

### 4. **Admin Login Access**

Use the following seeded admin credentials:

```
Username: reizalAdmin
Password: Admin1234
```

---

### 5. **API Documentation (Swagger)**

Available at: [http://localhost:3000/api](http://localhost:3000/api)