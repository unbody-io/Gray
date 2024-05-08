import type { NextApiRequest, NextApiResponse } from 'next';
import { unbodyService } from '@/services/unbody.service';
import { getQueryContext } from '@/utils/query.utils';
import { ReadPageResponse } from '@/types/data.types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ data: ReadPageResponse | null }>
) {
    const context = getQueryContext(req.query);
    const q = req.query.query as string;
    const { prevPages } = req.body;

    res.status(200).json({
        data: await unbodyService.generateReadPage(context, prevPages, q)
    });
}
