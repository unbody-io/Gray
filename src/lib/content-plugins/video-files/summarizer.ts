import {CDefaultVideoFile} from "@/lib/content-plugins/video-files/types";

export default ({originalName, autoSummary}: CDefaultVideoFile&any, index: number): string => {
    return `${originalName}; ${autoSummary}`;
}
