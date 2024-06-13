import {SearcherQueryFn} from "@/lib/content-plugins/handler.class";
import {SupportedContentTypes} from "@/types/plugins.types";
import {UserInputType} from "@/types/prompt.types";
import {unbody} from "@/services/unbody.service";

import {fields} from "./config";
import {GetQueryBuilder} from "@unbody-io/ts-client/build/core/query-builder";

const searcherQ: SearcherQueryFn = (props) => {
    const {
        siteConfig,
        siteData,
        input,
        filters = [],
        fields: _fields,
        forceGenerate = false,
    } = props;

    const promptConfig = siteConfig.searchConfig.prompts.find(({type}) => type === SupportedContentTypes.TextBlock);
    const requiresSearch = input.requires_search;
    const isSearchOnly = input.type === UserInputType.SearchQuery;

    if (!promptConfig) {
        throw new Error("No prompt config found");
    }

    let query = unbody.get
        .textBlock
        .select(...(_fields || fields))
        .where(({Like, And, NotEqual}) => {
            return And(
                {
                    document:{
                        GoogleDoc: {
                            pathString: Like(siteData.configs.contentConfig.postsPath)
                        }
                    }
                },
                {
                    tagName: NotEqual("h1"),
                },
                {
                    tagName: NotEqual("h2"),
                },
                {
                    tagName: NotEqual("h3"),
                },
                {
                    tagName: NotEqual("h4"),
                },
                {
                    tagName: NotEqual("h5"),
                },
                {
                    tagName: NotEqual("h6"),
                }
            )
        })


    if (requiresSearch){
        const searchQ = input.subject_topic.length > 0 ? input.subject_topic : input.concepts_key_terms;
        const q = [
            searchQ,
            ...filters
        ].join(",");

        query = query.search.about(q, {certainty: 0.65}) as GetQueryBuilder<any>;
    }else if (filters.length > 0){
        query = query.search.about(filters, {certainty: 0.65}) as GetQueryBuilder<any>;
    }

    if (!isSearchOnly || forceGenerate) {
        const prompt = promptConfig.handler.create(siteConfig, siteData, input);
        query = query.generate.fromMany(
            prompt,
            [
                "html",
                "tagName",
            ]) as GetQueryBuilder<any>;
    }

    return query as any;
}

export default searcherQ;
