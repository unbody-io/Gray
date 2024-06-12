import {SearcherFn} from "@/lib/content-plugins/handler.class";

import {UserInputType} from "@/types/prompt.types";
import {SupportedContentTypes} from "@/types/plugins.types";

import {CDefaultImageBlockResponse} from "./types";

const searcher: SearcherFn<CDefaultImageBlockResponse> = async (props, query) => {
    const {
        input,
        siteConfig,
        forceGenerate
    } = props;
    const promptConfig = siteConfig
        .searchConfig
        .prompts
        .find(({type}) => type === SupportedContentTypes.ImageBlock);

    return query
        .exec()
        .then((res: CDefaultImageBlockResponse) => {
            if (input.type === UserInputType.SearchQuery && !forceGenerate) {
                return res;
            }
            return {
                ...res,
                data: {
                    ...res.data,
                    generate: {
                        // @ts-ignore
                        result: promptConfig.handler.parse(res.data.generate!.result)
                    }
                }
            }
        }) as Promise<CDefaultImageBlockResponse>;
}

export default searcher;
