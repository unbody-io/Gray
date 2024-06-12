import {SearcherFn} from "@/lib/content-plugins/handler.class";

import {UserInputType} from "@/types/prompt.types";
import {SupportedContentTypes} from "@/types/plugins.types";

import {CDefaultTextBlockResponse} from "./types";

const searcher: SearcherFn<CDefaultTextBlockResponse> = async (props, query) => {
    const {
        input,
        siteConfig,
        forceGenerate
    } = props;
    const promptConfig = siteConfig
        .searchConfig
        .prompts
        .find(({type}) => type === SupportedContentTypes.TextBlock);

    return query
        .exec()
        .then((res: CDefaultTextBlockResponse) => {
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
        }) as Promise<CDefaultTextBlockResponse>;
}

export default searcher;
