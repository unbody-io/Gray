import {AdditionalProps, IGoogleDoc, IImageBlock, ITextBlock} from "@unbody-io/ts-client/build/core/documents";
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
}

export type AutoFields = {
    topics: AutoField
    entities: AutoField
    keywords: AutoField
}

export type CategoryRaw = {
    title: string;
    summary: string;
    topics: string[];
    entities: string[];
}

export type Category = Pick<CategoryRaw, "title"|"summary"|"topics"|"entities"> & {
    articles: MiniArticle[];
    blocks: MiniTextBlock[];
}

export type GeneralContentDataRaw = {
    topics: string[];
    intro: string;
    entities: NameEntity[];
    categories: CategoryRaw[];
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

export type MiniArticleKeys = EMiniArticleKeys.modifiedAt | EMiniArticleKeys.slug | EMiniArticleKeys.summary | EMiniArticleKeys.title | EMiniArticleKeys.subtitle;

export type MiniArticle = Pick<IGoogleDoc, MiniArticleKeys>;


export enum EMiniTextBlockKeys{
    html = "html",
    order = "order",
    slug = "document.GoogleDoc.slug",
    title = "document.GoogleDoc.title",
    classNames = "classNames",
    text = "text"
}
export type MiniTextBlockKeys =
    EMiniTextBlockKeys.html
    | EMiniTextBlockKeys.text
    | EMiniTextBlockKeys.order
    | EMiniTextBlockKeys.slug
    | EMiniTextBlockKeys.title
    | EMiniTextBlockKeys.classNames;

// @ts-ignore
export type MiniTextBlock = Pick<ITextBlock, MiniTextBlockKeys> & {
    document: {
       slug: string
       title: string
    }[]
}

export type SiteConfigs = {
    title: string
    description: string
    socials: {title: string, link: string, type: "x"|"linkedin"}[]
}

export type SiteData = {
    intro: string,
    categories: Category[]
} & AutoFields

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
}
