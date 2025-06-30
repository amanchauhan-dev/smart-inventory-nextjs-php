import sql from '../config/db';

export interface ExpenseCategory {
    id: number;
    org_id: number;
    name: string;
    monthly_limit: number;
}

// ✅ Get all expense categories
export const getAllExpenseCategories = async (
    orgId: number,
    filters: { limit?: number; offset?: number } = {}
) => {
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 50;
    const offset = filters.offset && filters.offset >= 0 ? filters.offset : 0;

    // Count
    const countRes = await sql<{ count: number }[]>`
    SELECT COUNT(id)::int AS count
    FROM expense_categories
    WHERE org_id = ${orgId}
  `;
    const count = countRes[0]?.count ?? 0;

    // Data
    const data = await sql<ExpenseCategory[]>`
    SELECT id, org_id, name, monthly_limit
    FROM expense_categories
    WHERE org_id = ${orgId}
    ORDER BY id DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

    return { count, data };
};

// ✅ Get a single expense category
export const findExpenseCategory = async (id: number, orgId: number) => {
    const result = await sql<ExpenseCategory[]>`
    SELECT id, org_id, name, monthly_limit
    FROM expense_categories
    WHERE id = ${id} AND org_id = ${orgId}
  `;
    return result[0];
};

// ✅ Create a new expense category
export const createExpenseCategory = async (data: {
    org_id: number;
    name: string;
    monthly_limit?: number;
}) => {
    const inserted = await sql<{ id: number }[]>`
    INSERT INTO expense_categories (org_id, name, monthly_limit)
    VALUES (
      ${data.org_id},
      ${data.name},
      ${data.monthly_limit ?? 0}
    )
    RETURNING id
  `;

    return findExpenseCategory(inserted[0].id, data.org_id);
};

// ✅ Update an expense category
export const updateExpenseCategory = async (
    id: number,
    orgId: number,
    data: {
        name: string;
        monthly_limit?: number;
    }
) => {
    await sql`
    UPDATE expense_categories
    SET name = ${data.name}, monthly_limit = ${data.monthly_limit ?? 0}
    WHERE id = ${id} AND org_id = ${orgId}
  `;

    return findExpenseCategory(id, orgId);
};

// ✅ Delete an expense category
export const deleteExpenseCategory = async (id: number, orgId: number) => {
    await sql`
    DELETE FROM expense_categories
    WHERE id = ${id} AND org_id = ${orgId}
  `;
    return true;
};
