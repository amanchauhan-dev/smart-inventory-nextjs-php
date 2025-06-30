import sql from '../config/db';

export interface IncomeCategory {
    id: number;
    org_id: number;
    name: string;
}

// ✅ Get all categories
export const getAllIncomeCategories = async (
    orgId: number,
    filters: { limit?: number; offset?: number } = {}
) => {
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 50;
    const offset = filters.offset && filters.offset >= 0 ? filters.offset : 0;

    // Count
    const countRes = await sql<{ count: number }[]>`
    SELECT COUNT(id)::int AS count
    FROM incomes_categories
    WHERE org_id = ${orgId}
  `;
    const count = countRes[0]?.count ?? 0;

    // Data
    const categories = await sql<IncomeCategory[]>`
    SELECT id, org_id, name
    FROM incomes_categories
    WHERE org_id = ${orgId}
    LIMIT ${limit}
    OFFSET ${offset}
  `;

    return { data: categories, count };
};

// ✅ Get one category by id
export const findIncomeCategory = async (id: number, orgId: number) => {
    const category = await sql<IncomeCategory[]>`
    SELECT id, org_id, name
    FROM incomes_categories
    WHERE id = ${id} AND org_id = ${orgId}
  `;
    return category[0];
};

// ✅ Create category
export const createIncomeCategory = async (data: { org_id: number; name: string }) => {
    const inserted = await sql<{ id: number }[]>`
    INSERT INTO incomes_categories (org_id, name)
    VALUES (${data.org_id}, ${data.name})
    RETURNING id
  `;
    return findIncomeCategory(inserted[0].id, data.org_id);
};

// ✅ Update category
export const updateIncomeCategory = async (id: number, orgId: number, data: { name: string }) => {
    await sql`
    UPDATE incomes_categories
    SET name = ${data.name}
    WHERE id = ${id} AND org_id = ${orgId}
  `;
    return findIncomeCategory(id, orgId);
};

// ✅ Delete category
export const deleteIncomeCategory = async (id: number, orgId: number) => {
    await sql`
    DELETE FROM incomes_categories
    WHERE id = ${id} AND org_id = ${orgId}
  `;
    return true;
};
