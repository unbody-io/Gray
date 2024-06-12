import type {NextApiRequest, NextApiResponse} from "next";
import {ApiTypes} from "@/types/api.type";

import {unbodyService} from "@/services/unbody.service";
import {getConfigsWithSiteData} from "@/lib/configs.server";
import {ISubtitleEntry} from "@unbody-io/ts-client/build/core/documents";

export default async function Handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiTypes.Rs.AISearchSummary<ISubtitleEntry[]>>
) {
    const {input, filters = []} = req.body as ApiTypes.Rq.Search;
    const {configs, siteData} = await getConfigsWithSiteData();

    if (!input || filters.length === 0) {
        return res.status(400);
    }

    if (!siteData) {
        console.error("No site data found");
        return res.status(500);
    }

    const results = await unbodyService.searchSummaryVideo(
        {
            siteData,
            siteConfigs: configs,
            input,
            filters
        }
    )

    res.status(200).json(results);
}
