import type {NextApiRequest, NextApiResponse} from 'next'
import {unbodyService} from "@/services/unbody.service";
import {MiniTextBlock} from "@/types/data.types";
import {isQueryEmpty} from "@/utils/query.utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<MiniTextBlock|null>
) {
    const q = req.query.query as string;

    if (isQueryEmpty(q)) {
        return res.status(400).json(null);
    }

    const answer = await unbodyService.askOnTextBlocks<MiniTextBlock>(req.query.query as string)
    res.status(200).json(answer)
}
