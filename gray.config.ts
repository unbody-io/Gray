import {ContentHandler} from "@/lib/content-plugins";
import {defaultVideoFileHandlerOptions} from "@/lib/content-plugins/video-files";
import {videoComparator, videoEnhancer} from "@/lib/ai-thinkerers/content";
import {GrayConfig} from "@/types/gray.types";

const configs: GrayConfig ={
    icon: "/img.png",
    title: "AI Tinkerers Blog (Amsterdam)",
    querySuggestions: [
        "Who are you?",
        "Compare the talk by Lucas and Tomas",
        "What are advantages of small models?",
        "Which speaker talked about the future of AI?",
        "Summarize all given posts in one sentence"
    ],
    socials: [
        {
            "label": "Twitter",
            "link": "https://twitter.com",
            "provider": "x"
        },
        {
            "label": "Facebook",
            "link": "https://facebook.com",
            "provider": "facebook"
        }
    ],
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
