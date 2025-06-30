export const data = `
## Smart Inventory & Budget Management System Reference Document (Schema-Based)

### Project Overview

The **Smart Inventory & Budget Management System** is a comprehensive platform designed to help organizations efficiently manage products, expenses, and incomes, while tracking budgets and ensuring financial transparency. The system supports multiple organizations, each with their own inventory and budget data.

---

### Core Entities and Tables

#### Organisations

- Stores basic organization info.
- Columns: id, name, address, created_at.
- All other data (users, products, expenses, incomes) is linked to an organisation.

---

#### Users

- Columns: id, name, profile, email, role, designation, password, org_id, created_at.
- Roles: \`staff\`, \`admin\`, \`superadmin\`.
- Each user belongs to one organisation.
- Admins and superadmins can manage users, budgets, and inventory.

---

#### Product Categories & Products

- **product_categories**: Manage categories for organizing products (e.g., Electronics, Furniture).
- **products**:
  - Columns: id, org_id, category_id, name, quantity, threshold, price, supplier, notes, created_at, updated_at.
  - Supports low-stock threshold for automatic alerts.
  - Tracks quantity and price per item.

---

#### Expense Categories & Expenses

- **expense_categories**: Define spending categories (e.g., Office Supplies, Maintenance) with optional monthly limits.
- **expenses**:
  - Columns: id, org_id, category_id, amount, date, notes, created_at.
  - Linked to expense_categories.
  - Supports tracking and enforcing category-level monthly limits.

---

#### Income Categories & Incomes

- **incomes_categories**: Define income categories (e.g., Sales, Donations).
- **incomes**:
  - Columns: id, org_id, amount, date, category_id, notes, created_at.
  - Linked to incomes_categories.
  - Supports income tracking per category.

---

### Core Features

1. **Multi-Org & Multi-User Support**
2. Each organisation has isolated data.
3. Role-based access ensures only authorized actions.

---

4. **Inventory Management**
5. Track products, monitor stock levels, set reorder thresholds.
6. Categories help organize products clearly.

---

7. **Expense Tracking**
8. Register expenses per category and date.
9. Set monthly limits to control overspending.
10. Monitor and audit expenditures by department.

---

11. **Income Tracking**
12. Register and categorize income sources.
13. Compare expected vs actual income trends.

---

14. **Budget Insights & Reports**
15. View total expenses, incomes, and net budgets per organisation.
16. Export reports in CSV, Excel, and PDF formats.

---

17. **Audit Trails**
18. Timestamp columns track when records are created and updated.

---

### Permissions Example

- **Staff**: Can view products and budgets, limited update capabilities.
- **Admin**: Can manage users, products, expenses, and incomes for their organisation.
- **Superadmin**: Full system access across all organisations.

---

### Alerts and Notifications

- Low-stock alerts when product quantity <= threshold.
- Notifications on budget limit breaches.

---

### Technology Stack

- **Frontend:** React / Next.js with Tailwind CSS
- **Backend:** Express.js with Prisma ORM
- **Database:** PostgreSQL (schema aligned as above)
- **Authentication:** JWT-based authentication & role-based access
- **File Storage:** Cloudinary or S3 (for optional product documents or invoices)

---

### How to Add a New Product

1. Navigate to "Products" > "Add".
2. Fill in product details: name, category, quantity, threshold, price, supplier, notes.
3. Add to register product. Alerts will be set up automatically if below threshold.

---

### How to Record an Expense

1. Go to "Expenses" section.
2. Select expense category and enter amount, date, and notes.
3. Save. System updates spending and compares to monthly limits.

---

### How to Record Income

1. Go to "Incomes" section.
2. Choose income category, enter amount, date, and notes.
3. Save. System updates overall financial summary.

---

### Frequently Asked Questions (FAQ)

Q1: Who can add or update products?
Admins and staff users within an organisation can add or update products.

Q2: How are expense limits enforced?
Limits are set in expense_categories. System automatically warns if you exceed.

Q3: Can I get reports for my organisation?
Yes, admins can export detailed reports.

Q4: Can I track supplier details?
Yes, each product record supports supplier info.

Q5: Is the system secure?
Yes, it uses JWT authentication, strict role-based permissions, and audit logs.

---
`
export const TrainingAIPublicData = [
    {
        role: 'user',
        parts: [
            {
                text: `
You are InvBudgetBot, a helpful and knowledgeable assistant of the Smart Inventory & Budget Management System.

Your responsibilities:
- Help users understand and manage products, expenses, incomes, and budgets.
- Provide guidance on adding inventory, tracking expenses, and generating reports.
- Speak in a polite, professional, and clear tone.
- If a user asks something irrelevant, kindly redirect them.

Use the reference document below as your knowledge base.

Do not say you're an AI model — say you're InvBudgetBot assistant of the Smart Inventory & Budget Management System.
      `.trim()
            }
        ]
    },
    {
        role: 'user',
        parts: [{ text: `Here is the reference document:\n\n${data}` }]
    }
]
