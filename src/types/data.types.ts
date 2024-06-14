import {
    AdditionalProps,
    IGoogleDoc,
    IImageBlock,
    ITextBlock,
    IVideoFile
} from "@unbody-io/ts-client/build/core/documents";
import {id} from "postcss-selector-parser";
import {TextBlock} from "@unbody-io/ts-client/build/types/TextBlock.types";
import {SupportedContentTypes} from "@/types/plugins.types";
import {NextLogConfigData} from "@/types/gray.types";

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
    items: PostRef[];
}

export type PostRef = {
    __typename: SupportedContentTypes;
} & {[key: string]: string};

export type Directory = {
    slug: string;
    name: string;
    title: string;
    text: string;
    html: string;

    autoEntities: string[];
    autoTopics: string[];
    autoKeywords: string[];
    autoSummary: string;

    cover: IImageBlock;

    items: PostRef[];
    customData: {
        type: string
        dateValue: string
        dateLabel: string
        location: string
        locationLabel: string
    } | null
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
    subtitle = "subtitle",
    pathString = "pathString",
    typeName= "__typename",
    id= "remoteId",
    autoSummary = "autoSummary",
}

export type MiniArticleKeys =
    EMiniArticleKeys.modifiedAt
    | EMiniArticleKeys.slug
    | EMiniArticleKeys.summary
    | EMiniArticleKeys.title
    | EMiniArticleKeys.subtitle
    | EMiniArticleKeys.pathString
    | EMiniArticleKeys.typeName
    | EMiniArticleKeys.id
    | EMiniArticleKeys.autoSummary;

export type MiniArticle = Pick<IGoogleDoc, MiniArticleKeys>;

export enum EMiniTextBlockKeys{
    html = "html",
    order = "order",
    slug = "document.GoogleDoc.slug",
    title = "document.GoogleDoc.title",
    classNames = "classNames",
    text = "text",
    certainty = "_additional.certainty",
    typeName = "__typename"
}
export type MiniTextBlockKeys =
    EMiniTextBlockKeys.html
    | EMiniTextBlockKeys.text
    | EMiniTextBlockKeys.order
    | EMiniTextBlockKeys.slug
    | EMiniTextBlockKeys.title
    | EMiniTextBlockKeys.classNames
    | EMiniTextBlockKeys.certainty
    | EMiniTextBlockKeys.typeName;

export type MiniTextBlock = ITextBlock & {
    document: {
       slug: string
       title: string
    }[]
    _additional: AdditionalProps
};


export type ImageBlock = {
    url: string;
    alt: string;
    width: number;
    height: number;
    _additional: AdditionalProps
    document: {
        slug: string
        title: string
    }[]
} &  IImageBlock;


export type SiteData = {
    icon: string,
    context: SiteContext
    categories: Category[]
    directories: Directory[]
    socials: {label: string, link: string, provider: string}[]
    configs: NextLogConfigData;
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

export type SiteContext = {
    title: string;

    autoSummary: string|null;
    autoKeywords: string[];
    autoTopics: string[];
    autoEntities: string[];

    contentSummary: string;
    availableContentTypes: SupportedContentTypes[]

    seoKeywords: string[];
    seoDescription: string;

    siteType: SiteType.BLOG | SiteType.JOURNAL | SiteType.OUTLET | SiteType.PODCAST | SiteType.PORTFOLIO;

    contributors: string[];

    querySuggestions: string[]
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

    querySuggestions?: string[]
}


export enum SiteType {
    BLOG = "blog",
    PORTFOLIO = "portfolio",
    OUTLET = "outlet",
    JOURNAL = "journal",
    PODCAST = "podcast",
}


export type ContentBlock = ImageBlock | MiniTextBlock;
