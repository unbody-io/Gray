import {IGoogleDoc, IImageBlock, ITextBlock} from "@unbody-io/ts-client/build/core/documents";
import {uniqueBy} from "@/utils/data.utils";
import {FC, useMemo} from "react";
import {ImageBlock} from "@/types/data.types";
import {EnhancedGDocWithContent} from "@/types/custom.type";
import {TextBlock} from "@unbody-io/ts-client/build/types/TextBlock.types";
import {SupportedContentTypes} from "@/types/plugins.types";
import {GDocPostHeader} from "@/components/post/GDoc.Post.Header";
import {GDocPostBody} from "@/components/post/GDoc.Post.Body";

type Props = {
    data: EnhancedGDocWithContent
}

const isTitle = (block: TextBlock) => {
    // @ts-ignore
    return (block.classNames || []).includes("title");
}

export const isPreviewImage = (block: ITextBlock | IImageBlock) => {
    //@ts-ignore
    return block.__typename === "ImageBlock" && block.order < 3;
}


export const GDocPost = ({data}: Props) => {
    const keywords = useMemo(() => {
        return uniqueBy([
            ...(data.autoKeywords as string[] || []).map((keyword) => ({key: keyword, type: "keyword"})),
            ...(data.autoEntities as string[] || []).map((entity) => ({key: entity, type: "entity"})),
            ...(data.autoTopics as string[] || []).map((topic) => ({key: topic, type: "topic"}))
        ], 'key')
    }, [data]);

    const previewImage = useMemo(() => {
        return (data.blocks as (ITextBlock | IImageBlock)[]).find(isPreviewImage) as ImageBlock
    }, [data.blocks]);

    const blocks = useMemo(() => {
        return (data.blocks)!
            .sort((a, b) => a.order - b.order)
            .filter(b => (
                !isPreviewImage(b as unknown as ImageBlock)
                && (
                    b.__typename === SupportedContentTypes.TextBlock
                    && !isTitle(b as unknown as TextBlock)
                )
            ))
    }, [data.blocks]);

    return (
        <div className={"flex flex-col items-center"}>
            <GDocPostHeader data={data as IGoogleDoc}
                            previewImage={previewImage}
            />
            <GDocPostBody data={{...data, blocks: blocks}}
                          keywords={keywords}
            />
        </div>
    )
}


