import {SWRResponse} from "swr";
import {ContentBlock, ImageBlock, MiniArticle, MiniTextBlock} from "@/types/data.types";
import React from "react";
import {BlockCard} from "@/components/BlockCard";
import {TextBlockCardBody} from "@/components/TextBlockCard.Body";
import {Button} from "@nextui-org/button";
import {ImageBlockCardBody} from "@/components/ImageBlockCard.Body";
import {SupportedContentTypes} from "@/types/plugins.types";

type ArticleListProps = {
    payload: SWRResponse<ContentBlock[] | null, any>
    pageSize?: number
}

export const BlockList = (props: ArticleListProps) => {
    const {payload: {data, isLoading, error}, pageSize = 3} = props;
    const [page, setPage] = React.useState(1);

    if (error) return <div>Error</div>;
    if (isLoading) return <div>Loading...</div>;
    if (!data || data.length===0) return null;

    return (
        <div>
            {
                <div className={"flex flex-col gap-4"}>
                    <div className={"grid gap-6 grid-cols-2"}>
                        {
                            data
                                .slice(0, page * pageSize)
                                .map((block, index) => (
                                    <BlockCard key={index}
                                               className={""}
                                    >
                                        {
                                            (() => {
                                                switch (block.__typename) {
                                                    case SupportedContentTypes.TextBlock:
                                                        return (
                                                            <TextBlockCardBody data={block as MiniTextBlock}/>
                                                        )
                                                    case SupportedContentTypes.ImageBlock:
                                                        return (
                                                            <ImageBlockCardBody data={block as ImageBlock}/>
                                                        )
                                                    default:
                                                        return "null";
                                                }
                                            })()
                                        }
                                    </BlockCard>
                                ))
                        }
                    </div>
                    <div className={"m-auto pt-4 flex gap-4"}>
                        {
                            page * pageSize < data.length &&
                            <Button onClick={() => setPage(page + 1)}>More</Button>
                        }
                        {
                            page > 1 &&
                            <Button onClick={() => setPage(page - 1)}>Less</Button>
                        }
                    </div>
                </div>
            }
        </div>
    )
}
