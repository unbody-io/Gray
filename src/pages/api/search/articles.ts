import type {NextApiRequest, NextApiResponse} from 'next'
import {unbodyService} from "@/services/unbody.service";
import {getQueryContext, isQueryEmpty} from "@/utils/query.utils";
import {MiniArticle} from "@/types/data.types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<MiniArticle[] | null>
) {
    const context = getQueryContext(req.query);
    const q = req.query.query as string;

    if (isQueryEmpty(q) && context.length === 0) {
        return res.status(400).json(null);
    }

    const resolveKey = (key: string|string[]): string[] => {
        return Array.isArray(key) ? key : key.split(",");
    }

    res.status(200).json(
        await unbodyService.searchAboutOnGoogleDocs(
            q,
            resolveKey(req.query.entities||[]),
            resolveKey(req.query.topics||[]),
            resolveKey(req.query.keywords||[]),
            undefined
        )
    );
}
