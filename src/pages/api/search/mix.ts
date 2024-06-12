import type {NextApiRequest, NextApiResponse} from 'next'
import {unbodyService} from "@/services/unbody.service";
import {ApiTypes} from "@/types/api.type";
import {
    EnhancedGDoc,
    EnhancedImageBlock,
    EnhancedTextBlock,
    EnhancedVideoFile,
} from "@/types/custom.type";
import {getConfigsWithSiteData} from "@/lib/configs.server";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiTypes.Rs.SearchResults | null>
) {

    const {input, filters = [], types = []} = req.body as ApiTypes.Rq.Search;
    const {configs, siteData} = await getConfigsWithSiteData();

    if (!input) {
        return res.status(400).json(null);
    }

    const posts: Array<EnhancedVideoFile|EnhancedGDoc|EnhancedTextBlock|EnhancedImageBlock> =
        await Promise.all(
            configs.contentPlugins
                .filter((p) => {
                    if (types.length === 0) {
                        return true;
                    }
                    return types.includes(p.type);
                })
                .map(async (plugin) => plugin.cacheReader())
        ).then((results) => results.flat());

    const notEnhancedPosts = await unbodyService.searchAboutMixed({
        siteData,
        siteConfig: configs,
        input,
        filters
    });

    const enhancedPosts = notEnhancedPosts.map(({type, data}) => {
        const plugin = configs.contentPlugins.find((plugin) => plugin.configs.type === type);
        if (!plugin) {
            return {type, data}
        }
        return {
            type,
            data: data.map((post) => {
                // @ts-ignore
                const enhancedPost = posts.find(p => p[plugin.identifier] === post[plugin.identifier]);
                return enhancedPost || post;
            })
        };
    });

    res.status(200).json(
        enhancedPosts as ApiTypes.Rs.SearchResults
    );
}
