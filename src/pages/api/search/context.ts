import type { NextApiRequest, NextApiResponse } from 'next';
import { unbodyService } from '@/services/unbody.service';
import { getQueryContext, isQueryEmpty } from '@/utils/query.utils';
import { SearchContextResponse } from '@/types/data.types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SearchContextResponse | null>
) {
    const context = getQueryContext(req.query);
    const q = req.query.query as string;

    if (isQueryEmpty(q) && context.length === 0) {
        return res.status(400).json(null);
    }

    res.status(200).json(await unbodyService.generateSearchContext(context, q as string));
}
