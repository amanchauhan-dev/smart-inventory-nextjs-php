import sql from '../config/db';

export interface Product {
  id: number;
  org_id: number;
  category_id: number | null;
  name: string;
  quantity: number;
  threshold: number;
  price: number;
  supplier?: string | null;
  notes?: string | null;
  created_at: Date;
  updated_at: Date;
  category?: string | null;
}

// Common SELECT with join
const baseSelect = sql`
  SELECT 
    p.id,
    p.org_id,
    p.category_id,
    p.name,
    p.quantity,
    p.threshold,
    p.price,
    p.supplier,
    p.notes,
    p.created_at,
    p.updated_at,
    pc.name as category
  FROM products p
  LEFT JOIN product_categories pc
  ON p.category_id = pc.id
`;

export const getAllProducts = async (
  orgId: number,
  filters: { limit?: number; offset?: number; category_id?: number; low_stock?: boolean; search?: string } = {}
) => {
  const limit = filters.limit && filters.limit > 0 ? filters.limit : 50;
  const offset = filters.offset && filters.offset >= 0 ? filters.offset : 0;

  let where = sql`WHERE p.org_id = ${orgId}`;

  if (filters.category_id && filters.category_id > 0) {
    where = sql`${where} AND p.category_id = ${filters.category_id}`;
  }

  if (filters.low_stock) {
    where = sql`${where} AND p.quantity <= p.threshold`;
  }

  if (filters.search) {
    const searchPattern = `%${filters.search}%`;
    where = sql`${where} AND (p.name ILIKE ${searchPattern} OR p.price::text ILIKE ${searchPattern})`;
  }

  // Count
  const countRes = await sql`
    SELECT COUNT(p.id)::int AS count
    FROM products p
    LEFT JOIN product_categories pc ON p.category_id = pc.id
    ${where}
  `;
  const count = countRes[0]?.count ?? 0;

  // Data
  const products = await sql<Product[]>`
    ${baseSelect}
    ${where}
    ORDER BY p.updated_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return { count, data: products };
};

export const findProduct = async (id: number, orgId: number) => {
  const product = await sql<Product[]>`
    ${baseSelect}
    WHERE p.id = ${id} AND p.org_id = ${orgId}
  `;
  return product[0];
};

export const createProduct = async (data: {
  org_id: number;
  category_id?: number;
  name: string;
  quantity: number;
  threshold?: number;
  price: number;
  supplier?: string;
  notes?: string;
}) => {
  const threshold = data.threshold ?? 0;

  const inserted = await sql<{ id: number }[]>`
    INSERT INTO products (org_id, category_id, name, quantity, threshold, price, supplier, notes)
    VALUES (
      ${data.org_id},
      ${data.category_id ?? null},
      ${data.name},
      ${data.quantity},
      ${threshold},
      ${data.price},
      ${data.supplier ?? null},
      ${data.notes ?? null}
    )
    RETURNING id
  `;
  return findProduct(inserted[0].id, data.org_id);
};

export const updateProduct = async (
  id: number,
  orgId: number,
  data: {
    category_id?: number;
    name: string;
    quantity: number;
    threshold?: number;
    price: number;
    supplier?: string;
    notes?: string;
  }
) => {
  const threshold = data.threshold ?? 0;

  await sql`
    UPDATE products
    SET 
      category_id = ${data.category_id ?? null},
      name = ${data.name},
      quantity = ${data.quantity},
      threshold = ${threshold},
      price = ${data.price},
      supplier = ${data.supplier ?? null},
      notes = ${data.notes ?? null},
      updated_at = NOW()
    WHERE id = ${id} AND org_id = ${orgId}
  `;

  return findProduct(id, orgId);
};

export const deleteProduct = async (id: number, orgId: number) => {
  await sql`
    DELETE FROM products
    WHERE id = ${id} AND org_id = ${orgId}
  `;
  return true;
};
