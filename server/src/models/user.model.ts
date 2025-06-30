import sql from '../config/db';
import bcrypt from 'bcrypt';

// User type
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  designation?: string;
  profile?: string;
  org_id: number;
  created_at: Date;
  org_name?: string;
  org_address?: string;
}

// Common SELECT with join
const baseSelect = sql`
  SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.designation,
    u.profile,
    u.created_at,
    u.org_id,
    o.name as org_name,
    o.address as org_address
  FROM users u
  LEFT JOIN organisations o
  ON u.org_id = o.id
`;

// Get all users with filters
export const getAllUsers = async (
  orgId: number,
  filters: { limit?: number; offset?: number; search?: string; role?: string } = {}
) => {
  const limit = filters.limit && filters.limit > 0 ? filters.limit : 50;
  const offset = filters.offset && filters.offset >= 0 ? filters.offset : 0;

  let where = sql`WHERE u.org_id = ${orgId} AND u.role != 'superadmin'`;

  if (filters.search) {
    where = sql`${where} AND (u.name ILIKE ${'%' + filters.search + '%'} OR u.email ILIKE ${'%' + filters.search + '%'})`;
  }

  if (filters.role && (filters.role === 'staff' || filters.role === 'admin')) {
    where = sql`${where} AND u.role = ${filters.role}`;
  }

  // Count
  const countRes = await sql`
    SELECT COUNT(u.id)::int AS count
    FROM users u
    LEFT JOIN organisations o ON u.org_id = o.id
    ${where}
  `;
  const count = countRes[0]?.count ?? 0;

  // Data
  const users = await sql<User[]>`
    ${baseSelect}
    ${where}
    ORDER BY u.created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return { count, data: users };
};

// Find by ID
export const findUserById = async (id: number) => {
  const user = await sql<User[]>`
    ${baseSelect}
    WHERE u.id = ${id}
  `;
  return user[0];
};

// Find by email
export const findUserByEmail = async (email: string) => {
  const user = await sql<User[]>`
    SELECT * FROM users WHERE email = ${email}
  `;
  return user[0];
};

// Create
export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  org_id: number;
  designation?: string;
  role?: string;
  profile?: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const inserted = await sql<{ id: number }[]>`
    INSERT INTO users (name, email, password, org_id, designation, role, profile)
    VALUES (
      ${data.name},
      ${data.email},
      ${hashedPassword},
      ${data.org_id},
      ${data.designation ?? null},
      ${data.role ?? 'staff'},
      ${data.profile ?? null}
    )
    RETURNING id
  `;

  return findUserById(inserted[0].id);
};

// Update
export const updateUser = async (
  id: number,
  data: {
    name: string;
    email: string;
    designation?: string;
    role?: string;
    profile?: string;
  }
) => {
  await sql`
    UPDATE users
    SET 
      name = ${data.name},
      email = ${data.email},
      designation = ${data.designation ?? null},
      role = ${data.role ?? 'staff'},
      profile = ${data.profile ?? null}
    WHERE id = ${id}
  `;

  return findUserById(id);
};

// Delete
export const deleteUser = async (id: number) => {
  await sql`DELETE FROM users WHERE id = ${id}`;
  return true;
};

// Verify password
export const verifyPassword = async (email: string, plainPassword: string) => {
  const user = await findUserByEmail(email);
  if (!user) return false;

  const isValid = await bcrypt.compare(plainPassword, user.password);
  if (!isValid) return false;

  delete (user as any).password;
  return user;
};

// Update name
export const updateUserName = async (id: number, name: string) => {
  await sql`UPDATE users SET name = ${name} WHERE id = ${id}`;
  return findUserById(id);
};

// Update profile
export const updateUserProfile = async (id: number, profile: string) => {
  await sql`UPDATE users SET profile = ${profile} WHERE id = ${id}`;
  return findUserById(id);
};

// Update email
export const updateUserEmail = async (id: number, email: string) => {
  await sql`UPDATE users SET email = ${email} WHERE id = ${id}`;
  return findUserById(id);
};

// Update password
export const updateUserPassword = async (id: number, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${id}`;
  return findUserById(id);
};
