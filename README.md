# Task Management System - Kanggo Technical Test

Aplikasi ini dibangun dengan semangat #JuaraVibeCoding.

Aplikasi Task Management System sederhana yang memungkinkan pengguna untuk mengelola tugas-tugas pribadi. Dibangun menggunakan React.js, Node.js (Express), dan MySQL dengan antarmuka bertema Neobrutalism.

## Fitur
- Autentikasi (Register & Login) dengan JWT
- CRUD Tugas (Create, Read, Update, Delete)
- Filter berdasarkan status
- Pencarian tugas (Live Search)
- Pagination halaman tugas
- Validasi input di Frontend dan Backend

## Teknologi yang Digunakan
- Frontend: React.js (Vite), Tailwind CSS v3
- Backend: Node.js, Express.js
- Database: MySQL
- Autentikasi: JWT & bcrypt

## Persyaratan Sistem
- Node.js
- MySQL

## Petunjuk Menjalankan Backend

### 1. Setup Database
Buat database MySQL baru dan jalankan query berikut untuk membuat struktur tabel:

```sql
CREATE DATABASE task_management;
USE task_management;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in-progress', 'done') DEFAULT 'pending',
    deadline DATE,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2. Install Dependencies
Buka terminal, masuk ke folder backend, dan instal dependensi:

```bash
cd backend
npm install
```

### 3. Setup Environment Variables
Buat file bernama .env di dalam folder backend dan isi dengan konfigurasi berikut:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=task_management
JWT_SECRET=rahasia_jwt_super_aman
```

### 4. Menjalankan Server Backend
Jalankan perintah ini untuk menyalakan server:

```bash
npm run dev
```

### 5. Menjalankan Unit Test
Jalankan perintah ini di dalam folder backend untuk melakukan pengetesan middleware autentikasi:

```bash
npm run test
```

## Petunjuk Menjalankan Frontend

### 1. Install Dependencies
Buka terminal baru, masuk ke folder frontend, dan instal dependensi:

```bash
cd frontend
npm install
```

### 2. Menjalankan Server Frontend
Jalankan perintah ini untuk menyalakan antarmuka aplikasi:

```bash
npm run dev
```

Buka browser dan akses URL yang muncul di terminal.
