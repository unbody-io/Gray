import {
    AdditionalProps,
    IGoogleDoc,
    IImageBlock,
    ITextBlock,
    IVideoFile
} from "@unbody-io/ts-client/build/core/documents";
import {id} from "postcss-selector-parser";
import {TextBlock} from "@unbody-io/ts-client/build/types/TextBlock.types";

export type NameEntity = {
    entity: string
    type: string
}

type AutoFieldRaw = string[]|null;
type AutoField = string[];

export type AutoFieldsRaw = {
    autoEntities: AutoFieldRaw;
    autoTopics: AutoFieldRaw;
    autoKeywords: AutoFieldRaw;
    autoTypes: AutoFieldRaw;
}

export type AutoFields = {
    topics: AutoField
    entities: AutoField
    keywords: AutoField
    types: AutoField
}

export type CategoryRaw = {
    title: string;
    summary: string;
    topics: string[];
    entities: string[];
}

export type Category = Pick<CategoryRaw, "title"|"summary"|"topics"|"entities"> & {
    articles: MiniArticle[];
    blocks: Array<MiniTextBlock|ImageBlock>;
    videos: IVideoFile[];
}

export type Topic = {
    topic: string;
    weight: number;
}

export enum EMiniArticleKeys{
    title = "title",
    slug = "slug",
    summary = "summary",
    modifiedAt = "modifiedAt",
    subtitle = "subtitle"
}

export type MiniArticleKeys =
    EMiniArticleKeys.modifiedAt
    | EMiniArticleKeys.slug
    | EMiniArticleKeys.summary
    | EMiniArticleKeys.title
    | EMiniArticleKeys.subtitle;

export type MiniArticle = Pick<IGoogleDoc, MiniArticleKeys>;


export enum EMiniTextBlockKeys{
    html = "html",
    order = "order",
    slug = "document.GoogleDoc.slug",
    title = "document.GoogleDoc.title",
    classNames = "classNames",
    text = "text",
    certainty = "_additional.certainty"
}
export type MiniTextBlockKeys =
    EMiniTextBlockKeys.html
    | EMiniTextBlockKeys.text
    | EMiniTextBlockKeys.order
    | EMiniTextBlockKeys.slug
    | EMiniTextBlockKeys.title
    | EMiniTextBlockKeys.classNames
    | EMiniTextBlockKeys.certainty

// @ts-ignore
export type MiniTextBlock = Pick<ITextBlock, MiniTextBlockKeys> & {
    document: {
       slug: string
       title: string
    }[]
    _additional: AdditionalProps
}


export type SiteData = {
    context: SiteContext
    categories: Category[]
    socials: {label: string, link: string, provider: string}[]
}

export enum QueryContextKey {
    topic = "topics",
    keyword = "keywords",
    entity = "entities"
}

export type QueryContextItem = {
    key: QueryContextKey;
    value: string| string[] | undefined;
}


export type AskEndpointResponse = MiniTextBlock & {
    _additional: AdditionalProps
    document: Pick<IGoogleDoc, "title"|"slug">[]
}

export type SearchContextResponse = {
    introduction: string
    isQuestion?: boolean
    concepts?: string[]
}

export type ReadPageResponse = ReadPageData;

export type ReadPageData = {
    result: string,
    from: TextBlock[]
}


export interface ImageBlock extends IImageBlock{
    url: string;
    alt: string;
    width: number;
    height: number;
    _additional: AdditionalProps
}


export type SiteContext = {
    title: string;

    autoSummary: string;
    autoKeywords: string[];
    autoTopics: string[];
    autoEntities: string[];

    contentSummary: string;
    availableContentTypes: string[]

    seoKeywords: string[];
    seoDescription: string;

    siteType: SiteType.BLOG | SiteType.JOURNAL | SiteType.OUTLET | SiteType.PODCAST | SiteType.PORTFOLIO;

    contributors: string[];
}

export type SiteContextConfig = {
    title?: string;
    autoSummary?: string;
    autoKeywords?: string[];
    autoTopics?: string[];
    autoEntities?: string[];

    contentSummary?: string;
    availableContentTypes?: string[]

    seoKeywords?: string[];
    seoDescription?: string;

    siteType?: SiteType.BLOG | SiteType.JOURNAL | SiteType.OUTLET | SiteType.PODCAST | SiteType.PORTFOLIO;

    contributors?: string[];
}


export enum SiteType {
    BLOG = "blog",
    PORTFOLIO = "portfolio",
    OUTLET = "outlet",
    JOURNAL = "journal",
    PODCAST = "podcast",
}


