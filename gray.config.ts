import {NextlogConfig} from "@/types/gray.types";
import {ContentHandler} from "@/lib/content-plugins";
import {defaultVideoFileHandlerOptions} from "@/lib/content-plugins/video-files";
import {videoComparator, videoEnhancer} from "@/lib/ai-thinkerers/content";

const configs: NextlogConfig ={
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
