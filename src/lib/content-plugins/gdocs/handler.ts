import {ContentHandler} from "@/lib/content-plugins";
import {SupportedContentTypes} from "@/types/plugins.types";
import {ContentHandlerConfig} from "@/lib/content-plugins/handler.class";

import fetcher from "./fetcher";
import enhancer from "./enhancer";
import summarizer from "./summarizer";
import searcher from "./searcher";
import searcherQ from "./searcherQ";
import getPost from "./getPost";

import {fields} from "./config";
import {Fields} from "./types";

export const defaultHandlerOptions: ContentHandlerConfig = {
    type: SupportedContentTypes.GoogleDoc,
    label: "Article",
    fetcher,
    searcher,
    searcherQ,
    enhancer,
    summarizer,
    getPost,
    fields: fields as unknown as Fields[],
    identifier: "slug",
}

export default new ContentHandler(defaultHandlerOptions);
