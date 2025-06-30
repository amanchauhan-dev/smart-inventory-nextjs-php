import sql from '../config/db';

export interface ProductCategory {
  id: number;
  org_id: number;
  name: string;
}

// ✅ Get all categories for an org with pagination
export const getAllCategories = async (
  orgId: number,
  filters: { limit?: number; offset?: number } = {}
) => {
  const limit = filters.limit && filters.limit > 0 ? filters.limit : 50;
  const offset = filters.offset && filters.offset >= 0 ? filters.offset : 0;

  // Count
  const countRes = await sql<{ count: number }[]>`
    SELECT COUNT(id) as count
    FROM product_categories
    WHERE org_id = ${orgId}
  `;
  const count = countRes[0]?.count ?? 0;

  // Data
  const data = await sql<ProductCategory[]>`
    SELECT id, name, org_id
    FROM product_categories
    WHERE org_id = ${orgId}
    ORDER BY id DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return {
    count,
    data,
  };
};

// ✅ Find single category
export const findCategory = async (id: number, orgId: number) => {
  const category = await sql<ProductCategory[]>`
    SELECT id, name, org_id
    FROM product_categories
    WHERE id = ${id} AND org_id = ${orgId}
  `;
  return category[0];
};

// ✅ Create new category
export const createCategory = async (data: { org_id: number; name: string }) => {
  const inserted = await sql<{ id: number }[]>`
    INSERT INTO product_categories (org_id, name)
    VALUES (${data.org_id}, ${data.name})
    RETURNING id
  `;
  return findCategory(inserted[0].id, data.org_id);
};

// ✅ Update category
export const updateCategory = async (
  id: number,
  orgId: number,
  data: { name: string }
) => {
  await sql`
    UPDATE product_categories
    SET name = ${data.name}
    WHERE id = ${id} AND org_id = ${orgId}
  `;
  return findCategory(id, orgId);
};

// ✅ Delete category
export const deleteCategory = async (id: number, orgId: number) => {
  await sql`
    DELETE FROM product_categories
    WHERE id = ${id} AND org_id = ${orgId}
  `;
  return true;
};
