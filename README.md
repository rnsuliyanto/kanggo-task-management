# Task Management System - Kanggo Technical Test

Aplikasi Task Management System sederhana yang memungkinkan pengguna untuk mengelola tugas-tugas pribadi. Dibangun menggunakan React.js, Node.js (Express), dan MySQL dengan antarmuka bertema Neobrutalism.

## Teknologi yang Digunakan
- Frontend: React.js (Vite), Tailwind CSS
- Backend: Node.js, Express.js
- Database: MySQL
- Autentikasi: JWT & bcrypt

## Persyaratan
- Node.js
- MySQL

## Cara Menjalankan Aplikasi Lokal

### 1. Setup Database
Buat database MySQL baru dan jalankan query berikut:

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