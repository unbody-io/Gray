import type {NextApiRequest, NextApiResponse} from "next";
import {ApiTypes} from "@/types/api.type";

import {unbodyService} from "@/services/unbody.service";
import {getConfigsWithSiteData} from "@/lib/configs.server";

export default async function Handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiTypes.Rs.AISearchSummary<any>>
) {
    const {input, filters = []} = req.body as ApiTypes.Rq.Search;
    const {configs, siteData} = await getConfigsWithSiteData();

    if (!input) {
        return res.status(400);
    }

    if (!siteData) {
        console.error("No site data found");
        return res.status(500);
    }

    const results = await unbodyService.searchAIResponse(
        siteData,
        configs,
        input
    )

    res.status(200).json(results);
}
