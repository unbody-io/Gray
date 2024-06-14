import React, {PropsWithChildren, useMemo} from "react";
import {UseApiHook} from "@/services/api.service";
import {ApiTypes} from "@/types/api.type";
import {useSiteData} from "@/context/context.site-data";
import {SupportedContentTypes} from "@/types/plugins.types";
import {EnhancedTextBlock} from "@/types/custom.type";
import {IImageBlock} from "@unbody-io/ts-client/build/core/documents";
import {Progress} from "@nextui-org/react";

type ListProps = {
    onOpen?: (index: number) => void
    onClosed?: () => void
    results: UseApiHook<any, ApiTypes.Rs.SearchResults>
    isQueryLoading: boolean
} & PropsWithChildren<{}>

type Block = (EnhancedTextBlock | IImageBlock);

type PostsListProps = {
    posts: ApiTypes.Rs.SearchResults
    refBlocks: Block[]
}

export const PostsList = ({posts, refBlocks}: PostsListProps) => {
    const {components, configs: {plugins}} = useSiteData();
    return (
        <div className={"flex flex-col gap-8"}>
            {
                posts
                    .filter(result => (
                        result.type in components.perContentType
                    ))
                    .map((result, i) => {
                        const component = components.perContentType[result.type];
                        const plugin = plugins.find(plugin => plugin.type === result.type);

                        const ListComponent = component.list.component
                        const CardComponent = component.card.component;
                        const CardWithRefsComponent = component.card_with_refs.component;

                        if (!(ListComponent && (CardComponent || CardWithRefsComponent)) || !plugin) {
                            console.error(`List or Card component not found for type: ${result.type}`);
                            return null;
                        }

                        // TODO we need to handle the component.list.loading state here
                        return (
                            <ListComponent key={i}
                                           label={plugin?.label}
                            >
                                {
                                    result.data.map((data, j) => {
                                        if (CardWithRefsComponent) {
                                            return (
                                                <CardWithRefsComponent key={j}
                                                                       data={data}
                                                                       postRefs={refBlocks.filter(b => {
                                                                           // @ts-ignore
                                                                           return (
                                                                               // @ts-ignore
                                                                               b.document[0][plugin.identifier] === data[plugin.identifier]
                                                                           )
                                                                       })}
                                                />
                                            )
                                        }else if (CardComponent) {
                                            return (
                                                <CardComponent key={j}
                                                               data={data}
                                                />
                                            )
                                        }
                                    })
                                }
                            </ListComponent>
                        )
                    })
            }
        </div>
    )
}

export const SearchResultsList = ({results, isQueryLoading}: ListProps) => {
    const {configs: {plugins}} = useSiteData();

    if (results.isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    if (results.error) {
        return (
            <div>
                Error
            </div>
        )
    }

    if (!results.data || results.data.length === 0) {
        return (
            <div>
                No search results found
            </div>
        )
    }

    const {posts, refBlocks}: {
        posts: ApiTypes.Rs.SearchResults,
        refBlocks: Block[]
    } = useMemo(() => {
        const _refBlocks: Block[] = [];
        let _refBlocksIds: string[] = [];

        results.data?.forEach(resultsPerContentType => {
            if (
                (
                    resultsPerContentType.type === SupportedContentTypes.ImageBlock
                    || resultsPerContentType.type === SupportedContentTypes.TextBlock
                )
                && resultsPerContentType.data.length > 0
            ) {
                resultsPerContentType.data.forEach(block => {
                    const isRef = results.data!.some((p) => {
                        // because one type can not be a ref to its own type
                        if (p.type === resultsPerContentType.type) return false;

                        const plugin = plugins.find(pl => pl.type === p.type);
                        return p.data.some(d => {
                            // @ts-ignore
                            return d[plugin?.identifier] === block.document[0][plugin?.identifier]
                        })
                    });
                    if (isRef) {
                        _refBlocks.push(block as Block);
                        // @ts-ignore
                        _refBlocksIds.push(block.document[0].id);
                    }
                })
            }
        });


        const posts = results.data?.filter(r => {
            const plugin = plugins.find(pl => pl.type === r.type);
            return (
                r.data.length > 0
                && !r.data.some(d => {
                    // @ts-ignore
                    return _refBlocksIds.includes(d[plugin?.identifier])
                })
            )
        }) as ApiTypes.Rs.SearchResults;

        return {posts, refBlocks: _refBlocks};
    }, [results.data]);

    return (
        <div className={"flex flex-col gap-8"}>
            <PostsList posts={posts}
                       refBlocks={refBlocks}
            />
        </div>
    )
}
