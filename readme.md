# 🧠 Smart Inventory – Full Stack App

Smart Inventory is a full-featured budgeting and inventory management system designed to help individuals and businesses manage **expenses**, **income**, **budgets**, and **product stock** from a centralized platform.

This project includes:
- ✅ **Frontend**: Built with **Next.js**, **Tailwind CSS**, and **Recharts**
- ✅ **Backend**: REST API using **PHP + MySQL**, with support for budget tracking, category grouping, and product stock management

---

## 📸 Features

### 💰 Budget & Expense Management
- Add income and expenses with category-based grouping
- Monthly budget limits with usage and alerts
- Trend graphs and reports

### 📦 Inventory Management
- Product CRUD operations
- Stock tracking and low-stock alerts
- Filter by category, search with debounce

### 🧑‍💼 User System
- Secure login & registration
- Per-user data isolation

### 📊 Dashboard
- Total orders, products, users
- Graphs (Pie/Bar/Area) for category usage, budget, inventory status

---

## ⚙️ Tech Stack

### 🖥 Frontend
- **Next.js** (App Router)
- **Tailwind CSS** for styling
- **Recharts** for charting
- **Lucide Icons** + **shadcn/ui** components

### 🔙 Backend
- **PHP** (Vanilla or Slim/Laravel if extended)
- **MySQL** / **MariaDB**
- **JWT Auth** (optional)
- REST API following standard conventions

---

## 📁 Project Structure

smart-inventory/
│
├── frontend/ # Next.js + Tailwind UI
│ ├── app/
│ ├── components/
│ ├── services/
│ └── ...
│
├── backend/ # PHP REST API
│ ├── handlers/
│ ├── models/
│ ├── routes/
│ ├── db.php
│ └── index.php
│
├── .env.example # Environment template
├── README.md # Full project overview (you are here)
└── LICENSE

---

## 🚀 Getting Started

### 📦 1. Clone the Repo

```bash
git clone https://github.com/your-username/smart-inventory.git
cd smart-inventory

```

### 🧑‍🎨 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit API URL in .env.local
npm run dev

```

### 🛠️ 3. Backend Setup (PHP)

```bash
cd backend
# Make sure you have PHP, Composer and MySQL
# Import database schema (from db/schema.sql or migrations)
# Configure database in db.php or .env (if used)
php -S localhost:8000


```