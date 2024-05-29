import {NexlogConfig} from "@/types/nexlog.types";
import {ContentHandler} from "@/lib/content-plugins";
import {SupportedContentTypes} from "@/types/plugins.types";
import {gdocDefaultEnhancer, gdocDefaultFetcher} from "@/lib/content-plugins/gdocs";

const defaults: NexlogConfig = {
    contentPlugins: [
        new ContentHandler({
            fetcher: gdocDefaultFetcher,
            enhancer: gdocDefaultEnhancer,
            summarizer: () => "rawData",
            type: SupportedContentTypes.GDoc
        }),
    ]
}

export default defaults;
