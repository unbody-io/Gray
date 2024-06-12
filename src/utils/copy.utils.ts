import {SupportedContentTypes} from "@/types/plugins.types";

export const convertPostTypeToLabel = (type: SupportedContentTypes): string => {
    switch (type) {
        case SupportedContentTypes.VideoFile:
            return "Videos";
        case SupportedContentTypes.GoogleDoc:
            return "Articles";
        case SupportedContentTypes.TextBlock:
            return "Blocks";
        default:
            return "Content";
    }
}
