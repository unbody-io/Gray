import {SearcherFn} from "@/lib/content-plugins/handler.class";
import {UserInputType} from "@/types/prompt.types";

import {CDefaultGDocResponse} from "./types";
import {SupportedContentTypes} from "@/types/plugins.types";

const searcher: SearcherFn<CDefaultGDocResponse> = async (props, query) => {
    const {
        input,
        siteConfig,
        forceGenerate
    } = props;
    const promptConfig = siteConfig.searchConfig.prompts.find(({type}) => type === SupportedContentTypes.GoogleDoc);

    return query
        .exec()
        .then((res: CDefaultGDocResponse) => {
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
        }) as Promise<CDefaultGDocResponse>;
}

export default searcher;
