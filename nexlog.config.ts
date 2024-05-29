import {SupportedContentTypes} from "@/types/plugins.types";
import {ContentHandler} from "@/lib/content-plugins";

export default {
    contentPlugins: [
        new ContentHandler<any, any>({
            fetcher: async () => ([{}]),
            enhancer: async (rawData) => rawData,
            summarizer: () => "rawData",
            type: SupportedContentTypes.VideoFile
        })
    ]
}
