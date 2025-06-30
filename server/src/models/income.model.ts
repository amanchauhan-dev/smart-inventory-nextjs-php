import sql from '../config/db';

export interface Income {
  id: number;
  org_id: number;
  amount: number;
  date: string; // Can also be Date type depending on how you parse
  category_id?: number | null;
  notes?: string | null;
  created_at: Date;
  category?: string | null;
}

// ✅ Get all incomes
export const getAllIncomes = async (
  orgId: number,
  filters: { limit?: number; offset?: number; category_id?: number; date_from?: string; date_to?: string } = {}
) => {
  const limit = filters.limit && filters.limit > 0 ? filters.limit : 50;
  const offset = filters.offset && filters.offset >= 0 ? filters.offset : 0;

  let where = sql`WHERE i.org_id = ${orgId}`;

  if (filters.category_id && filters.category_id > 0) {
    where = sql`${where} AND i.category_id = ${filters.category_id}`;
  }

  if (filters.date_from) {
    where = sql`${where} AND i.date >= ${filters.date_from}`;
  }

  if (filters.date_to) {
    where = sql`${where} AND i.date <= ${filters.date_to}`;
  }

  // Count
  const countRes = await sql<{ count: number }[]>`
    SELECT COUNT(i.id)::int AS count
    FROM incomes i
    ${where}
  `;
  const count = countRes[0]?.count ?? 0;

  // Data
  const incomes = await sql<Income[]>`
    SELECT 
      i.id,
      i.org_id,
      i.amount,
      i.date,
      i.category_id,
      i.notes,
      i.created_at,
      c.name as category
    FROM incomes i
    LEFT JOIN incomes_categories c ON i.category_id = c.id
    ${where}
    ORDER BY i.date DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return { count, data: incomes };
};

// ✅ Find one income
export const findIncome = async (id: number, orgId: number) => {
  const income = await sql<Income[]>`
    SELECT 
      i.id,
      i.org_id,
      i.amount,
      i.date,
      i.category_id,
      i.notes,
      i.created_at,
      c.name as category
    FROM incomes i
    LEFT JOIN incomes_categories c ON i.category_id = c.id
    WHERE i.id = ${id} AND i.org_id = ${orgId}
  `;
  return income[0];
};

// ✅ Create
export const createIncome = async (data: {
  org_id: number;
  amount: number;
  date: string;
  category_id?: number;
  notes?: string;
}) => {
  const inserted = await sql<{ id: number }[]>`
    INSERT INTO incomes (org_id, amount, date, category_id, notes)
    VALUES (
      ${data.org_id},
      ${data.amount},
      ${data.date},
      ${data.category_id ?? null},
      ${data.notes ?? null}
    )
    RETURNING id
  `;

  return findIncome(inserted[0].id, data.org_id);
};

// ✅ Update
export const updateIncome = async (
  id: number,
  orgId: number,
  data: {
    category_id?: number;
    amount: number;
    date: string;
    notes?: string;
  }
) => {
  await sql`
    UPDATE incomes
    SET 
      category_id = ${data.category_id ?? null},
      amount = ${data.amount},
      date = ${data.date},
      notes = ${data.notes ?? null}
    WHERE id = ${id} AND org_id = ${orgId}
  `;

  return findIncome(id, orgId);
};

// ✅ Delete
export const deleteIncome = async (id: number, orgId: number) => {
  await sql`
    DELETE FROM incomes
    WHERE id = ${id} AND org_id = ${orgId}
  `;
  return true;
};
