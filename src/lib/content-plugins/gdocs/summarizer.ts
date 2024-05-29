import {CDefaultGDoc} from "@/lib/content-plugins/gdocs/types";

export default ({title, autoSummary}: CDefaultGDoc&any, index: number): string => {
    return `${title}; ${autoSummary}`;
}
