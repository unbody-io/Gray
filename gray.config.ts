import {ContentHandler} from "@/lib/content-plugins";
import {defaultVideoFileHandlerOptions} from "@/lib/content-plugins/video-files";
import {videoComparator, videoEnhancer} from "@/lib/ai-thinkerers/content";
import {GrayConfig} from "@/types/gray.types";

const configs: GrayConfig ={
    contentPlugins: [
        new ContentHandler<any, any>({
            ...defaultVideoFileHandlerOptions,
            enhancer: videoEnhancer,
            comparator: videoComparator,
            summarizer: ({originalName, autoSummary}) => {
                return `${originalName} - ${autoSummary}`
            },
        })
    ]
}

export default configs;
