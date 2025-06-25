To support the **Smart Inventory & Budget Manager** project from your **Next.js frontend**, you'll need a clean set of **RESTful API endpoints** to interact with the MySQL database and cover all features.

---

## ✅ Full API List You’ll Need

I'll divide them by **feature group** based on your project description.

---

### 🔐 Auth APIs

| Method | Endpoint        | Description              |
| ------ | --------------- | ------------------------ |
| POST   | `/api/register` | Create a new user        |
| POST   | `/api/login`    | Login & return JWT token |
| GET    | `/api/me`       | Get current user profile |

---

### 📊 1. Dashboard APIs

| Method | Endpoint         | Description                                |
| ------ | ---------------- | ------------------------------------------ |
| GET    | `/api/dashboard` | ✅ Summary: total income, expenses, balance |
| GET    | `/api/alerts`    | ✅ Budget warnings & low stock alerts       |

---

### 💸 2. Income & Expense APIs

#### 💰 Income

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| GET    | `/api/incomes`     | List all incomes |
| POST   | `/api/incomes`     | Add new income   |
| PUT    | `/api/incomes/:id` | Update income    |
| DELETE | `/api/incomes/:id` | Delete income    |

#### 🧾 Expense

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/expenses`     | List all expenses |
| POST   | `/api/expenses`     | Add new expense   |
| PUT    | `/api/expenses/:id` | Update expense    |
| DELETE | `/api/expenses/:id` | Delete expense    |

#### 📂 Expense Categories

| Method | Endpoint                      | Description                 |
| ------ | ----------------------------- | --------------------------- |
| GET    | `/api/expense-categories`     | List categories with limits |
| POST   | `/api/expense-categories`     | Create new category         |
| PUT    | `/api/expense-categories/:id` | Update name or limit        |
| DELETE | `/api/expense-categories/:id` | Remove category             |

---

### 📦 3. Inventory APIs

#### 📁 Product Categories

| Method | Endpoint                      | Description             |
| ------ | ----------------------------- | ----------------------- |
| GET    | `/api/product-categories`     | List product categories |
| POST   | `/api/product-categories`     | Create product category |
| PUT    | `/api/product-categories/:id` | Update category         |
| DELETE | `/api/product-categories/:id` | Delete category         |

#### 📦 Products

| Method | Endpoint            | Description                     |
| ------ | ------------------- | ------------------------------- |
| GET    | `/api/products`     | List products (all or filtered) |
| POST   | `/api/products`     | Add a product                   |
| PUT    | `/api/products/:id` | Update product                  |
| DELETE | `/api/products/:id` | Delete product                  |

> ⚠️ Support query params: `?low_stock=true`, `?category=Electronics`

---

### 📑 4. Reports & Export APIs

| Method | Endpoint                    | Description                       |
| ------ | --------------------------- | --------------------------------- |
| GET    | `/api/report/summary`       | Budget summary by category (JSON) |
| GET    | `/api/report/expenses.csv`  | CSV export of all expenses        |
| GET    | `/api/report/inventory.csv` | CSV export of inventory status    |

---

### 🔍 Filters Support (via Query Params)

For both `/api/expenses` and `/api/products`, support:

```http
GET /api/expenses?category=Rent&date_from=2024-01-01&date_to=2024-06-01

GET /api/products?low_stock=true&category=Drinks
```

---

## 🧠 Summary

You’ll need \~30 endpoints covering:

* **Auth**: register/login
* **Dashboard**: real-time summary + alerts
* **Income/Expenses**: full CRUD + categories
* **Inventory**: full CRUD + categories + threshold alert
* **Reports**: CSV export & filters

---

## ✅ Next Steps

Would you like me to:

* Generate all the **endpoint structure in PHP (router + controller)**?
* Give you **Postman Collection** to test them?
* Add **JWT auth middleware** to protect them?

Let me know what you'd like to build first from here!
