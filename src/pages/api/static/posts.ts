import type {NextApiRequest, NextApiResponse} from 'next'
import {MiniArticle, PostRef} from "@/types/data.types";
import {getConfigs} from "@/lib/configs.common";
import {ApiTypes} from "@/types/api.type";

const configs = getConfigs();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiTypes.Rs.StaticPosts | null>
) {
    if (req.method !== "POST") {
        return res.status(405).json(null);
    }

    const refs = req.body.posts as ApiTypes.Rq.StaticPosts["posts"]

    const posts: ApiTypes.Rs.StaticPosts[] = await Promise.all(
        configs.contentPlugins
            .flatMap(async (plugin) => {
                const _refs = refs.filter(f => {
                    return f.__typename === plugin.type
                });
                if (!_refs) {
                    return [];
                }
                const _posts = await plugin.cacheReader() as ApiTypes.Rs.StaticPosts;
                // @ts-ignore
                return _posts.filter((post) => _refs.find((ref) => ref[plugin.identifier] === post[plugin.identifier]));
            })
    );

    return res.status(200).json(posts.flat())
}
