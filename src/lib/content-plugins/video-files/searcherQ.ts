import {SearcherQueryFn} from "@/lib/content-plugins/handler.class";
import {SupportedContentTypes} from "@/types/plugins.types";
import {UserInputType} from "@/types/prompt.types";
import {unbody} from "@/services/unbody.service";

import {fields} from "./config";
import {GetQueryBuilder} from "@unbody-io/ts-client/build/core/query-builder";
import {IVideoFile} from "@unbody-io/ts-client/build/core/documents";

const searcherQ: SearcherQueryFn = (props) => {
    const {
        siteConfig,
        siteData,
        input,
        filters = [],
        fields: _fields,
        forceGenerate = false,
    } = props;
    const promptConfig = siteConfig.searchConfig.prompts.find(({type}) => type === SupportedContentTypes.VideoFile);
    const requiresSearch = input.requires_search;
    const isSearchOnly = input.type === UserInputType.SearchQuery;

    if (!promptConfig) {
        throw new Error("No prompt config found");
    }

    let query = unbody.get
        .videoFile
        .select(...(_fields || fields))
        .where(({Or, ContainsAny, And, Like}) => {
            let operands = [];
            operands.push({
                pathString: Like(siteData.configs.contentConfig.postsPath)
            })
            if (filters.length>0){
                operands.push(
                    Or(
                        {autoKeywords: ContainsAny(...filters)},
                        {autoTopics: ContainsAny(...filters)},
                        {autoEntities: ContainsAny(...filters)}
                    )
                )
            }
            return And(...operands);
        })

    if (requiresSearch){
        const searchQ = input.subject_topic.length > 0 ? input.subject_topic : input.concepts_key_terms;
        query = query.search.about(searchQ, {certainty: 0.6}) as GetQueryBuilder<IVideoFile>;
    }

    if (!isSearchOnly || forceGenerate) {
        const prompt = promptConfig.handler.create(siteConfig, siteData, input);
        query = query.generate.fromMany(
            prompt,
            [
                "autoSummary",
                "originalName"
            ]) as GetQueryBuilder<IVideoFile>;
    }

    return query as any;
}

export default searcherQ;
