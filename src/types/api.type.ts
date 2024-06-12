import { IVideoFile } from "@unbody-io/ts-client";
import {StructuredUserInput} from "@/types/prompt.types";
import {CDefaultGDoc, CDefaultGDocResponse} from "@/lib/content-plugins/gdocs/types";
import {CDefaultVideoFile} from "@/lib/content-plugins/video-files/types";
import {EnhancedGDoc, EnhancedTextBlock, EnhancedVideoFile, TextBlock} from "@/types/custom.type";
import {IImageBlock, ITextBlock} from "@unbody-io/ts-client/build/core/documents";
import {SupportedContentTypes} from "@/types/plugins.types";
import {ImageBlock, MiniArticle, PostRef} from "@/types/data.types";

export namespace ApiTypes{

    export namespace Rq{
        export type Search = {
            input: StructuredUserInput;
            filters?: string[];
            types?: SupportedContentTypes[];
        }

        export type ParsedQuery = {
            input?: string;
            filters?: string[];
        }

        export type StaticPosts = {
            posts: PostRef[]
        }

    }

    export namespace Rs{
        export type ParsedQuery = StructuredUserInput;

        export type AISearchSummary<T> = {
            summary: string;
            results: T | Array<CDefaultGDocResponse|CDefaultVideoFile>
        }

        export type SearchResults<T = EnhancedGDoc[]|EnhancedVideoFile[]|EnhancedTextBlock[]|ImageBlock[]> = {
            type: SupportedContentTypes,
            data: T
        }[]

        export type StaticPosts = Array<EnhancedVideoFile>;

        export type RelatedArticles = EnhancedGDoc[];
        export type RelatedVideos = EnhancedVideoFile[];
        export type RelatedBlocks = Array<ITextBlock|IImageBlock>;
    }

}
