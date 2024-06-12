import {ContentHandler} from "@/lib/content-plugins";
import {SupportedContentTypes} from "@/types/plugins.types";

import fetcher from "./fetcher";
import enhancer from "./enhancer";
import summarizer from "./summarizer";
import searcher from "./searcher";
import searcherQ from "./searcherQ";

import {fields} from "./config";
import {Fields} from "./types";
import {ContentHandlerConfig} from "@/lib/content-plugins/handler.class";
import getPost from "./getPost";

export const defaultHandlerOptions: ContentHandlerConfig = {
    type: SupportedContentTypes.VideoFile,
    label: "Video",
    fetcher,
    searcher,
    searcherQ,
    getPost,
    enhancer,
    summarizer,
    fields: fields as unknown as Fields[],
}

export default new ContentHandler(defaultHandlerOptions);
