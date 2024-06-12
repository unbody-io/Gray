import React from "react";
import {Category, ContentBlock, PostRef} from "@/types/data.types";
import {Article_CARD_HEIGHT} from "@/config/ui.config";
import {CategoryHeadCard} from "@/components/CategoryCard.Header";
import {CardStack} from "@/components/CardStack";
import {BlockList} from "@/components/explore/Search.RelatedBlocks";
import {SWRResponse} from "swr";
import {SupportedContentTypes} from "@/types/plugins.types";
import {useApiPost} from "@/services/api.service";
import {useSiteData} from "@/context/context.site-data";
import {EnhancedGDoc, EnhancedVideoFile} from "@/types/custom.type";
import DefaultCard from "@/components/defaults/Defaults.Card";
import DefaultsVideoCardBody from "@/components/defaults/Defaults.VideoCard.Body";
import DefaultsArticleCardBody from "@/components/defaults/Defaults.ArticleCard.Body";
import {ApiTypes} from "@/types/api.type";
import {UserInputType} from "@/types/prompt.types";

type Props = {
    data: Category
    onOpen?: () => void
    openIndex: number
    index: number
    delay?: number
}

export const CategoryCardStack = (props: Props) => {
    const {
        data: {items, entities, topics, title},
        onOpen,
        openIndex = -1,
        index,
        delay = 1000
    } = props;
    const isOneOfStacksOpen = openIndex > -1;
    const isOpen = openIndex === index;

    const {configs: {plugins}} = useSiteData();

    const posts = useApiPost<ApiTypes.Rq.StaticPosts, ApiTypes.Rs.StaticPosts>(`/api/static/posts`, false);
    const blocks = useApiPost<ApiTypes.Rq.Search, ApiTypes.Rs.SearchResults>(`/api/search/mix`, false);

    const onStackClicked = () => {
        if (onOpen) {
            // Only toggle if either no stack is open or the clicked stack is already open
            if (!isOneOfStacksOpen || index === openIndex) {
                onOpen();

                posts.exec({
                    posts: items
                })
                blocks.exec({
                    input: {
                        type: UserInputType.SearchQuery,
                        subject_topic: [
                            ...topics,
                            ...entities,
                            title
                        ],
                        original_user_input: "",
                        core_question: "",
                        specific_task: "",
                        requires_search: true,
                        constraints: "",
                        output_format: "",
                        context: "",
                        concepts_key_terms: []
                    },
                    types: [
                        SupportedContentTypes.TextBlock,
                        SupportedContentTypes.ImageBlock
                    ]
                });
            }
        }
    }

    const getPostDataForRef = (ref: PostRef) => {
        if (!posts.data) return null;
        return posts.data.find((p) => {
            const plugin = plugins.find(plugin => plugin.type === p.__typename);
            const identifier = plugin?.identifier || "remoteId";
            // @ts-ignore
            return p[identifier] === ref[identifier as string];
        });
    }

    return (
        <CardStack onOpen={onOpen}
                   openIndex={openIndex}
                   index={index}
                   height={Article_CARD_HEIGHT}
                   gap={50}
                   maxStackSize={Math.min(5, (items.length) + 2)}
        >
            <CategoryHeadCard data={props.data}
                              blur={isOneOfStacksOpen && !isOpen}
                              open={isOpen}
                              onClick={onStackClicked}
                              index={index}
                              delay={delay}
            />
            {
                items
                    .filter(item => (
                        item.__typename !== SupportedContentTypes.TextBlock
                        && item.__typename !== SupportedContentTypes.ImageBlock
                    ))
                    .map((ref, i) => {
                        return (
                            <DefaultCard key={`a-${i}`}
                                         className={`${isOpen ? "bg-gray-200/100" : "bg-default-200/100"}`}
                            >
                                {
                                    isOpen && (() => {
                                        switch (ref.__typename) {
                                            case SupportedContentTypes.VideoFile:
                                                return (
                                                    <DefaultsVideoCardBody data={getPostDataForRef(ref) as EnhancedVideoFile}/>
                                                )
                                            case SupportedContentTypes.GoogleDoc:
                                                return (
                                                    <DefaultsArticleCardBody data={getPostDataForRef(ref) as EnhancedGDoc}/>
                                                )
                                            default:
                                                return null;
                                        }
                                    })()

                                }
                            </DefaultCard>
                        )
                    })
            }

            <DefaultCard
                className={`p-6 ${isOpen ? "bg-content1" : "bg-default-200/100"}`}
                style={{
                    height: isOpen ? "auto" : "auto",
                    overflow: isOpen ? "auto" : "hidden",
                }}>
                {
                    isOpen &&
                    <div>
                        <div className={"text-sm pb-4"}>Related content blocks</div>
                        <BlockList payload={{
                            data: blocks.data || null,
                            isLoading: blocks.isLoading,
                            error: blocks.error
                        } as SWRResponse<ContentBlock[]|null, any>}
                                   pageSize={6}
                        />
                    </div>
                }
            </DefaultCard>

        </CardStack>
    )
}
