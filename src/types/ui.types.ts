import {HandlerPublicConfigs} from "@/lib/content-plugins/handler.class";
import {ISubtitleEntry} from "@unbody-io/ts-client/build/core/documents";

export enum ESearchMode {
    Read = "read",
    Search = "search",
}

export enum ESearchScope {
    "video"= "video",
    "article"= "article",
    "global"= "global",
}

export enum KeywordColor {
    Default = "default",
    Primary = "primary",
    Secondary = "secondary",
    Success = "success",
    Warning = "warning",
    Danger = "danger"
}

export type TagProps = {
    key: string,
    type: string,
}

export type SearchResultGroup<T> = {
    config: HandlerPublicConfigs;
    data: T[];
}


export type SubtitleChunk = {
    entries: ISubtitleEntry[];
}



