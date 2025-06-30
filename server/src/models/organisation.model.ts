import sql from '../config/db';

export interface Organisation {
    id: number;
    name: string;
    address: string;
    created_at?: Date;
}

// Get all organisations with optional filters
export const getAllOrganisations = async (filters: { limit?: number; offset?: number } = {}) => {
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 50;
    const offset = filters.offset && filters.offset >= 0 ? filters.offset : 0;

    const organisations = await sql<Organisation[]>`
    SELECT * FROM organisations
    ORDER BY id DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
    return organisations;
};

// Find by ID
export const findOrganisationById = async (id: number) => {
    const org = await sql<Organisation[]>`
    SELECT * FROM organisations
    WHERE id = ${id}
  `;
    return org[0];
};

// Create
export const createOrganisation = async (data: { name: string; address: string }) => {
    const inserted = await sql<{ id: number }[]>`
    INSERT INTO organisations (name, address)
    VALUES (${data.name}, ${data.address})
    RETURNING id
  `;
    return findOrganisationById(inserted[0].id);
};

// Update
export const updateOrganisation = async (id: number, data: { name: string; address: string }) => {
    await sql`
    UPDATE organisations
    SET name = ${data.name}, address = ${data.address}
    WHERE id = ${id}
  `;
    return findOrganisationById(id);
};

// Delete
export const deleteOrganisation = async (id: number) => {
    await sql`
    DELETE FROM organisations
    WHERE id = ${id}
  `;
    return true;
};
