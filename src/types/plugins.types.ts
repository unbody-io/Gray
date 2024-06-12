import {SiteData} from "@/types/data.types";
import {StructuredUserInput} from "@/types/prompt.types";
import {NexlogConfigAll} from "@/types/nexlog.types";
import React from "react";
import {UiComponents} from "@/lib/content-plugins/handler.class";

export enum SupportedContentTypes {
    GoogleDoc = "GoogleDoc",
    VideoFile = "VideoFile",
    TextBlock = "TextBlock",
    ImageBlock = "ImageBlock",
}

export type SupportedContentTypesKeys = keyof typeof SupportedContentTypes;

export type InitialPostsData<ED> = {
    type: SupportedContentTypes;
    posts: ED[];
    summary: string;
}

export type PromptHandlerFn = {
    create: (configs: NexlogConfigAll, siteData: SiteData, userInput: StructuredUserInput) => string;
    parse: (output: string) => string|null;
};

export type PromptConfig = {
    type: SupportedContentTypes;
    handler: PromptHandlerFn;
}

export type SearchConfig = {
    prompts: PromptConfig[];
}

