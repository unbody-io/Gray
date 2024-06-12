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

export const defaultHandlerOptions: ContentHandlerConfig = {
    type: SupportedContentTypes.TextBlock,
    label: "Text Blocks",
    fetcher,
    searcher,
    searcherQ,
    enhancer,
    summarizer,
    getPost: () => Promise.resolve(null),
    fields: fields as unknown as Fields[],
    prefetch: false
}

export default new ContentHandler(defaultHandlerOptions);
