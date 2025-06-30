import sql from '../config/db';

export interface Expense {
    id: number;
    org_id: number;
    category_id: number;
    amount: number;
    date: string;
    notes?: string | null;
    created_at: Date;
    category?: string | null;
}

// ✅ Get all expenses
export const getAllExpenses = async (
    orgId: number,
    filters: { limit?: number; offset?: number; category_id?: number; date_from?: string; date_to?: string } = {}
) => {
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 50;
    const offset = filters.offset && filters.offset >= 0 ? filters.offset : 0;

    let where = sql`WHERE e.org_id = ${orgId}`;

    if (filters.category_id && filters.category_id > 0) {
        where = sql`${where} AND e.category_id = ${filters.category_id}`;
    }

    if (filters.date_from) {
        where = sql`${where} AND e.date >= ${filters.date_from}`;
    }

    if (filters.date_to) {
        where = sql`${where} AND e.date <= ${filters.date_to}`;
    }

    // Count
    const countRes = await sql<{ count: number }[]>`
    SELECT COUNT(e.id)::int AS count
    FROM expenses e
    JOIN expense_categories ec ON e.category_id = ec.id
    ${where}
  `;
    const count = countRes[0]?.count ?? 0;

    // Data
    const data = await sql<Expense[]>`
    SELECT 
      e.id,
      e.org_id,
      e.category_id,
      e.amount,
      e.date,
      e.notes,
      e.created_at,
      ec.name AS category
    FROM expenses e
    JOIN expense_categories ec ON e.category_id = ec.id
    ${where}
    ORDER BY e.date DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

    return { count, data };
};

// ✅ Get a single expense
export const findExpense = async (id: number, orgId: number) => {
    const result = await sql<Expense[]>`
    SELECT 
      e.id,
      e.org_id,
      e.category_id,
      e.amount,
      e.date,
      e.notes,
      e.created_at,
      ec.name AS category
    FROM expenses e
    JOIN expense_categories ec ON e.category_id = ec.id
    WHERE e.id = ${id} AND e.org_id = ${orgId}
  `;
    return result[0];
};

// ✅ Create expense
export const createExpense = async (data: {
    org_id: number;
    category_id: number;
    amount: number;
    date: string;
    notes?: string;
}) => {
    const inserted = await sql<{ id: number }[]>`
    INSERT INTO expenses (org_id, category_id, amount, date, notes)
    VALUES (
      ${data.org_id},
      ${data.category_id},
      ${data.amount},
      ${data.date},
      ${data.notes ?? null}
    )
    RETURNING id
  `;

    return findExpense(inserted[0].id, data.org_id);
};

// ✅ Update expense
export const updateExpense = async (
    id: number,
    orgId: number,
    data: {
        category_id: number;
        amount: number;
        date: string;
        notes?: string;
    }
) => {
    await sql`
    UPDATE expenses
    SET 
      category_id = ${data.category_id},
      amount = ${data.amount},
      date = ${data.date},
      notes = ${data.notes ?? null}
    WHERE id = ${id} AND org_id = ${orgId}
  `;

    return findExpense(id, orgId);
};

// ✅ Delete expense
export const deleteExpense = async (id: number, orgId: number) => {
    await sql`
    DELETE FROM expenses
    WHERE id = ${id} AND org_id = ${orgId}
  `;
    return true;
};
