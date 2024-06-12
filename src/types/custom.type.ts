import {AdditionalProps, IImageBlock, ISubtitleEntry, ITextBlock} from "@unbody-io/ts-client/build/core/documents";

import {CDefaultVideoFile,} from "@/lib/content-plugins/video-files/types";
import {CDefaultGDoc} from "@/lib/content-plugins/gdocs/types";


export type Base = {
    _additional: AdditionalProps
};

export type WithRef = {
    document: {
        title: string
        slug?: string
        _additional?: AdditionalProps
    }[]
};

// @ts-ignore
export type TextBlock = Pick<ITextBlock[number], any> & Base & WithRef;
export type ImageBlock = Pick<IImageBlock, any> & Base & WithRef;

export type EnhancedVideoFile = {
    speaker: string|null;
    title: string|null;
} & CDefaultVideoFile & Base;

export type EnhancedVideoFileWithContent = {
    subtitles: [{
        entries: ISubtitleEntry[]
    }]
} & EnhancedVideoFile;

export type EnhancedGDoc = {
} & CDefaultGDoc & Base

export type EnhancedGDocWithContent = {
    blocks: (TextBlock | ImageBlock)[]
    autoKeywords: string[]
    autoEntities: string[]
    autoTopics: string[]
} & EnhancedGDoc

export type EnhancedTextBlock = {
} & TextBlock

export type EnhancedImageBlock = {
} & ImageBlock

