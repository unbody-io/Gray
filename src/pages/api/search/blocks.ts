import type { NextApiRequest, NextApiResponse } from 'next';
import { unbodyService } from '@/services/unbody.service';
import { getQueryContext, isQueryEmpty } from '@/utils/query.utils';
import { MiniArticle } from '@/types/data.types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<MiniArticle[] | null>
) {
    const context = getQueryContext(req.query);
    const q = req.query.query as string;

    if (isQueryEmpty(q) && context.length === 0) {
        return res.status(400).json(null);
    }

    console.log(
        '/api/search/blocks',
        q,
        req.query.entities,
        req.query.topics,
        req.query.keywords
    );

    res.status(200).json(
        await unbodyService.searchAboutOnTextBlocks(
            [...(context || []).map((c) => c.value as string), q as string],
            // @ts-ignore
            ['order', 'html', 'document.GoogleDoc.slug', 'document.GoogleDoc.title']
        )
    );
}
