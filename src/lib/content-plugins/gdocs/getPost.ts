import {GetPostFn, GetPostHandlerFn} from "@/lib/content-plugins/handler.class";
import {unbody} from "@/services/unbody.service";
import {CDefaultGDocWithContent} from "./types";

const getPost: GetPostHandlerFn<CDefaultGDocWithContent> = async (idKey: string, idValue: string) => {
    const query = unbody.get
        .googleDoc
        .where({
            [idKey]: idValue,
        })
        .select(
            "title",
            "autoTopics",
            "autoSummary",
            "autoKeywords",
            "autoEntities",
            "title",
            "slug",
            "subtitle",
            "toc",
            // @ts-ignore
            "modifiedAt",
            "blocks.TextBlock.order",
            "blocks.TextBlock.html",
            "blocks.TextBlock.text",
            "blocks.TextBlock.tagName",
            "blocks.TextBlock.classNames",
            "blocks.ImageBlock.order",
            "blocks.ImageBlock.width",
            "blocks.ImageBlock.height",
            "blocks.ImageBlock.url",
            "blocks.ImageBlock.title",
            "blocks.ImageBlock.alt",
            "blocks.ImageBlock.__typename",
            "blocks.TextBlock.__typename",
            "mentions"
        )
    const {data: {payload}} = await query.exec();
    return payload[0] as CDefaultGDocWithContent || null;
}

export default getPost;
