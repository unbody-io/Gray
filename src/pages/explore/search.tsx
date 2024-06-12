import DefaultLayout from "@/layouts/default";
import {useRouter} from "next/router";

import React, {useEffect} from "react";

import {SearchResultsList} from "@/components/SearchResult.List";
import {ApiTypes} from "@/types/api.type";
import {useApiPost} from "@/services/api.service";
import {ParagraphSkeleton} from "@/components/skeletons";
import {BlogIntro} from "@/components/BlogIntro";
import {useSiteData} from "@/context/context.site-data";
import {Progress} from "@nextui-org/react";

export default function ExplorePage() {
    const {query, filters} = useRouter().query;
    const {context} = useSiteData();

    const structuredInput = useApiPost<ApiTypes.Rq.ParsedQuery, ApiTypes.Rs.ParsedQuery>(
        "/api/parse-query"
    );
    const aiResponse = useApiPost<ApiTypes.Rq.Search, ApiTypes.Rs.AISearchSummary<any>>(
        "/api/search/search-summary",
    );
    const results = useApiPost<ApiTypes.Rq.Search, ApiTypes.Rs.SearchResults>(
        '/api/search/mix'
    );

    const covertFilters = (filters: string | string[]): string[] => {
        if (!filters) {
            return [];
        }
        if (Array.isArray(filters)) {
            return filters;
        }
        return filters.split(",");
    }

    useEffect(() => {
        structuredInput.exec({
            input: query as string,
            filters: covertFilters(filters as string | string[])
        });
    }, [filters, query]);

    useEffect(() => {
        if (structuredInput.data && (query||filters)) {
            console.log("Structured Input", structuredInput.data)
            const requestPayload = {
                input: structuredInput.data,
                filters: covertFilters(filters as string | string[])
            }
            aiResponse.exec(requestPayload);
            results.exec(requestPayload);
        }
    }, [structuredInput.data]);

    return (
        <DefaultLayout>
            <div className={"pt-4"}>
                {
                    (aiResponse.isLoading || structuredInput.isLoading) ?
                        <ParagraphSkeleton/>
                        :
                        <BlogIntro entities={context.autoEntities}
                                   topics={context.autoTopics}
                                   keywords={context.autoKeywords}
                                   isStackOpen={false}
                                   summary={aiResponse.data?.summary || "No summary available"}
                        />
                }
            </div>
            {
                (results.isLoading||structuredInput.isLoading) ?
                    <Progress
                        size="sm"
                        isIndeterminate
                        aria-label="Loading..."
                        label={structuredInput.isLoading? "Understanding what you asked...": "Finding relevant results..."}
                    />
                    :
                    <SearchResultsList results={results}
                                       isQueryLoading={structuredInput.isLoading}
                    />

            }
        </DefaultLayout>
    )
}
