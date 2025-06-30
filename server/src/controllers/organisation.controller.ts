import { Request, Response } from 'express';
import * as Organisation from '../models/organisation.model';
import { sendResponse } from '../utils/response';

export class OrganisationController {

    static async update(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        const { name, address } = req.body;
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }
        const organisation = await Organisation.updateOrganisation(orgId, {
            name,
            address
        });

        return sendResponse(res, {
            status: 200,
            message: 'Data updated.',
            data: { organisation },
        });
    }
}
